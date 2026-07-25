export type ViewType = 'home' | 'live' | 'videos' | 'tournaments' | 'profile';

export interface User {
  name: string;
  avatar: string;
}

export interface Association {
  code: string;
  name: string;
  country: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  associationId: string;
  associationName: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  views: string;
  uploadedAt: string;
  isRollBallVerified: boolean;
}
