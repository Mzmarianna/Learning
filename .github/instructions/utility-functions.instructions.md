---
applyTo: "src/utils/**/*.ts"
---

## Utility Function Guidelines

When working with utility functions in this project, please follow these guidelines:

1. **Function Design**
   - Keep functions pure when possible (no side effects)
   - Use descriptive function names that clearly indicate purpose
   - Export functions individually, not as default exports
   - Keep functions focused on a single responsibility

2. **TypeScript**
   - Always provide explicit return types
   - Use generics for reusable type-safe utilities
   - Avoid `any` type - use proper type annotations
   - Document complex type transformations

3. **Error Handling**
   - Throw errors for exceptional cases
   - Use custom error types when appropriate
   - Document thrown errors in JSDoc comments
   - Return `null` or `undefined` for expected failures

4. **Testing**
   - Utility functions should be easily testable
   - Avoid dependencies on global state
   - Use dependency injection for external services
   - Keep functions deterministic when possible

5. **Documentation**
   - Include JSDoc comments for public utilities
   - Document parameters, return values, and examples
   - Explain any non-obvious behavior or edge cases
   - Include usage examples for complex utilities

6. **Performance**
   - Consider memoization for expensive computations
   - Avoid unnecessary object/array creation
   - Use efficient algorithms and data structures
   - Profile performance-critical utilities
