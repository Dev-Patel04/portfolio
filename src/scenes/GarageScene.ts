import GameStateManager from '../utils/GameStateManager';
import type { Experience } from '../types';
import experiencesData from '../data/experiences.json';

export class GarageScene {
  private container: HTMLElement;
  private gameState: GameStateManager;
  private experiences: Experience[];
  private currentPitstop: number = 0;
  private isAnimating: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.gameState = GameStateManager.getInstance();
    this.experiences = experiencesData.experiences as Experience[];
  }

  render(): void {
    this.container.innerHTML = this.getHTML();
    this.attachEventListeners();
    this.initializeAnimations();
    this.hideExperienceModal();
  }

  private getHTML(): string {
    const theme = this.gameState.getTheme();

    return `
      <div class="garage-scene min-h-screen racing-gradient relative overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 opacity-10">
          <div class="checkered-flag absolute top-10 left-10 w-16 h-16"></div>
          <div class="checkered-flag absolute bottom-10 right-10 w-16 h-16"></div>
        </div>

        <!-- Theme Toggle -->
        <button 
          id="theme-toggle" 
          class="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 z-30"
          aria-label="Toggle theme"
        >
          <span class="text-2xl">${theme === 'light' ? '🌙' : '☀️'}</span>
        </button>

        <!-- Header -->
        <div class="text-center pt-8 pb-4 z-10 relative">
          <h1 class="text-4xl md:text-6xl font-racing font-black text-white mb-2 engine-pulse">
            🏎️ MY JOURNEY
          </h1>
          <p class="text-lg md:text-xl text-racing-smoke font-light tracking-wide">
            Racing through <span class="text-racing-red font-bold">experiences</span> at full speed
          </p>
        </div>

        <!-- Race Track Container -->
        <div class="race-track-container relative w-full overflow-x-auto" style="height: 400px;">
          <div class="race-track relative" style="width: ${Math.max(100, this.experiences.length * 25)}%; min-width: 100%; height: 100%;">
            
            <!-- Track Surface -->
            <div class="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-24 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-t-4 border-b-4 border-white border-dashed">
              <!-- Track Lines -->
              <div class="absolute inset-0 flex items-center">
                <div class="w-full h-1 border-t-2 border-dashed border-yellow-400 opacity-50"></div>
              </div>
            </div>

            <!-- Start Line -->
            <div class="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
              <div class="w-4 h-32 bg-gradient-to-b from-white via-black to-white bg-[length:100%_20px] bg-repeat"></div>
              <div class="text-white text-xs font-racing mt-2 text-center">START</div>
            </div>

            <!-- Pitstops -->
            ${this.experiences.map((exp, index) => this.renderPitstop(exp, index)).join('')}

            <!-- Finish Line -->
            <div class="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
              <div class="w-4 h-32 checkered-finish"></div>
              <div class="text-white text-xs font-racing mt-2 text-center">NOW</div>
            </div>

            <!-- F1 Car -->
            <div id="f1-car" class="f1-car absolute z-20" style="left: 5%; top: 50%; transform: translateY(-50%);">
              <div class="car-body">
                <span class="text-5xl transform scaleX(-1) inline-block" style="transform: scaleX(-1);">🏎️</span>
              </div>
              <div class="car-exhaust"></div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-4 py-6 z-10 relative">
          <button 
            id="prev-pitstop" 
            class="px-6 py-3 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 font-racing disabled:opacity-30 disabled:cursor-not-allowed"
            ${this.currentPitstop <= 0 ? 'disabled' : ''}
          >
            ← Previous
          </button>
          
          <button 
            id="auto-race" 
            class="racing-button px-8 py-3"
          >
            🏁 AUTO RACE
          </button>
          
          <button 
            id="next-pitstop" 
            class="px-6 py-3 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 font-racing disabled:opacity-30 disabled:cursor-not-allowed"
            ${this.currentPitstop >= this.experiences.length - 1 ? 'disabled' : ''}
          >
            Next →
          </button>
        </div>

        <!-- Experience Info Panel -->
        <div id="experience-panel" class="max-w-4xl mx-auto px-6 pb-8">
          ${this.renderExperiencePanel(this.experiences[this.currentPitstop])}
        </div>

        <!-- Navigation Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pb-8 z-10 relative">
          <button 
            id="start-race-btn" 
            class="racing-button text-lg px-8 py-4 group relative overflow-hidden"
          >
            <span class="relative z-10">VIEW PROJECTS</span>
          </button>
          
          <button 
            id="contact-btn" 
            class="px-6 py-3 rounded-lg border-2 border-racing-gold text-racing-gold hover:bg-racing-gold hover:text-racing-black transition-all duration-300 font-racing font-bold uppercase tracking-wider"
          >
            Contact Me
          </button>
        </div>

        <!-- Keyboard Hints -->
        <div class="absolute bottom-6 left-6 text-racing-smoke text-sm z-10">
          <div>Press <kbd class="px-2 py-1 bg-white/10 rounded">←</kbd> <kbd class="px-2 py-1 bg-white/10 rounded">→</kbd> to navigate</div>
          <div>Press <kbd class="px-2 py-1 bg-white/10 rounded">Enter</kbd> for details</div>
        </div>

        <!-- Experience Modal -->
        <div id="experience-modal" class="modal-overlay hidden" aria-hidden="true">
          <div class="modal-content max-w-2xl">
            <div id="experience-modal-content"></div>
          </div>
        </div>
      </div>
    `;
  }

  private renderPitstop(exp: Experience, index: number): string {
    const isActive = index === this.currentPitstop;
    const isPast = index < this.currentPitstop;
    const totalExperiences = this.experiences.length;
    const leftPercent = 15 + (index * (70 / (totalExperiences - 1 || 1)));

    const typeIcon = {
      work: '💼',
      education: '🎓',
      milestone: '⭐'
    }[exp.type] || '📍';

    return `
      <div 
        id="pitstop-${index}" 
        class="pitstop-marker absolute cursor-pointer z-10 transition-all duration-500 ${isActive ? 'scale-125' : ''} ${isPast ? 'opacity-60' : ''}"
        style="left: ${leftPercent}%; top: 50%; transform: translate(-50%, -50%);"
        data-index="${index}"
        tabindex="0"
        role="button"
        aria-label="Pitstop: ${exp.title} at ${exp.company}"
      >
        <!-- Marker -->
        <div class="relative">
          <!-- Glow effect for active -->
          ${isActive ? '<div class="absolute inset-0 w-16 h-16 -m-2 bg-racing-gold rounded-full animate-ping opacity-25"></div>' : ''}
          
          <!-- Main circle -->
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl
            ${isPast ? 'bg-racing-gold border-4 border-white' : isActive ? 'bg-racing-red border-4 border-racing-gold shadow-lg shadow-racing-gold/50' : 'bg-gray-600 border-4 border-white/50'}
            transition-all duration-300 hover:scale-110">
            ${typeIcon}
          </div>
          
          <!-- Label -->
          <div class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
            <div class="text-xs font-racing text-white font-bold">${exp.duration}</div>
            <div class="text-xs text-racing-smoke max-w-24 truncate">${exp.company}</div>
          </div>
        </div>
      </div>
    `;
  }

  private renderExperiencePanel(exp: Experience): string {
    if (!exp) return '';

    const typeIcon = {
      work: '💼',
      education: '🎓',
      milestone: '⭐'
    }[exp.type] || '📍';

    const typeLabel = {
      work: 'WORK EXPERIENCE',
      education: 'EDUCATION',
      milestone: 'MILESTONE'
    }[exp.type] || 'EXPERIENCE';

    return `
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in">
        <div class="flex items-start gap-4">
          <div class="text-4xl">${typeIcon}</div>
          <div class="flex-1">
            <div class="text-racing-gold text-sm font-racing tracking-wider mb-1">${typeLabel}</div>
            <h2 class="text-2xl md:text-3xl font-racing font-bold text-white mb-1">${exp.title}</h2>
            <div class="flex flex-wrap items-center gap-3 text-racing-smoke mb-4">
              <span class="font-medium">${exp.company}</span>
              <span class="text-racing-gold">•</span>
              <span>${exp.duration}</span>
            </div>
            <p class="text-white/80 mb-4 leading-relaxed">${exp.description}</p>
            
            <!-- Skills -->
            <div class="flex flex-wrap gap-2 mb-4">
              ${exp.skills.map(skill => `
                <span class="px-3 py-1 bg-racing-red/20 border border-racing-red/40 rounded-full text-sm text-white">${skill}</span>
              `).join('')}
            </div>
            
            <button 
              id="view-details-btn" 
              class="text-racing-gold hover:text-white transition-colors font-racing uppercase tracking-wider text-sm flex items-center gap-2"
              data-exp-id="${exp.id}"
            >
              View Details <span>→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderExperienceModal(exp: Experience): string {
    const typeIcon = {
      work: '💼',
      education: '🎓',
      milestone: '⭐'
    }[exp.type] || '📍';

    return `
      <div class="relative">
        <button id="close-experience-modal" class="absolute top-0 right-0 p-2 text-2xl text-racing-grey hover:text-racing-red transition-colors" aria-label="Close">✕</button>
        
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">${typeIcon}</span>
            <div>
              <h2 class="text-2xl font-racing font-bold text-racing-black dark:text-white">${exp.title}</h2>
              <p class="text-racing-grey">${exp.company} • ${exp.duration}</p>
            </div>
          </div>
          
          <p class="text-racing-grey leading-relaxed mb-6">${exp.description}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-racing font-bold mb-3 flex items-center gap-2">
            🏆 Key Highlights
          </h3>
          <ul class="space-y-2">
            ${exp.highlights.map(highlight => `
              <li class="flex items-start gap-2">
                <span class="text-racing-gold mt-1">✓</span>
                <span class="text-racing-grey">${highlight}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-racing font-bold mb-3 flex items-center gap-2">
            🔧 Skills & Technologies
          </h3>
          <div class="flex flex-wrap gap-2">
            ${exp.skills.map(skill => `
              <span class="px-3 py-1 bg-racing-smoke dark:bg-racing-black/50 rounded-full text-sm font-medium">${skill}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Theme Toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());

    // Navigation controls
    document.getElementById('prev-pitstop')?.addEventListener('click', () => this.moveToPitstop(this.currentPitstop - 1));
    document.getElementById('next-pitstop')?.addEventListener('click', () => this.moveToPitstop(this.currentPitstop + 1));
    document.getElementById('auto-race')?.addEventListener('click', () => this.autoRace());

    // Pitstop markers
    this.experiences.forEach((_, index) => {
      const marker = document.getElementById(`pitstop-${index}`);
      marker?.addEventListener('click', () => this.moveToPitstop(index));
      marker?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.moveToPitstop(index);
        }
      });
    });

    // View details button
    document.getElementById('view-details-btn')?.addEventListener('click', () => {
      this.showExperienceModal(this.experiences[this.currentPitstop]);
    });

    // Scene navigation
    document.getElementById('start-race-btn')?.addEventListener('click', () => this.startRace());
    document.getElementById('contact-btn')?.addEventListener('click', () => this.showContact());

    // Modal controls
    document.getElementById('close-experience-modal')?.addEventListener('click', () => this.hideExperienceModal());
    document.getElementById('experience-modal')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'experience-modal') {
        this.hideExperienceModal();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  private initializeAnimations(): void {
    // Initial car position
    this.updateCarPosition();
  }

  private moveToPitstop(index: number): void {
    if (index < 0 || index >= this.experiences.length || this.isAnimating) return;

    this.currentPitstop = index;
    this.updateCarPosition();
    this.updateExperiencePanel();
    this.updatePitstopMarkers();
    this.updateNavigationButtons();
  }

  private updateCarPosition(): void {
    const car = document.getElementById('f1-car');
    if (!car) return;

    const totalExperiences = this.experiences.length;
    const leftPercent = 15 + (this.currentPitstop * (70 / (totalExperiences - 1 || 1)));

    car.style.transition = 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    car.style.left = `${leftPercent - 5}%`;

    // Add exhaust animation
    const exhaust = car.querySelector('.car-exhaust');
    if (exhaust) {
      exhaust.classList.add('exhausting');
      setTimeout(() => exhaust.classList.remove('exhausting'), 800);
    }
  }

  private updateExperiencePanel(): void {
    const panel = document.getElementById('experience-panel');
    if (panel) {
      panel.innerHTML = this.renderExperiencePanel(this.experiences[this.currentPitstop]);
      // Re-attach view details listener
      document.getElementById('view-details-btn')?.addEventListener('click', () => {
        this.showExperienceModal(this.experiences[this.currentPitstop]);
      });
    }
  }

  private updatePitstopMarkers(): void {
    this.experiences.forEach((_, index) => {
      const marker = document.getElementById(`pitstop-${index}`);
      if (marker) {
        const isActive = index === this.currentPitstop;
        const isPast = index < this.currentPitstop;

        marker.classList.toggle('scale-125', isActive);
        marker.classList.toggle('opacity-60', isPast);
      }
    });
  }

  private updateNavigationButtons(): void {
    const prevBtn = document.getElementById('prev-pitstop') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-pitstop') as HTMLButtonElement;

    if (prevBtn) prevBtn.disabled = this.currentPitstop <= 0;
    if (nextBtn) nextBtn.disabled = this.currentPitstop >= this.experiences.length - 1;
  }

  private async autoRace(): Promise<void> {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.currentPitstop = 0;
    this.updateCarPosition();
    this.updateExperiencePanel();
    this.updatePitstopMarkers();

    for (let i = 1; i < this.experiences.length; i++) {
      await this.delay(1500);
      this.currentPitstop = i;
      this.updateCarPosition();
      this.updateExperiencePanel();
      this.updatePitstopMarkers();
      this.updateNavigationButtons();
    }

    this.isAnimating = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private showExperienceModal(exp: Experience): void {
    const modal = document.getElementById('experience-modal');
    const content = document.getElementById('experience-modal-content');

    if (modal && content) {
      content.innerHTML = this.renderExperienceModal(exp);
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      modal.setAttribute('aria-hidden', 'false');

      // Re-attach close listener
      document.getElementById('close-experience-modal')?.addEventListener('click', () => this.hideExperienceModal());

      const closeBtn = document.getElementById('close-experience-modal');
      closeBtn?.focus();
    }
  }

  private hideExperienceModal(): void {
    const modal = document.getElementById('experience-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  private toggleTheme(): void {
    this.gameState.toggleTheme();
    this.render();
  }

  private startRace(): void {
    this.gameState.setCurrentScene('track');
    this.dispatchEvent('scene-change', { scene: 'track' });
  }

  private showContact(): void {
    this.gameState.setCurrentScene('contact');
    this.dispatchEvent('scene-change', { scene: 'contact' });
  }

  private handleKeyboard(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
        e.preventDefault();
        this.moveToPitstop(this.currentPitstop - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.moveToPitstop(this.currentPitstop + 1);
        break;
      case 'Enter':
        if (this.experiences[this.currentPitstop]) {
          this.showExperienceModal(this.experiences[this.currentPitstop]);
        }
        break;
      case 'Space':
        e.preventDefault();
        this.autoRace();
        break;
      case 'Escape':
        this.hideExperienceModal();
        break;
    }
  }

  private dispatchEvent(name: string, detail: any): void {
    const event = new CustomEvent(name, { detail });
    this.container.dispatchEvent(event);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyboard);
  }
}