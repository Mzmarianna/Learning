# Technical Debt & Known Issues

This document tracks technical debt and known issues that should be addressed in future updates.

## High Priority

### TypeScript Type Errors

**Issue:** Pre-existing TypeScript compilation errors in the codebase.

**Location:**
- `src/lib/curriculum/weeks-5-16-challenges.ts` (line 98)
  - Issue: Apostrophe escaping in string
  - Example: `'Use your own words (don\'t copy sentences)'`
  - Impact: Syntax error in curriculum content

- `src/lib/types/kingdom.ts` (line 163)
  - Issue: Space in property name `cosmetic Reward` should be `cosmeticReward`
  - Impact: Type definition error

- `src/public/_redirects/main.tsx`
  - Issue: Not a TypeScript file, but has `.tsx` extension
  - Should be: `_redirects` (no extension) in project root or public directory
  - Impact: Causes TypeScript compilation errors

**Current Workaround:**
- Lint workflow set to `continue-on-error: true` for type checking
- `tsconfig.json` excludes `src/public/_redirects` directory

**Recommended Fix:**
1. Fix string escaping in weeks-5-16-challenges.ts:
   ```typescript
   // Change from single quotes with escaped apostrophe
   'Use your own words (don\'t copy sentences)'
   // To double quotes (preferred)
   "Use your own words (don't copy sentences)"
   // Or to template literals
   `Use your own words (don't copy sentences)`
   ```

2. Fix property name in kingdom.ts:
   ```typescript
   // Change from:
   cosmetic Reward?: string;
   // To:
   cosmeticReward?: string;
   ```

3. Move and rename _redirects file:
   ```bash
   # Move from:
   src/public/_redirects/main.tsx
   # To:
   public/_redirects
   # (No file extension, it's a Netlify config file)
   ```

**Impact:**
- Prevents strict TypeScript enforcement in CI
- Could allow new type errors to slip through
- Affects developer experience with IDE errors

**Priority:** High - Should be fixed in next maintenance cycle

---

## Medium Priority

### Missing Linting Configuration

**Issue:** No ESLint or Prettier configuration in the repository.

**Impact:**
- Inconsistent code style across files
- No automatic style enforcement
- Manual code review burden

**Recommended Fix:**
1. Add ESLint configuration:
   ```bash
   npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
   ```

2. Add Prettier configuration:
   ```bash
   npm install --save-dev prettier eslint-config-prettier
   ```

3. Add npm scripts:
   ```json
   {
     "scripts": {
       "lint": "eslint . --ext .ts,.tsx",
       "lint:fix": "eslint . --ext .ts,.tsx --fix",
       "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
     }
   }
   ```

**Priority:** Medium - Improves code quality and consistency

---

### Large Bundle Size

**Issue:** Build produces a 1MB+ JavaScript bundle.

**Current State:**
```
dist/assets/index-Bq5lmTXb.js  1,014.14 kB │ gzip: 276.64 kB
```

**Impact:**
- Slower initial page load
- Poor performance on slow connections
- Mobile user experience affected

**Recommended Fix:**
1. Implement code splitting:
   ```typescript
   // Use React lazy loading
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. Configure manual chunks in vite.config.ts:
   ```typescript
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom', 'react-router-dom'],
             'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
           }
         }
       }
     }
   }
   ```

3. Analyze bundle with:
   ```bash
   npm install --save-dev rollup-plugin-visualizer
   ```

**Priority:** Medium - Performance improvement

---

### Image Optimization

**Issue:** Large unoptimized PNG images in bundle.

**Current State:**
```
dist/assets/64d5bb1a100e68b30321f1f4e7826d3c45d21e17-DpA-99BY.png  1,529.57 kB
dist/assets/8a35650ca022ec6bc649702b5b35c75083424e81-DR6zdWhX.png    520.34 kB
```

**Impact:**
- Slow page load times
- Excessive bandwidth usage
- Poor mobile experience

**Recommended Fix:**
1. Convert PNG to WebP format
2. Implement responsive images with srcset
3. Add image optimization to build process:
   ```bash
   npm install --save-dev vite-plugin-imagemin
   ```

4. Configure in vite.config.ts:
   ```typescript
   import viteImagemin from 'vite-plugin-imagemin';
   
   export default {
     plugins: [
       viteImagemin({
         webp: {
           quality: 75
         }
       })
     ]
   }
   ```

**Priority:** Medium - Performance and user experience

---

## Low Priority

### Missing Test Framework

**Issue:** No automated testing infrastructure.

**Impact:**
- Manual testing required for all changes
- Higher risk of regressions
- Slower development velocity

**Recommended Fix:**
1. Add Vitest for unit testing:
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
   ```

2. Add Playwright for E2E testing:
   ```bash
   npm install --save-dev @playwright/test
   ```

**Priority:** Low - Quality of life improvement

---

### Font Loading Optimization

**Issue:** No explicit font loading strategy documented.

**Recommended Fix:**
1. Add font-display: swap to all @font-face rules
2. Preload critical fonts in index.html
3. Limit font weights to 2-3 per family

**Priority:** Low - Performance optimization

---

## Tracking

| Issue | Priority | Estimated Effort | Target Version |
|-------|----------|------------------|----------------|
| TypeScript Errors | High | 2 hours | Next |
| ESLint/Prettier | Medium | 4 hours | v1.1 |
| Bundle Size | Medium | 8 hours | v1.1 |
| Image Optimization | Medium | 4 hours | v1.2 |
| Test Framework | Low | 16 hours | v2.0 |
| Font Loading | Low | 2 hours | v1.2 |

---

**Last Updated:** 2026-02-13
**Maintained By:** Development Team
