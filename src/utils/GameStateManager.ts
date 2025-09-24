import type { GameState, Badge, LapRecord, StorageData } from '../types';

class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;
  private storageKey = 'f1-portfolio-data';

  private constructor() {
    this.state = this.getInitialState();
    this.loadFromStorage();
  }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private getInitialState(): GameState {
    return {
      currentScene: 'garage',
      visitedProjects: new Set<string>(),
      badges: [],
      lapStartTime: null,
      lapEndTime: null,
      bestLapTime: null,
      theme: this.getSystemTheme(),
      isTimerRunning: false,
    };
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }

  // Scene Management
  setCurrentScene(scene: GameState['currentScene']): void {
    this.state.currentScene = scene;
    this.saveToStorage();
    
    // Start timer when entering track for first time
    if (scene === 'track' && !this.state.isTimerRunning) {
      this.startLapTimer();
    }
  }

  getCurrentScene(): GameState['currentScene'] {
    return this.state.currentScene;
  }

  // Project Tracking
  visitProject(projectId: string): boolean {
    const wasNew = !this.state.visitedProjects.has(projectId);
    this.state.visitedProjects.add(projectId);
    
    if (wasNew) {
      this.awardBadge({
        id: `visited-${projectId}`,
        name: 'Pit Stop Complete',
        description: `Visited ${projectId}`,
        icon: '🏁',
        earnedAt: new Date(),
        category: 'exploration',
      });
      
      this.checkLapCompletion();
    }
    
    this.saveToStorage();
    return wasNew;
  }

  getVisitedProjects(): Set<string> {
    return new Set(this.state.visitedProjects);
  }

  isProjectVisited(projectId: string): boolean {
    return this.state.visitedProjects.has(projectId);
  }

  // Timer Management
  startLapTimer(): void {
    this.state.lapStartTime = Date.now();
    this.state.isTimerRunning = true;
    this.state.lapEndTime = null;
    this.saveToStorage();
  }

  stopLapTimer(): number | null {
    if (!this.state.lapStartTime || !this.state.isTimerRunning) {
      return null;
    }

    this.state.lapEndTime = Date.now();
    this.state.isTimerRunning = false;
    const lapTime = this.state.lapEndTime - this.state.lapStartTime;

    // Check if it's a new best time
    if (!this.state.bestLapTime || lapTime < this.state.bestLapTime) {
      this.state.bestLapTime = lapTime;
      this.awardBadge({
        id: 'new-record',
        name: 'New Record!',
        description: `Completed lap in ${this.formatTime(lapTime)}`,
        icon: '🏆',
        earnedAt: new Date(),
        category: 'speed',
      });
    }

    // Save lap record
    this.saveLapRecord(lapTime);
    this.saveToStorage();
    
    return lapTime;
  }

  getCurrentLapTime(): number {
    if (!this.state.lapStartTime || !this.state.isTimerRunning) {
      return 0;
    }
    return Date.now() - this.state.lapStartTime;
  }

  getBestLapTime(): number | null {
    return this.state.bestLapTime;
  }

  resetTimer(): void {
    this.state.lapStartTime = null;
    this.state.lapEndTime = null;
    this.state.isTimerRunning = false;
    this.state.visitedProjects.clear();
    this.saveToStorage();
  }

  // Badge System
  awardBadge(badge: Badge): void {
    // Prevent duplicate badges
    const exists = this.state.badges.some(b => b.id === badge.id);
    if (!exists) {
      this.state.badges.push(badge);
      this.saveToStorage();
    }
  }

  getBadges(): Badge[] {
    return [...this.state.badges];
  }

  // Theme Management
  setTheme(theme: 'light' | 'dark'): void {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.saveToStorage();
  }

  getTheme(): 'light' | 'dark' {
    return this.state.theme;
  }

  toggleTheme(): void {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Private Methods
  private checkLapCompletion(): void {
    // Assuming we have 4 projects to visit for a complete lap
    const totalProjects = 4;
    if (this.state.visitedProjects.size === totalProjects) {
      const lapTime = this.stopLapTimer();
      if (lapTime) {
        this.awardBadge({
          id: 'lap-complete',
          name: 'Lap Complete!',
          description: 'Visited all pit stops',
          icon: '🏁',
          earnedAt: new Date(),
          category: 'completion',
        });
      }
    }
  }

  private saveLapRecord(lapTime: number): void {
    const stored = this.getStoredData();
    const newRecord: LapRecord = {
      time: lapTime,
      date: new Date(),
      projectsVisited: this.state.visitedProjects.size,
      badgesEarned: this.state.badges.length,
    };
    
    stored.lapRecords = stored.lapRecords || [];
    stored.lapRecords.push(newRecord);
    
    // Keep only the last 10 records
    stored.lapRecords = stored.lapRecords
      .sort((a, b) => a.time - b.time)
      .slice(0, 10);
      
    this.saveStoredData(stored);
  }

  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  // Storage Management
  private saveToStorage(): void {
    try {
      const stored = this.getStoredData();
      stored.gameState = {
        currentScene: this.state.currentScene,
        visitedProjects: Array.from(this.state.visitedProjects) as any,
        badges: this.state.badges,
        lapStartTime: this.state.lapStartTime,
        lapEndTime: this.state.lapEndTime,
        bestLapTime: this.state.bestLapTime,
        theme: this.state.theme,
        isTimerRunning: this.state.isTimerRunning,
      };
      this.saveStoredData(stored);
    } catch (error) {
      console.warn('Failed to save game state:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = this.getStoredData();
      if (stored.gameState) {
        const { gameState } = stored;
        
        if (gameState.currentScene) this.state.currentScene = gameState.currentScene;
        if (gameState.visitedProjects) {
          this.state.visitedProjects = new Set(gameState.visitedProjects as any);
        }
        if (gameState.badges) this.state.badges = gameState.badges;
        if (gameState.lapStartTime !== undefined) this.state.lapStartTime = gameState.lapStartTime;
        if (gameState.lapEndTime !== undefined) this.state.lapEndTime = gameState.lapEndTime;
        if (gameState.bestLapTime !== undefined) this.state.bestLapTime = gameState.bestLapTime;
        if (gameState.theme) this.state.theme = gameState.theme;
        if (gameState.isTimerRunning !== undefined) this.state.isTimerRunning = gameState.isTimerRunning;
      }
      
      // Apply theme
      document.documentElement.setAttribute('data-theme', this.state.theme);
    } catch (error) {
      console.warn('Failed to load game state:', error);
    }
  }

  private getStoredData(): StorageData {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultStorageData();
    } catch (error) {
      console.warn('Failed to parse stored data:', error);
      return this.getDefaultStorageData();
    }
  }

  private saveStoredData(data: StorageData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private getDefaultStorageData(): StorageData {
    return {
      gameState: {},
      lapRecords: [],
      settings: {
        theme: this.getSystemTheme(),
        audio: true,
        a11y: {
          reduceMotion: false,
          highContrast: false,
          announcements: true,
        },
      },
    };
  }

  // Public API for getting records
  getLapRecords(): LapRecord[] {
    const stored = this.getStoredData();
    return stored.lapRecords || [];
  }

  clearData(): void {
    localStorage.removeItem(this.storageKey);
    this.state = this.getInitialState();
  }

  // Get complete state for debugging
  getState(): GameState {
    return { ...this.state };
  }
}

export default GameStateManager;