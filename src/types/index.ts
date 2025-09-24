// Core game types
export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  techStack: string[];
  demoUrl?: string;
  codeUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  position: {
    x: number;
    y: number;
  };
  problems: string[];
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai' | 'other';
}

// Game state management
export interface GameState {
  currentScene: 'garage' | 'track' | 'contact';
  visitedProjects: Set<string>;
  badges: Badge[];
  lapStartTime: number | null;
  lapEndTime: number | null;
  bestLapTime: number | null;
  theme: 'light' | 'dark';
  isTimerRunning: boolean;
}

// Badge system
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'exploration' | 'speed' | 'completion' | 'special';
}

// Leaderboard entry
export interface LapRecord {
  time: number;
  date: Date;
  projectsVisited: number;
  badgesEarned: number;
}

// Phaser scene data
export interface SceneData {
  [key: string]: any;
}

// Contact form
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Audio management
export interface AudioManager {
  engineSound?: HTMLAudioElement;
  backgroundMusic?: HTMLAudioElement;
  clickSound?: HTMLAudioElement;
  successSound?: HTMLAudioElement;
  isMuted: boolean;
}

// Accessibility
export interface A11yOptions {
  reduceMotion: boolean;
  highContrast: boolean;
  announcements: boolean;
}

// Local storage schema
export interface StorageData {
  gameState: Partial<GameState>;
  lapRecords: LapRecord[];
  settings: {
    theme: 'light' | 'dark';
    audio: boolean;
    a11y: A11yOptions;
  };
}