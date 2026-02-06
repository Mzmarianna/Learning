# Production Ready Checklist

Use this list before each production deployment.

- [ ] CI build succeeds with lint, type, and unit tests.
- [ ] `npm run build` creates an optimized bundle without warnings.
- [ ] `netlify deploy --prod` completes with the expected commit hash.
- [ ] Supabase function deploys finish and smoke tests pass.
- [ ] `.env` values reviewed; secrets stored in Netlify and Supabase dashboards.
- [ ] Accessibility spot check performed on key flows.
- [ ] Analytics dashboards updated with new metrics documentation.
- [ ] Stakeholders notified with release notes and rollback plan.
