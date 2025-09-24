import { GarageScene } from './scenes/GarageScene';
import { TrackScene } from './scenes/TrackScene';
import { ContactScene } from './scenes/ContactScene';
import GameStateManager from './utils/GameStateManager';
import type { GameState } from './types';

export class App {
  private gameState: GameStateManager;
  private currentScene: any;
  private container: HTMLElement;

  constructor() {
    this.gameState = GameStateManager.getInstance();
    this.container = document.getElementById('app')!;
    
    if (!this.container) {
      throw new Error('App container not found');
    }

    // Setup error handling
    this.setupErrorHandling();
  }

  init(): void {
    // Initialize the application
    this.setupEventListeners();
    this.loadInitialScene();
    this.setupAccessibility();
  }

  private setupEventListeners(): void {
    // Listen for scene changes
    this.container.addEventListener('scene-change', (event: any) => {
      this.changeScene(event.detail.scene);
    });

    // Listen for project interactions
    this.container.addEventListener('project-selected', (event: any) => {
      this.handleProjectSelection(event.detail);
    });

    // Handle window events
    window.addEventListener('resize', () => this.handleResize());
    
    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

    // Handle system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't manually set a theme preference
        if (!localStorage.getItem('f1-portfolio-data')) {
          this.gameState.setTheme(e.matches ? 'dark' : 'light');
          this.refreshCurrentScene();
        }
      });
    }
  }

  private loadInitialScene(): void {
    const currentScene = this.gameState.getCurrentScene();
    this.changeScene(currentScene);
  }

  private changeScene(sceneName: GameState['currentScene']): void {
    // Cleanup current scene
    if (this.currentScene && typeof this.currentScene.destroy === 'function') {
      this.currentScene.destroy();
    }

    // Clear container
    this.container.innerHTML = '';

    // Create and render new scene
    switch (sceneName) {
      case 'garage':
        this.currentScene = new GarageScene(this.container);
        break;
      case 'track':
        this.currentScene = new TrackScene(this.container);
        break;
      case 'contact':
        this.currentScene = new ContactScene(this.container);
        break;
      default:
        console.warn(`Unknown scene: ${sceneName}`);
        this.currentScene = new GarageScene(this.container);
        break;
    }

    // Render the scene
    if (this.currentScene && typeof this.currentScene.render === 'function') {
      this.currentScene.render();
    }

    // Update game state
    this.gameState.setCurrentScene(sceneName);

    // Announce scene change for screen readers
    this.announceSceneChange(sceneName);
  }

  private handleProjectSelection(projectData: any): void {
    // Mark project as visited
    const isNewVisit = this.gameState.visitProject(projectData.id);
    
    if (isNewVisit) {
      // Show success feedback
      this.showProjectVisitedFeedback(projectData.title);
      
      // Check if lap is complete
      this.checkLapCompletion();
    }
  }

  private checkLapCompletion(): void {
    const visitedProjects = this.gameState.getVisitedProjects();
    
    // Assuming 4 projects for a complete lap
    if (visitedProjects.size >= 4) {
      const lapTime = this.gameState.stopLapTimer();
      if (lapTime) {
        this.showLapCompletionModal(lapTime);
      }
    }
  }

  private showProjectVisitedFeedback(projectTitle: string): void {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-racing-gold text-racing-black px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span>🏁</span>
        <span class="font-racing font-bold">Pit Stop Complete!</span>
      </div>
      <div class="text-sm mt-1">${projectTitle}</div>
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  private showLapCompletionModal(lapTime: number): void {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content text-center">
        <div class="text-6xl mb-4">🏁</div>
        <h2 class="text-3xl font-racing font-bold text-racing-black dark:text-white mb-4">
          LAP COMPLETE!
        </h2>
        <div class="text-2xl font-racing text-racing-red mb-6">
          ${this.formatTime(lapTime)}
        </div>
        <p class="text-racing-grey mb-6">
          You've visited all pit stops! Ready for another lap or want to get in touch?
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            id="another-lap-btn" 
            class="racing-button"
          >
            Another Lap
          </button>
          <button 
            id="contact-me-btn" 
            class="px-6 py-3 rounded-lg border-2 border-racing-gold text-racing-gold hover:bg-racing-gold hover:text-racing-black transition-all duration-300 font-racing font-bold uppercase tracking-wider"
          >
            Contact Me
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners for modal buttons
    modal.querySelector('#another-lap-btn')?.addEventListener('click', () => {
      this.gameState.resetTimer();
      this.changeScene('track');
      modal.remove();
    });

    modal.querySelector('#contact-me-btn')?.addEventListener('click', () => {
      this.changeScene('contact');
      modal.remove();
    });

    // Close on escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  private refreshCurrentScene(): void {
    if (this.currentScene && typeof this.currentScene.render === 'function') {
      this.currentScene.render();
    }
  }

  private handleResize(): void {
    // Handle responsive updates
    if (this.currentScene && typeof this.currentScene.handleResize === 'function') {
      this.currentScene.handleResize();
    }
  }

  private handleVisibilityChange(): void {
    // Pause/resume based on visibility for performance
    if (document.hidden) {
      // Pause any running animations or timers
      if (this.currentScene && typeof this.currentScene.pause === 'function') {
        this.currentScene.pause();
      }
    } else {
      // Resume
      if (this.currentScene && typeof this.currentScene.resume === 'function') {
        this.currentScene.resume();
      }
    }
  }

  private announceSceneChange(sceneName: string): void {
    // Create announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    
    const sceneNames: Record<string, string> = {
      garage: 'Garage - Home screen',
      track: 'Racing track - Projects view',
      contact: 'Contact form'
    };
    
    announcement.textContent = `Navigated to ${sceneNames[sceneName] || sceneName}`;
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  private setupAccessibility(): void {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    this.container.setAttribute('id', 'main-content');
    this.container.setAttribute('role', 'main');

    // Setup focus management
    this.setupFocusManagement();
  }

  private setupFocusManagement(): void {
    // Trap focus within modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
        if (modals.length > 0) {
          const modal = modals[modals.length - 1]; // Get topmost modal
          this.trapFocusInModal(e, modal as HTMLElement);
        }
      }
    });
  }

  private trapFocusInModal(e: KeyboardEvent, modal: HTMLElement): void {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Application error:', event.error);
      this.showErrorMessage('An unexpected error occurred. Please refresh the page.');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.showErrorMessage('A network or loading error occurred.');
    });
  }

  private showErrorMessage(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span>⚠️</span>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-red-200">✕</button>
      </div>
    `;

    document.body.appendChild(errorDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 10000);
  }
}