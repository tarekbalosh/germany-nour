# Accessibility Audit

## WCAG Baseline
- Semantic HTML tags are used (e.g. `main`, `nav`, `section`).
- Buttons and interactive elements are built with native tags or standard aria patterns.
- Color contrast ratios exceed WCAG AA requirements with Tailwind's standard palette.
- RTL layout support is confirmed via `dir="rtl"` on the `<html>` tag for Arabic locales.

## UI Integration
- Courses fetch successfully connects to the backend API.
- Bookings and Student Portal skeletons map correctly to backend schemas.
- Loading states and error handling boundaries are integrated within Next.js App Router standard boundaries.
