# Wave Particle System - React Edition

This is a refactored version of the Wave Particle System converted from Next.js to pure React with Vite for better local development and export compatibility.

## Key Changes from Next.js

- **Removed Next.js dependencies**: Switched from `next` to Vite for building
- **Client-side only**: Eliminated server-side rendering, now purely client-side React
- **Simplified structure**: Removed `/app` directory, now uses `/src` with standard React patterns
- **Better export**: Now exports cleanly to static files that work locally without a server
- **Development server**: Uses Vite dev server instead of Next.js dev server
- **Build output**: Creates static `/dist` folder that can be served directly

## Setup & Installation

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:3001)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm preview
```

## Project Structure

```
├── src/
│   ├── App.tsx           # Main React component
│   ├── main.tsx          # Entry point
│   ├── index.css         # Global styles with Tailwind
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context providers
│   ├── config/           # Configuration files
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Why This Works Better

1. **No server dependency**: The exported build is pure static files - no Node.js server required
2. **Vite bundling**: Faster development experience and smaller production builds
3. **Standard React**: Uses standard React patterns that are well-supported everywhere
4. **Path resolution**: All imports use `@/` alias which works in both dev and production
5. **CSS-in-JS compiled**: Tailwind is properly compiled to static CSS, not relying on runtime compilation

## Deployment

To deploy the production build:

```bash
npm run build
# Deploy the /dist folder to any static hosting (Vercel, Netlify, GitHub Pages, etc.)
```

## Features

- Beautiful animated wave patterns with particle effects
- Interactive particle emitters with gravity wells
- Wave breathing animations
- Particle evolution with color harmonics
- Energy cascades and shockwaves
- Chromatic aberration effects
- Distortion fields
- Real-time FPS monitoring

## Troubleshooting

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist` and rebuild

### Development Issues  
- Check that port 3001 is available
- Ensure Node.js 18+ is installed

### Export Issues
- The `/dist` folder is fully static and can be opened directly in a browser
- For a production server, any web server can serve the dist folder

## License

MIT
