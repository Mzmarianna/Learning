---
applyTo: "src/components/**/*.tsx"
---

## React Component Guidelines

When working with React components in this project, please follow these guidelines:

1. **Component Structure**
   - Use functional components with TypeScript
   - Define prop types using TypeScript interfaces
   - Export component as default when it's the primary component in the file
   - Use named exports for helper components or utilities

2. **Hooks Usage**
   - Follow the Rules of Hooks (only call at top level)
   - Prefer built-in hooks over custom hooks when possible
   - Use `useCallback` and `useMemo` judiciously for performance optimization
   - Document any custom hooks with JSDoc comments

3. **Props and Types**
   - Always define TypeScript interfaces for component props
   - Name prop interfaces as `[ComponentName]Props`
   - Avoid using `any` type - use `unknown` if type is truly unknown
   - Use optional chaining (`?.`) for optional props

4. **Styling**
   - Use Tailwind CSS utility classes for styling
   - Follow existing Radix UI component patterns
   - Maintain responsive design with mobile-first approach
   - Use consistent spacing and sizing utilities

5. **State Management**
   - Keep state as local as possible
   - Lift state up only when necessary for component communication
   - Use context sparingly and only for truly global state
   - Document state updates that trigger re-renders

6. **Imports**
   - Use the `@/` path alias for imports from src directory
   - Group imports: React/external libraries, components, utilities, types
   - Avoid circular dependencies

7. **Accessibility**
   - Include proper ARIA labels and roles
   - Ensure keyboard navigation works
   - Use semantic HTML elements
   - Test with screen readers when possible
