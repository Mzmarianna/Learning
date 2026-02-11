---
applyTo: "src/pages/**/*.tsx"
---

## Page Component Guidelines

When working with page components in this project, please follow these guidelines:

1. **Page Structure**
   - Pages are top-level route components in `src/pages/`
   - Use clear, semantic naming for page files (e.g., `HomePage.tsx`, `AboutPage.tsx`)
   - Each page should be self-contained with its own layout

2. **Routing**
   - Pages are mapped to routes via React Router
   - Use dynamic imports for code splitting large pages
   - Include proper meta tags for SEO (title, description)

3. **Data Fetching**
   - Fetch data at the page level, not in child components
   - Use React hooks for data fetching (`useEffect` with async functions)
   - Handle loading and error states appropriately
   - Show loading indicators for async operations

4. **Layout and Composition**
   - Break down complex pages into smaller components
   - Place page-specific components in a subfolder alongside the page
   - Reuse components from `src/components/` when possible

5. **Navigation**
   - Use React Router's `Link` or `useNavigate` for navigation
   - Avoid direct window location manipulation
   - Maintain browser history properly

6. **Authentication**
   - Check authentication state at page level
   - Redirect unauthorized users appropriately
   - Use Supabase auth helpers consistently

7. **Performance**
   - Lazy load heavy components
   - Optimize images and assets
   - Minimize re-renders with proper memoization
