# Copilot Instructions for Gamified Tutoring App

This is a Vite React TypeScript application for a gamified tutoring platform (Mz. Marianna's Academy). The application is deployed to Vercel for the front-end and uses Supabase for backend services.

## Project Overview

- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI components
- **Backend**: Supabase (database and edge functions)
- **Deployment**: Vercel (front-end), Supabase (backend functions)
- **Domain**: www.mzmarianna.com
- **Business Model**: Multi-payment support (Stripe, PayPal invoices, Zelle, scholarships)
- **Priority**: Security and payment correctness are critical

## Security Rules (MANDATORY)

### 1. Secrets Management
- **NEVER** hardcode secrets, API keys, or credentials in code
- **ALWAYS** use environment variables for sensitive data
- Examples of environment variables:
  ```typescript
  process.env.VITE_SUPABASE_URL
  process.env.VITE_SUPABASE_ANON_KEY
  process.env.STRIPE_SECRET_KEY
  ```
- Secrets must be prefixed with `VITE_` only if needed in the client (e.g., Supabase anon key)
- Backend-only secrets (like `STRIPE_SECRET_KEY`) must NEVER have `VITE_` prefix

### 2. Service Role Key Protection
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- Service role keys must only be used in:
  - Supabase Edge Functions
  - Server-side code
  - CI/CD pipelines (as encrypted secrets)

### 3. Checkout URL Security
- **ALL** checkout URLs must be returned from the backend
- **NEVER** construct payment URLs directly in frontend code
- Backend must validate URLs against an allowlist of domains:
  ```typescript
  const ALLOWED_DOMAINS = [
    'checkout.stripe.com',
    'www.paypal.com',
    'www.mzmarianna.com'
  ];
  ```
- Prevent open redirect vulnerabilities by validating redirect URLs

### 4. Payment Type Validation
- **NEVER** trust payment type from client requests
- **ALWAYS** validate payment types server-side using enums or strict type checking
- Supported payment types:
  ```typescript
  type PaymentType = 'stripe' | 'paypal_invoice' | 'zelle' | 'scholarship';
  ```
- Validate payment type before processing any transaction

## Payment Rules

### Supported Payment Methods
1. **Stripe**: Credit/debit card payments via Stripe Checkout
2. **PayPal Invoice**: Manual invoicing system
3. **Zelle**: Bank transfer payments
4. **Scholarships**: ClassWallet or grant-based payments

### Payment Requirements
- All payment types must be validated server-side
- No direct client-side redirect logic for payments
- All payment state changes must be recorded in the database
- Payment flows must be auditable and traceable
- Handle payment errors gracefully and log them appropriately

### Payment Flow Pattern
```typescript
// ❌ BAD: Client-side payment logic
const handlePayment = () => {
  window.location.href = `https://checkout.stripe.com/...`;
};

// ✅ GOOD: Server-validated payment flow
const handlePayment = async (paymentType: PaymentType) => {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ paymentType })
  });
  const { checkoutUrl } = await response.json();
  // Backend validates URL before returning
  window.location.href = checkoutUrl;
};
```

## Code Style Expectations

### Type Safety
- Prefer explicit types over `any`
- Use TypeScript strict mode
- Validate null/undefined cases with proper checks
- Use type guards and discriminated unions for complex types
- Document complex type transformations

### Server-Side Validation Priority
- **ALWAYS** prefer server-side validation over frontend trust
- Validate all user inputs on the backend
- Never trust client-supplied data for security decisions
- Implement defense in depth: validate both client and server

### Business Logic Separation
- Keep business logic out of React components when possible
- Extract complex logic into utility functions or custom hooks
- Components should focus on presentation and user interaction
- Place validation logic in dedicated validation utilities

### Code Standards

#### Required Before Each Commit
- Ensure all TypeScript files compile without errors
- Run type checking: `npm run type-check`
- Follow existing code structure and naming conventions
- Use functional React components with hooks
- Maintain consistency with existing Radix UI and Tailwind CSS patterns
- No exposed credentials or secrets
- No unsafe DOM rendering (`dangerouslySetInnerHTML` without sanitization)
- No unvalidated redirects

### Development Flow
- **Install dependencies**: `npm install`
- **Development server**: `npm run dev` (runs on port 5173)
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

- Environment variables should be added to `.env.local` (local development) and configured in Vercel Dashboard for production
- See `.env.example` for reference
- Required variables include Supabase credentials and API keys
- Local development: Create `.env.local` file in project root with your credentials
- Production: Set environment variables in Vercel Dashboard → Project Settings → Environment Variables

## Documentation

The repository includes extensive documentation for various features:
- Image management: `ADDING_GRAPHICS_AND_PICTURES.md`, `QUICK_START_IMAGES.md`, `VISUAL_IMAGE_GUIDE.md`
- Deployment: `DEPLOYMENT.md`
- Platform overview: `PLATFORM_SUMMARY.md`
- Production checklist: `PRODUCTION_READY_CHECKLIST.md`

Always update relevant documentation when making significant changes to features or deployment processes.

## Pull Request Expectations

### Before Submitting a PR
- [ ] No exposed credentials or API keys
- [ ] No unsafe DOM rendering without sanitization
- [ ] No unvalidated redirects or checkout URLs
- [ ] No insecure payment logic
- [ ] All TypeScript compiles without errors
- [ ] Code follows existing patterns and style
- [ ] Documentation updated if needed

### PR Security Checklist
- [ ] No hardcoded credentials (check for API keys, passwords, tokens)
- [ ] No `dangerouslySetInnerHTML` without proper sanitization using `sanitize-html`
- [ ] Redirect URLs validated against allowlist
- [ ] Payment types validated server-side
- [ ] Checkout URLs returned from backend only
- [ ] No service_role keys in frontend code

### Payment-Related Changes Checklist
If your PR includes payment functionality:
- [ ] Backend validation added for payment type
- [ ] Checkout URL validated against allowlist
- [ ] Payment state changes recorded in database
- [ ] Error handling implemented
- [ ] No client-side payment URL construction

## Automation & CI/CD

### Security Automation
- **CodeQL**: Automated security scanning on every push/PR
- **AI PR Review**: Automated review focusing on security, payments, performance
- **Dependabot**: Automated dependency updates and vulnerability patches

### Quality Checks
- **Lint & Build**: Every PR must pass TypeScript compilation and build
- **Type Checking**: Strict TypeScript checks enforced
- **Manual Testing**: Test changes in dev server before merging

### Review Focus Areas
When code is reviewed (by AI or humans), reviewers focus on:
1. **Security**: Secrets, authentication, authorization, payment security
2. **Performance**: Large images, lazy loading, React re-renders, memoization
3. **SEO**: Meta tags, Open Graph, structured data, alt text
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **Fonts**: Loading optimization, font-display strategy
6. **Type Safety**: Proper TypeScript usage, null handling, type guards

## Business Goals & Optimization

As a tutoring platform focused on providing the best educational experience:
- **Target Audience**: Parents who want the best for their kids
- **Value Proposition**: Easy-to-follow instructions, visuals, and FUN learning
- **KPIs**: Acquisition, delivery quality, engagement, conversion, retention
- **Operations**: Automate repetitive tasks, optimize user flows, data-driven decisions

### Best Practices
- Optimize images for fast loading (use TinyPNG)
- Ensure mobile-first responsive design
- Make CTAs clear and prominent
- Track user flows and optimize conversion funnels
- Provide clear, visual instructions for students and parents
