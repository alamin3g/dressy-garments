# Plan - SEO and Security Enhancements

Implement professional SEO metadata, comprehensive Open Graph tags, and a security status section in the admin dashboard.

## User Review Required

> [!IMPORTANT]
> To connect Google Search Console, you will need to complete the authorization flow in the Lovable preview once the diagnostic tool is started.

- **SEO Metadata**: Should I use a specific brand voice for the meta descriptions, or follow the existing "professional manufacturing" tone?
- **Security Section**: Does the "security issues scan results" refer to an internal database of findings or just a status indicator for the RLS/Role fixes I implemented previously?

## Proposed Changes

### SEO & Accessibility
- **SEO Metadata Helper**: Create `src/lib/seo.ts` to manage default titles, descriptions, and OG tags for all routes.
- **Route Updates**: Apply the SEO helper to all leaf routes, ensuring unique and keyword-rich metadata for each page.
- **Open Graph**: Add `og:image`, `og:url`, and `twitter:image` to all routes using relevant brand assets.
- **Robots.txt**: Update `public/robots.txt` with a more comprehensive list of user agents and a cleaner structure.
- **Typography & Contrast**: Review the admin dashboard colors to ensure they meet WCAG contrast guidelines, particularly for status text.

### Admin Dashboard
- **Security Tab**: Add a new "Security" section to the sidebar menu in `src/routes/admin.tsx`.
- **Empty State**: Implement a clean empty-state UI for the Security tab that displays "No security issues found" when the scan results are clear.
- **Visitor Analytics**: Refine the visitor tracking display to handle empty states and improve readability.

## Technical Details

- **SEO**: Use the `head()` function in TanStack Router to inject unique metadata per route.
- **Admin**: Modify the `MENU` constant and the main render logic in `src/routes/admin.tsx` to include the new section.
- **Accessibility**: Use Tailwind's color palette to adjust contrast ratios on background/foreground pairings.

