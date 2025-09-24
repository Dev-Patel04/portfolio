import GameStateManager from '../utils/GameStateManager';

export class GarageScene {
  private container: HTMLElement;
  private gameState: GameStateManager;

  constructor(container: HTMLElement) {
    this.container = container;
    this.gameState = GameStateManager.getInstance();
  }

  render(): void {
    this.container.innerHTML = this.getHTML();
    this.attachEventListeners();
    this.initializeAnimations();
    // Ensure modal is hidden on initial render
    this.hideLeaderboard();
  }

  private getHTML(): string {
    const badges = this.gameState.getBadges();
    const bestLap = this.gameState.getBestLapTime();
    const theme = this.gameState.getTheme();

    return `
      <div class="garage-scene min-h-screen racing-gradient flex items-center justify-center relative overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 opacity-10">
          <div class="checkered-flag absolute top-10 left-10 w-16 h-16"></div>
          <div class="checkered-flag absolute bottom-10 right-10 w-16 h-16"></div>
          <div class="racing-lines absolute inset-0"></div>
        </div>

        <!-- Theme Toggle -->
        <button 
          id="theme-toggle" 
          class="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          aria-label="Toggle theme"
        >
          <span class="text-2xl">${theme === 'light' ? '🌙' : '☀️'}</span>
        </button>

        <!-- Main Content -->
        <div class="text-center z-10 max-w-4xl mx-auto px-6">
          <!-- Header -->
          <div class="mb-8 animate-fade-in">
            <h1 class="text-6xl md:text-8xl font-racing font-black text-white mb-4 engine-pulse">
              GARAGE
            </h1>
            <p class="text-xl md:text-2xl text-racing-smoke font-light tracking-wide">
              Welcome to the <span class="text-racing-red font-bold">Fast Lane</span> Portfolio
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div class="text-3xl mb-2">🏁</div>
              <div class="text-2xl font-racing font-bold text-white">${badges.length}</div>
              <div class="text-sm text-racing-smoke">Badges Earned</div>
            </div>
            
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div class="text-3xl mb-2">⏱️</div>
              <div class="text-2xl font-racing font-bold text-white">
                ${bestLap ? this.formatTime(bestLap) : '--:--'}
              </div>
              <div class="text-sm text-racing-smoke">Best Lap Time</div>
            </div>
            
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div class="text-3xl mb-2">🚀</div>
              <div class="text-2xl font-racing font-bold text-white">4</div>
              <div class="text-sm text-racing-smoke">Pit Stops Available</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button 
              id="start-race-btn" 
              class="racing-button text-lg px-8 py-4 group relative overflow-hidden"
              aria-describedby="start-race-desc"
            >
              <span class="relative z-10">START RACE</span>
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            
            <button 
              id="leaderboard-btn" 
              class="px-6 py-3 rounded-lg border-2 border-racing-red text-racing-red hover:bg-racing-red hover:text-white transition-all duration-300 font-racing font-bold uppercase tracking-wider"
              aria-describedby="leaderboard-desc"
            >
              Leaderboard
            </button>
            
            <button 
              id="contact-btn" 
              class="px-6 py-3 rounded-lg border-2 border-racing-gold text-racing-gold hover:bg-racing-gold hover:text-racing-black transition-all duration-300 font-racing font-bold uppercase tracking-wider"
              aria-describedby="contact-desc"
            >
              Contact
            </button>
          </div>

          <!-- Hidden descriptions for screen readers -->
          <div class="sr-only">
            <div id="start-race-desc">Begin exploring projects on the racing track</div>
            <div id="leaderboard-desc">View lap times and achievements</div>
            <div id="contact-desc">Get in touch for opportunities</div>
          </div>

          <!-- Recent Badges -->
          ${badges.length > 0 ? this.renderRecentBadges(badges) : ''}
        </div>

        <!-- Keyboard Hints -->
        <div class="absolute bottom-6 left-6 text-racing-smoke text-sm">
          <div>Press <kbd class="px-2 py-1 bg-white/10 rounded">Space</kbd> to start race</div>
          <div>Press <kbd class="px-2 py-1 bg-white/10 rounded">Tab</kbd> to navigate</div>
        </div>
      </div>

      <!-- Leaderboard Modal -->
      <div id="leaderboard-modal" class="modal-overlay hidden" aria-hidden="true">
        <div class="modal-content">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-racing font-bold text-racing-black dark:text-white">🏆 Leaderboard</h2>
            <button id="close-leaderboard" class="text-2xl hover:text-racing-red transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Close leaderboard">✕</button>
          </div>
          <div id="leaderboard-content">
            ${this.renderLeaderboard()}
          </div>
          <div class="mt-6 flex gap-4">
            <button id="reset-data-btn" class="px-4 py-2 bg-racing-red text-white rounded-lg hover:bg-red-600 transition-colors">
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderRecentBadges(badges: any[]): string {
    const recentBadges = badges.slice(-3);
    return `
      <div class="mt-8 animate-slide-up">
        <h3 class="text-lg font-racing text-white mb-4">Recent Achievements</h3>
        <div class="flex justify-center gap-3">
          ${recentBadges.map(badge => `
            <div class="badge" title="${badge.description}">
              <span class="mr-2">${badge.icon}</span>
              ${badge.name}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderLeaderboard(): string {
    const records = this.gameState.getLapRecords();
    
    if (records.length === 0) {
      return `
        <div class="text-center py-8 text-racing-grey">
          <div class="text-4xl mb-4">🏁</div>
          <p>No lap records yet!</p>
          <p class="text-sm mt-2">Complete the track to set your first record.</p>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        ${records.map((record, index) => `
          <div class="flex items-center justify-between p-3 rounded-lg ${index === 0 ? 'bg-racing-gold/20' : 'bg-white/10'}">
            <div class="flex items-center gap-3">
              <span class="text-lg font-racing ${index === 0 ? 'text-racing-gold' : 'text-racing-grey'}">
                ${index + 1}${this.getMedalEmoji(index)}
              </span>
              <div>
                <div class="font-racing font-bold">${this.formatTime(record.time)}</div>
                <div class="text-sm text-racing-grey">${new Date(record.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div class="text-right text-sm text-racing-grey">
              <div>${record.projectsVisited}/4 projects</div>
              <div>${record.badgesEarned} badges</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Start Race Button
    const startBtn = document.getElementById('start-race-btn');
    startBtn?.addEventListener('click', () => this.startRace());

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => this.toggleTheme());

    // Leaderboard
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    leaderboardBtn?.addEventListener('click', () => this.showLeaderboard());

    // Contact
    const contactBtn = document.getElementById('contact-btn');
    contactBtn?.addEventListener('click', () => this.showContact());

    // Modal controls
    const closeLeaderboard = document.getElementById('close-leaderboard');
    closeLeaderboard?.addEventListener('click', () => this.hideLeaderboard());
    
    // Click outside modal to close
    const leaderboardModal = document.getElementById('leaderboard-modal');
    leaderboardModal?.addEventListener('click', (e) => {
      if (e.target === leaderboardModal) {
        this.hideLeaderboard();
      }
    });

    // Reset data
    const resetBtn = document.getElementById('reset-data-btn');
    resetBtn?.addEventListener('click', () => this.resetData());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Close modal on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideLeaderboard();
      }
    });
  }

  private initializeAnimations(): void {
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    });

    // Observe elements that need animation
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
      observer.observe(el);
    });
  }

  private startRace(): void {
    this.gameState.setCurrentScene('track');
    this.dispatchEvent('scene-change', { scene: 'track' });
  }

  private toggleTheme(): void {
    this.gameState.toggleTheme();
    // Re-render to update theme indicator
    this.render();
  }

  private showLeaderboard(): void {
    const modal = document.getElementById('leaderboard-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'flex';
      
      // Focus the close button
      const closeBtn = document.getElementById('close-leaderboard');
      closeBtn?.focus();
    }
  }

  private hideLeaderboard(): void {
    const modal = document.getElementById('leaderboard-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  }

  private showContact(): void {
    this.gameState.setCurrentScene('contact');
    this.dispatchEvent('scene-change', { scene: 'contact' });
  }

  private resetData(): void {
    if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      this.gameState.clearData();
      this.render(); // Re-render with cleared data
    }
  }

  private handleKeyboard(e: KeyboardEvent): void {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.startRace();
        break;
      case 'KeyL':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.showLeaderboard();
        }
        break;
      case 'KeyC':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.showContact();
        }
        break;
    }
  }

  private getMedalEmoji(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
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

  // Cleanup method
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyboard);
  }
}