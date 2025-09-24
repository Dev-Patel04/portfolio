# 🏎️ F1 Gamified Portfolio

A Formula 1 themed interactive portfolio where visitors "race" through your projects as pit stops on a racing track. Built with Vite, TypeScript, and Tailwind CSS.

![F1 Portfolio Demo](https://img.shields.io/badge/F1-Portfolio-DC143C?style=for-the-badge&logo=formula1)

## 🏁 Features

### 🎮 Gamified Experience
- **Garage Scene**: Welcome screen with F1 garage atmosphere, stats, and leaderboard
- **Racing Track**: Interactive SVG track with project pit stops
- **Contact Scene**: F1-themed contact form with achievement display
- **Lap Timer**: Real-time timer tracking visitor engagement
- **Badge System**: Unlock achievements for exploring projects
- **Persistent State**: localStorage saves progress between visits

### 🎨 F1 Design
- **Racing Colors**: Authentic F1 color scheme (Racing Red, Black, Gold)
- **Motorsport Typography**: Racing-inspired fonts and styling  
- **Responsive Design**: Optimized for all devices
- **Keyboard Navigation**: Accessible controls (Space to start racing)
- **Theme Toggle**: Light/Dark mode support

### 🚀 Technical Stack
- **Vite**: Lightning-fast build tool
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **SVG Graphics**: Scalable racing track
- **Modern JavaScript**: ES6+ features

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/f1-portfolio.git
cd f1-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your F1 portfolio in action!

## 🏗️ Build & Deploy

### Local Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### GitHub Pages Deployment

This portfolio includes automated GitHub Pages deployment via GitHub Actions.

#### Setup Instructions:

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/f1-portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

3. **Update Repository Name** (if different):
   - Edit `vite.config.ts` and change the base path:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

4. **Custom Domain** (optional):
   - Add a `CNAME` file to the `public` folder with your domain
   - Configure DNS to point to `yourusername.github.io`

The GitHub Action will automatically build and deploy on every push to the main branch.

## 📁 Project Structure

```
f1-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── public/
│   └── vite.svg               # Favicon
├── src/
│   ├── data/
│   │   └── projects.json      # Your projects data
│   ├── scenes/
│   │   ├── GarageScene.ts     # Welcome/stats scene
│   │   ├── TrackScene.ts      # Interactive racing track
│   │   └── ContactScene.ts    # Contact form scene
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── utils/
│   │   └── GameStateManager.ts # Game state & localStorage
│   ├── App.ts                 # Main application controller
│   ├── main.ts                # Entry point
│   └── style.css              # F1-themed styles
├── index.html
├── package.json
├── tailwind.config.js         # F1 color scheme
├── postcss.config.js
├── vite.config.ts             # Build configuration
└── README.md
```

## 🔧 Customization

### Adding Projects
Edit `src/data/projects.json`:

```json
{
  "id": "your-project",
  "title": "Your Amazing Project",
  "description": "Brief description of your project",
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "frontend", // frontend, backend, fullstack, mobile
  "githubUrl": "https://github.com/you/project",
  "liveUrl": "https://yourproject.com",
  "imageUrl": "/path/to/screenshot.jpg"
}
```

### Updating Personal Info
Modify the contact form and personal details in `src/scenes/ContactScene.ts`

### Customizing Colors
Edit the racing color scheme in `tailwind.config.js`:

```javascript
colors: {
  racing: {
    red: '#DC143C',    // Ferrari Red
    black: '#1C1C1E',  // Racing Black  
    gold: '#FFD700',   // Champion Gold
    // Add your custom colors
  },
}
```

## 🎯 Performance & SEO

- ⚡ **Fast Loading**: Vite's optimized bundling
- 📱 **Responsive**: Mobile-first design
- ♿ **Accessible**: Keyboard navigation & screen reader support
- 🔍 **SEO Ready**: Meta tags and semantic HTML
- 📈 **Analytics Ready**: Easy Google Analytics integration

## 🏎️ F1 Theme Elements

- **Garage Scene**: Pit crew workspace with telemetry
- **Racing Track**: Circuit with turn markers and pit stops  
- **Lap Timer**: Championship-style timing system
- **Badge System**: Trophies and achievements
- **Racing Terminology**: Authentic F1 language throughout
- **Motorsport Colors**: Official racing color palette

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🏆 Acknowledgments

- Inspired by Formula 1 and motorsport design
- Built with modern web technologies
- Optimized for performance and accessibility

---

**Start your engines and let your portfolio race to victory! 🏁**