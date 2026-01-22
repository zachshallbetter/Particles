# Project Verification Checklist

Run this checklist to verify your development environment is properly set up.

## ✅ Prerequisites

- [ ] Node.js installed (v18+): `node --version`
- [ ] npm installed: `npm --version`
- [ ] Terminal access in project directory

## ✅ Installation Verification

```bash
# Run these commands to verify setup

# 1. Install dependencies
npm install

# 2. Verify dependencies installed
npm list react react-dom vite

# 3. Check build setup
npm run build

# 4. Verify production build created
ls -la dist/

# 5. Test dev server
npm run dev
```

Expected results:
- ✅ No error messages during `npm install`
- ✅ React and Vite listed in dependencies
- ✅ Build completes without errors
- ✅ `/dist` folder created with index.html, assets/
- ✅ Dev server starts on `http://localhost:3001`

## ✅ Application Verification

Once dev server is running at `http://localhost:3001`:

- [ ] Page loads without errors
- [ ] Canvas is visible (dark background)
- [ ] Waves visible at top (cyan/red/pink colors)
- [ ] Particles visible (glowing dots)
- [ ] Animation running smoothly (check FPS in bottom right)
- [ ] FPS shows 60 or higher
- [ ] No red errors in browser console
- [ ] No TypeScript errors in terminal

## ✅ Build Verification

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173`:

- [ ] Page loads identically to dev server
- [ ] All animations work
- [ ] No console errors
- [ ] Performance similar to dev

## ✅ File Structure Verification

Check that these key files exist:

```bash
# Core files
ls src/main.tsx        # React entry point
ls src/App.tsx         # Root component
ls src/index.css       # Global styles
ls index.html          # HTML entry point
ls vite.config.ts      # Vite config
ls tsconfig.json       # TypeScript config

# Documentation
ls README.md           # Main guide
ls DEVELOPMENT.md      # Dev guide
ls QUICK_START.md      # Quick start
ls DOCS_INDEX.md       # This file
```

All should exist without errors.

## ✅ Configuration Verification

### Path Aliases Working

Create a test file `/src/test.tsx`:

```typescript
// This should NOT error
import { useTheme } from '@/hooks/useTheme';
import { WaveParticles } from '@/components/WaveParticles';
import { DEFAULT_WAVE_CONFIG } from '@/config';

console.log('[v0] Path aliases working!');
```

- [ ] No red squiggly lines in editor
- [ ] Editor autocomplete works for imports
- [ ] No build errors

(Delete this file after testing)

### TypeScript Configuration

Run type check:

```bash
npx tsc --noEmit
```

- [ ] No type errors reported
- [ ] If errors exist, they should be in unused code only

## ✅ Hot Module Replacement (HMR)

Test that changes auto-reload:

1. Open `/src/App.tsx`
2. Change something minor (e.g., comment text)
3. Save file
4. Check browser automatically reloads
5. [ ] HMR is working (page updated automatically)

## ✅ Performance Verification

In running app, check bottom-right FPS monitor:

- [ ] Steady 60 FPS or higher
- [ ] No drops below 30 FPS
- [ ] Display shows "FPS: 60" or similar
- [ ] If lower, check "Performance Optimization" in DEVELOPMENT.md

## ✅ Deployment Readiness

```bash
npm run build
ls -la dist/

# Check bundle size
du -sh dist/
```

Expected:
- [ ] Build completes without warnings (some warnings OK)
- [ ] `/dist/index.html` exists (~2KB)
- [ ] `/dist/assets/` folder exists with JS/CSS files
- [ ] Total size <2MB

## ⚠️ Common Issues & Solutions

### Issue: `Cannot find module '@/components/...'`
- **Solution**: Check import path spelling
- **Check**: Does file exist at that path?
- **Fix**: Update import or create missing file

### Issue: Port 3001 already in use
- **Solution**: `npm run dev -- --port 3002`
- **Alternative**: Kill process using port 3001

### Issue: HMR not working
- **Solution**: Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- **Alternative**: Restart dev server

### Issue: TypeScript errors but code works
- **Solution**: Check `tsconfig.json` path aliases
- **Fix**: Run `npm install` again, then restart editor

### Issue: Build succeeds but nothing works in /dist
- **Solution**: Check browser console for module errors
- **Fix**: Verify all imports use `@/` alias or relative paths correctly

## ✅ Documentation Verification

- [ ] Can find QUICK_START.md
- [ ] Can find DEVELOPMENT.md  
- [ ] Can find PROJECT_STRUCTURE.md
- [ ] All links in DOCS_INDEX.md work

## 🎉 Everything Working?

If all checkmarks pass:

```bash
# You're ready to develop!
npm run dev

# Or deploy
npm run build
# Upload /dist to hosting
```

## 📋 Troubleshooting Checklist

If something isn't working:

1. [ ] Tried hard browser refresh (Cmd+Shift+R)
2. [ ] Checked browser console for errors
3. [ ] Checked terminal for build errors
4. [ ] Restarted dev server
5. [ ] Ran `npm install` again
6. [ ] Checked node version (v18+)
7. [ ] Deleted node_modules and reinstalled
8. [ ] Read relevant guide in DOCS_INDEX.md

If still broken:

1. Note the exact error message
2. Search error in relevant `.md` file
3. Check GitHub issues if this is public
4. Check DEVELOPMENT.md debugging section

## 📊 Final Status

Date: ___________
- Node Version: ___________
- npm Version: ___________
- Dev Server: ___________
- Build: ___________
- Performance (FPS): ___________
- Notes: ___________

---

**Verification Complete!** Your Wave Particle System is ready to use. 🚀

Start with: `npm run dev`
