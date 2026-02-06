# Copilot Instructions for Gamified Tutoring App

This is a Vite React TypeScript application for a gamified tutoring platform (Mz. Marianna's Academy). The application is deployed to Netlify for the front-end and uses Supabase for backend services.

## Project Overview

- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI components
- **Backend**: Supabase (database and edge functions)
- **Deployment**: Netlify (front-end), Supabase (backend functions)
- **Domain**: www.mzmarianna.com

## Code Standards

### Required Before Each Commit
- Ensure all TypeScript files compile without errors
- Follow existing code structure and naming conventions
- Use functional React components with hooks
- Maintain consistency with existing Radix UI and Tailwind CSS patterns

### Development Flow
- **Install dependencies**: `npm install`
- **Development server**: `npm run dev` (runs on port 3000)
- **Build**: `npm run build` (outputs to `dist/` directory)
- **Supabase local**: `npm run supabase` (starts local Supabase)

### Build Configuration
- Vite is configured to build to the `dist/` directory (not `build/`)
- TypeScript is used throughout the project with strict mode
- Path alias `@/` resolves to `./src/`

## Repository Structure

- **src/pages/**: React pages/routes for the application
- **src/components/**: Reusable React components
- **src/utils/**: Utility functions and helpers
- **src/assets/**: Static assets (images, etc.)
- **public/**: Public static files served at root
- **supabase/**: Supabase configuration and edge functions
- **scripts/**: Deployment and utility scripts
- **components/**: Shared UI components (Radix UI based)
- **lib/**: Core libraries and utilities

## Deployment

### Netlify Deployment
1. Build the application: `npm run build`
2. Deploy to Netlify: `netlify deploy --build --prod`
   - Publishes the `dist/` directory
   - Configuration is in `netlify.toml` at project root
   - Requires `NETLIFY_SITE_ID` and `NETLIFY_AUTH_TOKEN` environment variables

### Supabase Functions
Deploy Supabase edge functions:
```bash
supabase functions deploy server
supabase functions deploy send-email
```

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment runbook.

## Key Guidelines

1. **React Patterns**:
   - Use functional components with hooks
   - Prefer TypeScript interfaces for props
   - Follow existing component structure in `src/pages/` and `src/components/`

2. **Styling**:
   - Use Tailwind CSS utility classes
   - Follow existing Radix UI component patterns
   - Maintain responsive design patterns

3. **Assets and Images**:
   - See documentation: `ADDING_GRAPHICS_AND_PICTURES.md`, `HOW_TO_UPLOAD_IMAGES.md`
   - Optimize images with TinyPNG before adding
   - Place images in `src/assets/`
   - Import images: `import img from '@/assets/your-image.jpg'`

4. **TypeScript**:
   - Use proper typing for all components and functions
   - Avoid `any` types when possible
   - Follow existing type definitions

5. **Testing**:
   - No formal test framework is currently configured
   - Manual testing should be performed after changes
   - Test in development server before building

6. **Dependencies**:
   - Use existing libraries when possible
   - Major dependencies include: React, React Router, Radix UI, Tailwind CSS, Supabase
   - Check `package.json` before adding new dependencies

## Environment Variables

- Environment variables should be added to `.env` (local) and configured in Netlify Dashboard for production
- See `.env.example` for reference
- Required variables include Supabase credentials and API keys

## Documentation

The repository includes extensive documentation for various features:
- Image management: `ADDING_GRAPHICS_AND_PICTURES.md`, `QUICK_START_IMAGES.md`, `VISUAL_IMAGE_GUIDE.md`
- Deployment: `DEPLOYMENT.md`
- Platform overview: `PLATFORM_SUMMARY.md`
- Production checklist: `PRODUCTION_READY_CHECKLIST.md`

Always update relevant documentation when making significant changes to features or deployment processes.
