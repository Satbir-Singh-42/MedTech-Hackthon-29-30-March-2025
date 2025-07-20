export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color?: string;
}

export interface MoodEntry {
  id: string;
  mood: string;
  notes?: string;
  timestamp: Date;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
  iconColor: string;
  route: string;
}

export interface Meditation {
  id: string;
  title: string;
  duration: string; // e.g., "5 minutes"
  imageUrl: string;
  description: string;
  instructor: {
    name: string;
    imageUrl?: string;
  };
  category: string;
  videoUrl?: string; // Optional video URL for meditation videos
}

export interface MeditationCategory {
  id: string;
  name: string;
  icon: string;
  sessionCount: number;
  bgColor: string;
  iconColor: string;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  description: string;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  tags?: string[];
  mood?: string;
}
