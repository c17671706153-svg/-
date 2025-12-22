# 🎄 Christmas Tree Photo Album

An interactive 3D Christmas tree photo album built with React, Three.js, and React Three Fiber.

## ✨ Features

- **3D Interactive Christmas Tree**: Beautiful 3D tree with ornaments and particles
- **Photo Gallery**: Upload and display your photos on the tree
- **Two Display Modes**:
  - **Chaos Mode**: Photos scattered in a photo wall effect
  - **Form Mode**: Photos arranged in a tree shape with rotation
- **Music Player**: Add background music (audio or video files)
- **Export Functionality**: Export your customized tree as a standalone HTML file
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

### Basic Usage

1. **Upload Photos**: Click the "📸 Photo" button to upload 5-50 photos
2. **Add Music** (optional): Click the "🎵 Music" button to add background music
3. **Switch Modes**: Toggle between "Chaos" and "Form" modes
4. **Export**: Click "💾 Export" to download a standalone HTML file

### Export and Merge

After exporting an HTML file:

```bash
# Place the exported HTML file in the dist folder
# Then run the merge script
npm run merge-export
```

This will merge the exported data into the built HTML file.

## 📁 Project Structure

```
├── components/          # React components
│   ├── AppExport.tsx   # Export version of the app
│   ├── MusicPlayer.tsx # Music player component
│   ├── PhotoGallery.tsx # Photo display component
│   └── ...
├── contexts/           # React contexts
│   ├── MusicContext.tsx
│   └── PhotoContext.tsx
├── scripts/            # Utility scripts
│   └── merge-export.js # Merge exported HTML
├── utils/              # Utility functions
└── dist/               # Build output
```

## 🛠️ Technologies

- **React 19**: UI framework
- **Three.js**: 3D graphics
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for R3F
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling

## 📝 License

Private project - All rights reserved

## 🙏 Acknowledgments

Built with love for sharing memories and creating beautiful experiences.

