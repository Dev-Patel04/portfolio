import GameStateManager from '../utils/GameStateManager';
import type { ContactForm } from '../types';

export class ContactScene {
  private readonly container: HTMLElement;
  private readonly gameState: GameStateManager;
  private resumeData: any = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.gameState = GameStateManager.getInstance();
  }

  async render(): Promise<void> {
    let errorMsg = '';
    try {
      await this.loadResumeData();
    } catch (e) {
      errorMsg = 'Failed to load resume data.';
    }
    if (!this.resumeData || !this.resumeData.personalInfo) {
      this.container.innerHTML = `<div style="color:red; padding:2rem; font-size:1.5rem;">${errorMsg || 'Resume data missing or invalid.'}</div>`;
      return;
    }
    this.container.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  private async loadResumeData(): Promise<void> {
    try {
      const base = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${base}resume.json`);
      this.resumeData = await response.json();
    } catch (error) {
      console.error('Failed to load resume data:', error);
      // Fallback data
      this.resumeData = {
        personalInfo: { name: 'Dev Patel', title: 'Software Developer', email: 'contact@example.com' },
        skills: { frontend: ['JavaScript', 'React', 'TypeScript'] },
        experience: [{ title: 'Developer', company: 'Company', duration: '2022-Present' }],
        education: [{ degree: 'Computer Science', institution: 'University', graduation: '2020' }]
      };
    }
  }

  private getHTML(): string {
    const badges = this.gameState.getBadges();
    const bestLap = this.gameState.getBestLapTime();
    const info = this.resumeData.personalInfo || {};

    return `
      <div class="contact-scene min-h-screen racing-gradient relative">
        <!-- Background Elements -->
        <div class="absolute inset-0 opacity-5">
          <div class="checkered-pattern"></div>
        </div>

        <!-- Header -->
        <div class="absolute top-6 left-6 z-20">
          <button 
            id="back-to-garage" 
            class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-racing-red text-racing-red hover:bg-racing-red hover:text-white transition-all duration-300"
            aria-label="Return to garage"
          >
            ← Garage
          </button>
        </div>

        <!-- Main Content -->
        <div class="flex items-center justify-center min-h-screen p-6">
          <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">

            <!-- Direct Communications Block -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
              <h2 class="text-2xl font-bold text-white mb-4">Direct Communications</h2>
              <ul class="space-y-2 text-lg">
                <li><span class="font-semibold text-white">Name:</span> <span class="text-racing-smoke">${info.name || ''}</span></li>
                <li><span class="font-semibold text-white">Location:</span> <span class="text-racing-smoke">${info.location || ''}</span></li>
                <li><span class="font-semibold text-white">Email:</span> <a href="mailto:${info.email || ''}" class="text-racing-red underline">${info.email || ''}</a></li>
                <li><span class="font-semibold text-white">Phone:</span> <a href="tel:${info.phone || ''}" class="text-racing-red underline">${info.phone || ''}</a></li>
                <li><span class="font-semibold text-white">LinkedIn:</span> <a href="${info.linkedin || '#'}" target="_blank" rel="noopener" class="text-racing-red underline">${info.linkedin || ''}</a></li>
                <li><span class="font-semibold text-white">GitHub:</span> <a href="${info.github || '#'}" target="_blank" rel="noopener" class="text-racing-red underline">${info.github || ''}</a></li>
              </ul>
            </div>

            <!-- Contact Form -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div class="mb-8">
                <h1 class="text-4xl md:text-5xl font-racing font-black text-white mb-4">
                  🏁 CONTACT
                </h1>
                <p class="text-xl text-racing-smoke">
                  Ready to <span class="text-racing-red font-bold">accelerate</span> your next project?
                </p>
              </div>

              <form id="contact-form" class="space-y-6" novalidate>
                <div>
                  <label for="name" class="block text-sm font-racing font-bold text-white mb-2">
                    Driver Name *
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-racing-smoke focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-transparent"
                    placeholder="Your full name"
                    aria-describedby="name-error"
                  />
                  <div id="name-error" class="text-red-400 text-sm mt-1 hidden"></div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-racing font-bold text-white mb-2">
                    Pit Radio (Email) *
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-racing-smoke focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-transparent"
                    placeholder="your.email@example.com"
                    aria-describedby="email-error"
                  />
                  <div id="email-error" class="text-red-400 text-sm mt-1 hidden"></div>
                </div>

                <div>
                  <label for="subject" class="block text-sm font-racing font-bold text-white mb-2">
                    Race Strategy (Subject)
                  </label>
                  <select 
                    id="subject" 
                    name="subject"
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-transparent"
                  >
                    <option value="" class="bg-gray-800">Select a topic...</option>
                    <option value="job-opportunity" class="bg-gray-800">🏆 Job Opportunity</option>
                    <option value="project-collaboration" class="bg-gray-800">🤝 Project Collaboration</option>
                    <option value="freelance-work" class="bg-gray-800">💼 Freelance Work</option>
                    <option value="consulting" class="bg-gray-800">💡 Consulting</option>
                    <option value="speaking" class="bg-gray-800">🎤 Speaking Engagement</option>
                    <option value="other" class="bg-gray-800">💬 Other</option>
                  </select>
                </div>

                <div>
                  <label for="message" class="block text-sm font-racing font-bold text-white mb-2">
                    Race Briefing (Message) *
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required
                    rows="6"
                    class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-racing-smoke focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-transparent resize-vertical"
                    placeholder="Tell me about your project, opportunity, or how we can work together..."
                    aria-describedby="message-error"
                  ></textarea>
                  <div id="message-error" class="text-red-400 text-sm mt-1 hidden"></div>
                </div>

                <!-- Honeypot for spam protection -->
                <div class="hidden">
                  <input type="text" name="honeypot" tabindex="-1" autocomplete="off" />
                </div>

                <button 
                  type="submit" 
                  class="racing-button w-full text-lg py-4 group relative overflow-hidden"
                  id="submit-btn"
                >
                  <span class="relative z-10">🚀 Launch Message</span>
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>

                <!-- Form status -->
                <div id="form-status" class="hidden p-4 rounded-lg text-center font-racing font-bold"></div>
              </form>
            </div>

            <!-- Info Panel -->
            <div class="space-y-6">
              <!-- Achievement Summary -->
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 class="text-2xl font-racing font-bold text-white mb-4">🏆 Race Summary</h2>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="text-center">
                    <div class="text-3xl font-racing font-bold text-racing-gold">${badges.length}</div>
                    <div class="text-sm text-racing-smoke">Badges Earned</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-racing font-bold text-racing-gold">
                      ${bestLap ? this.formatTime(bestLap) : '--:--'}
                    </div>
                    <div class="text-sm text-racing-smoke">Best Lap</div>
                  </div>
                </div>

                ${badges.length > 0 ? this.renderBadges(badges.slice(-4)) : ''}
              </div>

              <!-- Resume/Skills Section -->
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 class="text-2xl font-racing font-bold text-white mb-4">🎯 Driver Profile</h2>
                
                <!-- Skills -->
                <div class="mb-6">
                  <h3 class="font-racing font-bold text-racing-gold mb-3">Tech Stack</h3>
                  <div class="flex flex-wrap gap-2">
                    ${this.resumeData.skills.frontend.slice(0, 6).map((skill: string) => 
                      `<span class="px-3 py-1 bg-racing-red/20 text-racing-red rounded-full text-sm font-medium">${skill}</span>`
                    ).join('')}
                  </div>
                </div>

                <!-- Experience -->
                <div class="mb-6">
                  <h3 class="font-racing font-bold text-racing-gold mb-3">Experience</h3>
                  <div class="space-y-3">
                    ${this.resumeData.experience.slice(0, 2).map((exp: any) => `
                      <div>
                        <div class="font-semibold text-white">${exp.title}</div>
                        <div class="text-sm text-racing-smoke">${exp.duration} | ${exp.company}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Education -->
                <div>
                  <h3 class="font-racing font-bold text-racing-gold mb-3">Education</h3>
                  <div>
                    <div class="font-semibold text-white">${this.resumeData.education[0].degree}</div>
                    <div class="text-sm text-racing-smoke">${this.resumeData.education[0].institution} | ${this.resumeData.education[0].graduation}</div>
                  </div>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 class="text-2xl font-racing font-bold text-white mb-4">📡 Direct Communication</h2>
                
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">📧</span>
                    <div>
                      <div class="font-racing font-bold text-white">Email</div>
                      <a href="mailto:${this.resumeData.personalInfo.email}" class="text-racing-gold hover:text-racing-red transition-colors">
                        ${this.resumeData.personalInfo.email}
                      </a>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-2xl">💼</span>
                    <div>
                      <div class="font-racing font-bold text-white">LinkedIn</div>
                      <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" class="text-racing-gold hover:text-racing-red transition-colors">
                        /in/yourprofile
                      </a>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🐙</span>
                    <div>
                      <div class="font-racing font-bold text-white">GitHub</div>
                      <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" class="text-racing-gold hover:text-racing-red transition-colors">
                        @yourusername
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 class="text-2xl font-racing font-bold text-white mb-4">⚡ Quick Actions</h2>
                
                <div class="space-y-3">
                  <button 
                    id="download-resume" 
                    class="w-full px-4 py-3 rounded-lg border-2 border-racing-gold text-racing-gold hover:bg-racing-gold hover:text-racing-black transition-all duration-300 font-racing font-bold uppercase tracking-wider text-center"
                  >
                    📄 Download Resume
                  </button>
                  
                  <button 
                    id="schedule-call" 
                    class="w-full px-4 py-3 rounded-lg border-2 border-racing-smoke text-racing-smoke hover:bg-racing-smoke hover:text-racing-black transition-all duration-300 font-racing font-bold uppercase tracking-wider text-center"
                  >
                    📅 Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Modal -->
        <div id="success-modal" class="modal-overlay hidden">
          <div class="modal-content text-center">
            <div class="text-6xl mb-4">🏁</div>
            <h2 class="text-3xl font-racing font-bold text-racing-black dark:text-white mb-4">Message Launched!</h2>
            <p class="text-racing-grey mb-6">Thanks for reaching out! I'll get back to you within 24 hours.</p>
            <button id="close-success" class="racing-button">
              Continue Racing
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderBadges(badges: any[]): string {
    return `
      <div>
        <h3 class="text-lg font-racing font-bold text-white mb-3">Recent Achievements</h3>
        <div class="grid grid-cols-2 gap-2">
          ${badges.map(badge => `
            <div class="badge text-xs p-2" title="${badge.description}">
              <span class="mr-1">${badge.icon}</span>
              ${badge.name}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Back to garage
    document.getElementById('back-to-garage')?.addEventListener('click', () => this.backToGarage());

    // Form submission
    const form = document.getElementById('contact-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Real-time validation
    const inputs = form?.querySelectorAll('input[required], textarea[required]');
    inputs?.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input as HTMLInputElement));
      input.addEventListener('input', () => this.clearError(input as HTMLInputElement));
    });

    // Quick actions
    document.getElementById('download-resume')?.addEventListener('click', () => this.downloadResume());
    document.getElementById('schedule-call')?.addEventListener('click', () => this.scheduleCall());

    // Success modal
    document.getElementById('close-success')?.addEventListener('click', () => this.closeSuccessModal());
  }

  private handleFormSubmit(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Check honeypot
    if (formData.get('honeypot')) {
      return; // Silent fail for bots
    }
    
    // Validate form
    if (!this.validateForm(form)) {
      return;
    }

    // Get form data
    const data: ContactForm = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    const subject = formData.get('subject') as string;

    // Submit form
    this.submitForm(data, subject);
  }

  private validateForm(form: HTMLFormElement): boolean {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField(field as HTMLInputElement)) {
        isValid = false;
      }
    });

    return isValid;
  }

  private validateField(field: HTMLInputElement): boolean {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (!errorElement) return true;

    // Clear previous errors
    this.clearError(field);

    // Validate based on field type
    let isValid = true;
    let errorMessage = '';

    if (field.required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    } else if (field.name === 'name' && value.length < 2) {
      isValid = false;
      errorMessage = 'Name must be at least 2 characters';
    } else if (field.name === 'message' && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters';
    }

    if (!isValid) {
      field.classList.add('border-red-400');
      errorElement.textContent = errorMessage;
      errorElement.classList.remove('hidden');
    }

    return isValid;
  }

  private clearError(field: HTMLInputElement): void {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      field.classList.remove('border-red-400');
      errorElement.classList.add('hidden');
    }
  }

  private submitForm(data: ContactForm, subject: string): void {
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    const statusDiv = document.getElementById('form-status')!;

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="relative z-10">🚀 Launching...</span>';

    // Simulate form submission (replace with actual implementation)
    this.processFormSubmission(data, subject)
      .then(() => {
        // Success
        this.showSuccessModal();
        this.resetForm();
      })
      .catch((error) => {
        // Error
        statusDiv.className = 'p-4 rounded-lg text-center font-racing font-bold bg-red-600 text-white';
        statusDiv.textContent = `❌ Error: ${error.message}. Please try again.`;
        statusDiv.classList.remove('hidden');
      })
      .finally(() => {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="relative z-10">🚀 Launch Message</span>';
      });
  }

  private async processFormSubmission(data: ContactForm, subject: string): Promise<void> {
    // Option 1: mailto link (no backend required)
    const mailtoLink = this.createMailtoLink(data, subject);
    window.open(mailtoLink, '_blank');
    
    // Simulate delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For a real implementation, you could use:
    // - Formspree: https://formspree.io/
    // - Netlify Forms: Built into Netlify hosting
    // - Custom backend API
    
    return Promise.resolve();
  }

  private createMailtoLink(data: ContactForm, subject: string): string {
    const subjectText = subject ? this.getSubjectText(subject) : 'Portfolio Contact';
    const body = `Hi there!

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
Sent from F1 Racing Portfolio`;

    return `mailto:your.email@example.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(body)}`;
  }

  private getSubjectText(subject: string): string {
    const subjects: Record<string, string> = {
      'job-opportunity': '🏆 Job Opportunity',
      'project-collaboration': '🤝 Project Collaboration',
      'freelance-work': '💼 Freelance Work',
      'consulting': '💡 Consulting Inquiry',
      'speaking': '🎤 Speaking Engagement',
      'other': '💬 General Inquiry'
    };
    
    return subjects[subject] || 'Portfolio Contact';
  }

  private showSuccessModal(): void {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.getElementById('close-success')?.focus();
    }
  }

  private closeSuccessModal(): void {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  private resetForm(): void {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    form?.reset();
    
    // Clear any error states
    const errorElements = form?.querySelectorAll('[id$="-error"]');
    errorElements?.forEach(el => {
      el.classList.add('hidden');
    });
    
    const fields = form?.querySelectorAll('input, textarea');
    fields?.forEach(field => {
      field.classList.remove('border-red-400');
    });
  }

  private downloadResume(): void {
    // Downloads your resume PDF
    const link = document.createElement('a');
    link.href = '/Dev_Patel_Resume.pdf'; // Your actual resume file
    link.download = 'Dev_Patel_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private scheduleCall(): void {
    // In a real implementation, this would link to your calendar booking system
    // Examples: Calendly, Cal.com, etc.
    window.open('https://calendly.com/yourusername', '_blank');
  }

  private backToGarage(): void {
    this.gameState.setCurrentScene('garage');
    this.dispatchEvent('scene-change', { scene: 'garage' });
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
    // Cleanup if needed
  }
}