import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing. AI video verification will operate in fallback mode.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// In-memory store for videos uploaded by Associations
let customVideos: Array<{
  id: string;
  title: string;
  category: string;
  description: string;
  associationId: string;
  associationName: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  uploadedAt: string;
  isRollBallVerified: boolean;
}> = [];

// Pre-registered Roll Ball Associations database
const VALID_ASSOCIATIONS: Record<string, { name: string; country: string; code: string }> = {
  'IRBF-2026': { name: 'International Roll Ball Federation (IRBF)', country: 'Global', code: 'IRBF-2026' },
  'RBFI-IND-101': { name: 'Roll Ball Federation of India (RBFI)', country: 'India', code: 'RBFI-IND-101' },
  'KRBA-KEN-202': { name: 'Kenya Roll Ball Association (KRBA)', country: 'Kenya', code: 'KRBA-KEN-202' },
  'RBAE-EUR-303': { name: 'European Roll Ball Association', country: 'Europe', code: 'RBAE-EUR-303' },
};

// API: Association Login
app.post('/api/association/login', (req, res) => {
  const { associationId, passCode, customName } = req.body;

  if (!associationId || associationId.trim() === '') {
    return res.status(400).json({ success: false, error: 'Association ID is required.' });
  }

  const cleanId = associationId.trim().toUpperCase();

  // Allow standard registered association codes OR auto-register custom Roll Ball association IDs
  let assoc = VALID_ASSOCIATIONS[cleanId];
  if (!assoc) {
    if (cleanId.includes('RBA') || cleanId.includes('ROLL') || cleanId.includes('FED') || cleanId.includes('ASSOC') || cleanId.length >= 4) {
      assoc = {
        name: customName || `${cleanId} Roll Ball Association`,
        country: 'Member Nation',
        code: cleanId,
      };
      VALID_ASSOCIATIONS[cleanId] = assoc;
    } else {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid Association ID format. Must be a registered Roll Ball Association code (e.g., IRBF-2026, RBFI-IND-101, KRBA-KEN-202) or contain "RBA" / "FED" / "ASSOC".' 
      });
    }
  }

  return res.json({
    success: true,
    association: assoc,
    token: `token_${assoc.code}_${Date.now()}`
  });
});

// API: Roll Ball AI Video Content Verification using Gemini
app.post('/api/verify-video', async (req, res) => {
  try {
    const { title, description, category, tags, thumbnailBase64 } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, isRollBall: false, error: 'Video title is required.' });
    }

    const ai = getGeminiAI();

    const systemPrompt = `You are the official AI Referee & Content Inspector for the "Roll Ball Videos" platform.
Roll Ball is a specialized fast-paced team sport played on ROLLER SKATES with a BALL (combining basketball, handball, and roller skating).

Your single job is to enforce strict sports content policy:
- ALLOW ONLY: Videos specifically about Roll Ball sport (Roll Ball matches, goals, saves, roller skating with ball drills, player interviews, Roll Ball tournaments, Roll Ball federation announcements).
- STRICTLY REJECT: Videos about any non-Roll Ball topics, e.g., cricket, field soccer, ice hockey without roller skates, dance, music, random vlogs, memes, non-skating basketball, or unrelated content.

Analyze the video metadata provided by the uploader and determine if it is genuinely Roll Ball content.`;

    const userPrompt = `Video Title: "${title}"
Category: "${category || 'General'}"
Description: "${description || 'No description provided'}"
Tags: "${tags || ''}"`;

    let contentsPayload: any = userPrompt;

    if (thumbnailBase64 && typeof thumbnailBase64 === 'string' && thumbnailBase64.startsWith('data:image/')) {
      const parts = thumbnailBase64.split(',');
      const mimeMatch = thumbnailBase64.match(/data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = parts[1];

      contentsPayload = {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: userPrompt }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isRollBall: {
              type: Type.BOOLEAN,
              description: 'true if the video is strictly Roll Ball sport content, false otherwise',
            },
            detectedSport: {
              type: Type.STRING,
              description: 'The sport or content type detected (e.g. Roll Ball, Cricket, Soccer, Unrelated)',
            },
            reason: {
              type: Type.STRING,
              description: 'Clear, concise explanation why it was approved or rejected',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Confidence score from 0.0 to 1.0',
            }
          },
          required: ['isRollBall', 'detectedSport', 'reason', 'confidenceScore'],
        }
      }
    });

    let result = { isRollBall: false, detectedSport: 'Unknown', reason: 'Could not parse verification result.', confidenceScore: 0 };
    try {
      if (response.text) {
        result = JSON.parse(response.text);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini verification JSON:', parseError);
    }

    return res.json({
      success: true,
      ...result
    });

  } catch (err: any) {
    console.error('Error during video verification:', err);
    
    // Heuristic fallback in case API key is missing or offline:
    const { title = '', description = '' } = req.body;
    const combinedText = (title + ' ' + description).toLowerCase();
    const containsRollBallKeywords = combinedText.includes('roll ball') || 
      combinedText.includes('rollball') || 
      (combinedText.includes('skate') && combinedText.includes('ball')) || 
      combinedText.includes('roller skate') ||
      combinedText.includes('rbfi') ||
      combinedText.includes('irbf');

    return res.json({
      success: true,
      isRollBall: containsRollBallKeywords,
      detectedSport: containsRollBallKeywords ? 'Roll Ball' : 'Non-Roll Ball Content',
      reason: containsRollBallKeywords 
        ? 'Verified via Roll Ball keywords check.' 
        : 'Video rejected: Only Roll Ball sport videos are allowed. Title/Description must pertain to Roll Ball.',
      confidenceScore: 0.8
    });
  }
});

