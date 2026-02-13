## What does this PR change?

<!-- Describe the changes made in this PR -->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Payment-related changes?

- [ ] Yes
- [ ] No

### If yes, confirm:

- [ ] Backend validation added for payment type
- [ ] Checkout URL validated against allowlist
- [ ] Payment state changes recorded in database
- [ ] No client-side payment URL construction
- [ ] Error handling implemented and tested

## Security Checklist

- [ ] No hardcoded credentials (checked for API keys, passwords, tokens)
- [ ] No service_role keys exposed in frontend code
- [ ] No `dangerouslySetInnerHTML` without sanitization (using `sanitize-html`)
- [ ] Redirect URLs validated against allowlist (no open redirects)
- [ ] All user inputs validated server-side
- [ ] Environment variables used for all sensitive data

## Code Quality Checklist

- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code follows existing patterns and style
- [ ] No use of `any` type (or properly justified)
- [ ] Proper null/undefined handling
- [ ] Components are properly typed with TypeScript interfaces

## Testing

- [ ] Tested changes locally in development server
- [ ] Tested on mobile viewport (responsive design)
- [ ] Checked browser console for errors
- [ ] Verified no broken links or images

### Manual Testing Steps

<!-- Describe how to manually test your changes -->

1. 
2. 
3. 

## Performance Considerations

- [ ] Images optimized (TinyPNG or WebP)
- [ ] Lazy loading implemented where appropriate
- [ ] No unnecessary re-renders (checked React DevTools)
- [ ] Large dependencies justified

## Accessibility Checklist

- [ ] Alt text provided for all images
- [ ] ARIA labels added for interactive elements
- [ ] Keyboard navigation works properly
- [ ] Color contrast meets WCAG AA standards

## SEO Checklist (if applicable)

- [ ] Meta title and description updated
- [ ] Open Graph tags included
- [ ] Alt text on images
- [ ] Semantic HTML used

## Documentation

- [ ] Updated relevant documentation (if needed)
- [ ] Added inline code comments for complex logic (if needed)
- [ ] README updated (if needed)

## Screenshots (if applicable)

<!-- Add screenshots or videos of UI changes -->

## Additional Notes

<!-- Any additional information that reviewers should know -->
