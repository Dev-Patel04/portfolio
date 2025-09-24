import GameStateManager from '../utils/GameStateManager';
import type { Project } from '../types';
import projectsData from '../data/projects.json';

export class TrackScene {
  private readonly container: HTMLElement;
  private readonly gameState: GameStateManager;
  private readonly projects: Project[];
  private currentModal: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.gameState = GameStateManager.getInstance();
    this.projects = projectsData.projects as Project[];
  }

  render(): void {
    this.container.innerHTML = this.getHTML();
    this.attachEventListeners();
    this.initializeTrack();
  }

  private getHTML(): string {
    const visitedCount = this.gameState.getVisitedProjects().size;
    const currentTime = this.gameState.getCurrentLapTime();
    const isTimerRunning = this.gameState.getState().isTimerRunning;

    return `
      <div class="track-scene min-h-screen bg-gray-900 relative">
        <!-- Header HUD -->
        <div class="absolute top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-sm">
          <div class="flex justify-between items-center p-4">
            <button 
              id="back-to-garage" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-racing-red text-racing-red hover:bg-racing-red hover:text-white transition-all duration-300"
              aria-label="Return to garage"
            >
              ← Garage
            </button>
            
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="text-2xl font-racing font-bold text-white" id="lap-timer">
                  ${isTimerRunning ? this.formatTime(currentTime) : '00:00.00'}
                </div>
                <div class="text-sm text-racing-smoke">Lap Time</div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-racing font-bold text-racing-gold">
                  ${visitedCount}/4
                </div>
                <div class="text-sm text-racing-smoke">Pit Stops</div>
              </div>
              
              <button 
                id="reset-lap" 
                class="px-4 py-2 rounded-lg bg-racing-grey/20 text-racing-smoke hover:bg-racing-grey/40 transition-all duration-300 text-sm"
                ${!isTimerRunning ? 'disabled' : ''}
              >
                Reset Lap
              </button>
            </div>
          </div>
        </div>

        <!-- SVG Track -->
        <div class="absolute inset-0 top-16">
          <div id="track-container" class="w-full h-full overflow-hidden">
            ${this.createTrackSVG()}
          </div>
        </div>

        <!-- Instructions -->
        <div class="absolute bottom-6 left-6 z-20 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white max-w-md">
          <div class="text-lg font-racing font-bold mb-2">🏁 Instructions</div>
          <div class="text-sm space-y-1">
            <div>• Click pit stops to explore projects</div>
            <div>• Complete all 4 pit stops to finish!</div>
          </div>
        </div>

        <!-- Modal -->
        <div id="project-modal" class="modal-overlay hidden" role="dialog" aria-modal="true">
          <div class="modal-content max-w-4xl">
            <div id="modal-content"></div>
          </div>
        </div>
      </div>
    `;
  }

  private createTrackSVG(): string {
    return `
      <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#1a1a1a"/>
        
        <!-- Track -->
        <ellipse cx="400" cy="300" rx="350" ry="220" fill="none" stroke="#DC143C" stroke-width="4" opacity="0.8"/>
        
        <!-- Title -->
        <text x="400" y="50" text-anchor="middle" fill="#FFD700" font-size="24" font-weight="bold">F1 Racing Portfolio</text>
        
        <!-- Pit Stops -->
        ${this.projects.map((project, index) => {
          const isVisited = this.gameState.isProjectVisited(project.id);
          return `
            <g id="pit-stop-${index}" class="cursor-pointer" tabindex="0" role="button" aria-label="Pit stop: ${project.title}">
              <circle cx="${project.position.x}" cy="${project.position.y}" r="16" 
                      fill="${isVisited ? '#FFD700' : '#DC143C'}" stroke="#FFFFFF" stroke-width="3"/>
              <circle cx="${project.position.x}" cy="${project.position.y}" r="10" fill="#FFFFFF"/>
              <text x="${project.position.x}" y="${project.position.y + 4}" text-anchor="middle" 
                    fill="${isVisited ? '#FFD700' : '#DC143C'}" font-size="12" font-weight="bold">
                ${isVisited ? '✓' : 'P'}
              </text>
              <text x="${project.position.x}" y="${project.position.y - 25}" text-anchor="middle" 
                    fill="#FFFFFF" font-size="10" font-weight="bold">
                ${project.title.split(' ').slice(0, 2).join(' ')}
              </text>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  }

  private initializeTrack(): void {
    this.projects.forEach((project, index) => {
      const marker = document.getElementById(`pit-stop-${index}`);
      if (marker) {
        marker.addEventListener('click', () => this.openProjectModal(project));
        marker.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openProjectModal(project);
          }
        });
      }
    });
  }

  private attachEventListeners(): void {
    document.getElementById('back-to-garage')?.addEventListener('click', () => this.backToGarage());
    document.getElementById('reset-lap')?.addEventListener('click', () => this.resetLap());
    
    // Modal controls
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.id === 'close-modal') {
        this.closeModal();
      }
      if (target.id === 'inspect-tyres-btn') {
        target.style.display = 'none';
        const problemsList = document.getElementById('problems-list');
        problemsList?.classList.remove('hidden');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.closeModal();
      }
    });

    this.startTimerUpdate();
  }

  private startTimerUpdate(): void {
    const updateTimer = () => {
      const timerElement = document.getElementById('lap-timer');
      if (timerElement && this.gameState.getState().isTimerRunning) {
        const currentTime = this.gameState.getCurrentLapTime();
        timerElement.textContent = this.formatTime(currentTime);
      }
      
      if (this.gameState.getCurrentScene() === 'track') {
        requestAnimationFrame(updateTimer);
      }
    };
    updateTimer();
  }

  openProjectModal(project: Project): void {
    const modal = document.getElementById('project-modal');
    const content = document.getElementById('modal-content');
    
    if (!modal || !content) return;

    const wasNew = this.gameState.visitProject(project.id);
    
    if (wasNew) {
      this.updateTrack();
      this.container.dispatchEvent(new CustomEvent('project-selected', {
        detail: { id: project.id, title: project.title }
      }));
    }

    content.innerHTML = this.generateProjectModalContent(project);
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    
    const firstButton = modal.querySelector('button') as HTMLElement;
    firstButton?.focus();

    this.currentModal = modal;
  }

  private generateProjectModalContent(project: Project): string {
    const isVisited = this.gameState.isProjectVisited(project.id);
    
    return `
      <div class="relative">
        <button id="close-modal" class="absolute top-0 right-0 p-2 text-2xl text-racing-grey hover:text-racing-red transition-colors" aria-label="Close">✕</button>

        <div class="mb-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">${this.getCategoryEmoji(project.category)}</span>
            <h2 class="text-3xl font-racing font-bold text-racing-black dark:text-white">${project.title}</h2>
            ${isVisited ? '<span class="badge">✅ Visited</span>' : '<span class="badge bg-racing-red text-white">🆕 New</span>'}
          </div>
          <p class="text-lg text-racing-grey mb-4">${project.shortDescription}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-racing font-bold mb-3">🔧 Tech Stack</h3>
          <div class="flex flex-wrap gap-2">
            ${project.techStack.map(tech => `<span class="px-3 py-1 bg-racing-smoke dark:bg-racing-black/50 rounded-full text-sm font-medium">${tech}</span>`).join('')}
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-racing font-bold mb-3">📋 Project Details</h3>
          <p class="text-racing-grey leading-relaxed">${project.description}</p>
        </div>

        <div class="mb-6">
          <button id="inspect-tyres-btn" class="racing-button mb-4">🔍 Inspect Tyres (Problems Solved)</button>
          <div id="problems-list" class="hidden">
            <h3 class="text-lg font-racing font-bold mb-3">🏆 Key Achievements</h3>
            <ul class="space-y-2">
              ${project.problems.map(problem => `
                <li class="flex items-start gap-2">
                  <span class="text-racing-gold mt-1">•</span>
                  <span class="text-racing-grey">${problem}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="racing-button text-center no-underline">🚀 View Demo</a>` : ''}
          ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-lg border-2 border-racing-grey text-racing-grey hover:bg-racing-grey hover:text-white transition-all duration-300 font-racing font-bold uppercase tracking-wider text-center no-underline">📁 View Code</a>` : ''}
        </div>
      </div>
    `;
  }

  private closeModal(): void {
    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      this.currentModal = null;
    }
  }

  private updateTrack(): void {
    const trackContainer = document.getElementById('track-container');
    if (trackContainer) {
      trackContainer.innerHTML = this.createTrackSVG();
      this.initializeTrack();
    }
  }

  private getCategoryEmoji(category: Project['category']): string {
    const emojis = {
      frontend: '🎨',
      backend: '⚙️', 
      fullstack: '🚀',
      mobile: '📱',
      ai: '🤖',
      other: '💡'
    };
    return emojis[category] || emojis.other;
  }

  private backToGarage(): void {
    this.gameState.setCurrentScene('garage');
    this.dispatchEvent('scene-change', { scene: 'garage' });
  }

  private resetLap(): void {
    if (confirm('Reset current lap? This will clear your progress and restart the timer.')) {
      this.gameState.resetTimer();
      this.render();
    }
  }

  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  private dispatchEvent(name: string, detail: any): void {
    const event = new CustomEvent(name, { detail });
    this.container.dispatchEvent(event);
  }

  destroy(): void {
    if (this.currentModal) {
      this.closeModal();
    }
  }
}