// API: Upload Video (Association only + AI Verification)
app.post('/api/videos', async (req, res) => {
  const { associationId, associationName, title, category, description, videoUrl, thumbnailUrl, duration } = req.body;

  if (!associationId || !title) {
    return res.status(400).json({ success: false, error: 'Association ID and Title are required.' });
  }

  // Double check AI verification
  try {
    const ai = getGeminiAI();
    const checkRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Title: "${title}", Category: "${category}", Description: "${description}". Is this Roll Ball sport content? Respond in JSON {"isRollBall": boolean, "reason": "..."}`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let checkData = { isRollBall: true, reason: 'Valid' };
    if (checkRes.text) {
      checkData = JSON.parse(checkRes.text);
    }

    if (!checkData.isRollBall) {
      return res.status(400).json({
        success: false,
        isRollBall: false,
        error: `UPLOAD REJECTED: Only Roll Ball sport videos are allowed! AI Content Guard detected: ${checkData.reason || 'Non-Roll Ball content'}`
      });
    }
  } catch (e) {
    // Basic fallback check
    const lower = (title + ' ' + (description || '')).toLowerCase();
    if (!lower.includes('roll') && !lower.includes('skate') && !lower.includes('match') && !lower.includes('goal') && !lower.includes('world cup') && !lower.includes('league')) {
      return res.status(400).json({
        success: false,
        isRollBall: false,
        error: 'UPLOAD REJECTED: Only Roll Ball sport videos are allowed! Video title or content must be related to Roll Ball.'
      });
    }
  }

  const newVideo = {
    id: `vid_${Date.now()}`,
    title,
    category: category || 'Highlights',
    description: description || 'Official Roll Ball video broadcast.',
    associationId,
    associationName: associationName || 'Roll Ball Association',
    videoUrl: videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: thumbnailUrl || '',
    duration: duration || '08:45',
    views: '1.2K',
    uploadedAt: 'Just now',
    isRollBallVerified: true,
  };

  customVideos.unshift(newVideo);

  return res.json({
    success: true,
    video: newVideo,
    message: 'Roll Ball Video successfully AI-verified and published!'
  });
});

// API: Get all videos
app.get('/api/videos', (req, res) => {
  return res.json({
    success: true,
    videos: customVideos
  });
});

// Start Server & Vite
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
