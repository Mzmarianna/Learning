# Netlify Redirects for SPA
# This ensures React Router works correctly

# Redirect non-www to www
https://mzmarianna.com/* https://www.mzmarianna.com/:splat 301!

# SPA fallback - all routes go to index.html
/*    /index.html   200
