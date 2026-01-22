# Documentation Index

Quick links to all project documentation and guides.

## 🚀 Getting Started (Pick One)

- **[QUICK_START.md](./QUICK_START.md)** - 3 simple steps to run the project (fastest path)
- **[README.md](./README.md)** - Complete project overview with detailed setup

## 📋 Development & Maintenance

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Architecture, coding guidelines, debugging, performance optimization
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Directory structure, path aliases, file organization
- **[HOUSEKEEPING_SUMMARY.md](./HOUSEKEEPING_SUMMARY.md)** - What was cleaned up, current status, before/after comparison

## 🔄 Migration Reference

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Why we converted from Next.js to React+Vite, root cause analysis of local build issues
- **[CLEANUP_CHECKLIST.md](./CLEANUP_CHECKLIST.md)** - Optional cleanup tasks, what's complete, when to reorganize files

## 📖 By Use Case

### I want to start coding
→ Read [QUICK_START.md](./QUICK_START.md), then [DEVELOPMENT.md](./DEVELOPMENT.md)

### I need to deploy this
→ Read [README.md](./README.md) deployment section, then run `npm run build`

### I want to understand the architecture  
→ Read [DEVELOPMENT.md](./DEVELOPMENT.md) "Project Architecture" section, then [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### I want to add a new feature
→ Read [DEVELOPMENT.md](./DEVELOPMENT.md) "Adding Features" section

### I'm debugging an issue
→ Read [DEVELOPMENT.md](./DEVELOPMENT.md) "Debugging" section, then check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for file locations

### I want to know why it works now locally
→ Read [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) "Root Causes" section

### I need to decide on cleanup/refactoring
→ Read [CLEANUP_CHECKLIST.md](./CLEANUP_CHECKLIST.md) "Why Not Force Everything into src/"

## 🎯 Common Commands

```bash
# Development
npm install              # First time setup
npm run dev              # Start dev server (localhost:3001)

# Building
npm run build            # Create production build
npm run preview          # Test production locally

# Maintenance
npm run lint             # Check code style
```

## 📁 Quick File Locations

- **Components**: `/components/`
- **Hooks**: `/hooks/`
- **Context**: `/context/`
- **Configuration**: `/config/`
- **Utilities**: `/utils/`
- **Type Definitions**: `/types/`
- **React Entry**: `/src/main.tsx`
- **App Component**: `/src/App.tsx`
- **Global Styles**: `/src/index.css`

All paths use `@/` alias (e.g., `@/components/WaveParticles.tsx`)

## ✅ Project Health

- Build System: ✅ Vite (fast & modern)
- Framework: ✅ React (clean & efficient)
- Styling: ✅ Tailwind CSS (organized)
- Performance: ✅ 60 FPS optimized
- Documentation: ✅ Complete
- Deployment: ✅ Ready anywhere
- Local Development: ✅ Works perfectly

## 🎓 Key Learning: Why It Works Now

**Problem**: Built with Next.js → worked in v0 preview → broke when exported locally

**Root Cause**: 
- Next.js SSR/build system had special handling for imports
- Local Webpack/build config didn't replicate this
- path aliases weren't resolving in all contexts

**Solution**: 
- Removed Next.js entirely
- Used Vite's native ES module support  
- Vite's path resolution works flawlessly
- Result: Works everywhere without special config

**Lesson**: Always prefer simpler tools for client-only apps. Next.js adds complexity when you only need React.

## 📞 Getting Help

| Question | Answer | Document |
|----------|--------|----------|
| How do I run this? | `npm install && npm run dev` | [QUICK_START.md](./QUICK_START.md) |
| How do I deploy? | `npm run build` then upload `/dist` | [README.md](./README.md) |
| How does it work? | See architecture section | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| Where are the files? | See directory structure | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) |
| Why was this built? | Converting from Next.js | [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) |
| What still needs work? | Check checklist | [CLEANUP_CHECKLIST.md](./CLEANUP_CHECKLIST.md) |

---

**Last Updated**: 2026-01-20
**Status**: ✅ Production Ready
**Next Action**: `npm run dev` to start building!
