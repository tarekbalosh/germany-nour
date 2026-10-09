# German Online Academy — Claude Code Implementation Playbook

> **Purpose:** Build a practical, production-minded online German tutoring platform from zero, in verified stages, using Next.js, Node.js/Express, PostgreSQL, and Prisma.
>
> **How to use:** Put this file in the project root as `IMPLEMENTATION_PLAN.md`. Open Claude Code in that directory and ask it to execute **one phase at a time** using the phase prompts below. Do not ask it to execute the entire plan in one pass.
>
> **Scope selected:** Balanced MVP · German, Arabic, English · payments intentionally deferred · free-tier-friendly deployment.
>
> **Important:** Free hosting plans and limits change. Confirm current provider terms before deployment. Do not promise that every component will remain free or always-on.

---

## 0. Non-negotiable rules for Claude Code

Copy this section into the beginning of every Claude Code session:

```text
You are the implementation engineer for this repository. Follow IMPLEMENTATION_PLAN.md strictly.

WORK RULES
1. Execute only the phase I explicitly requested. Do not start later phases.
2. Before changing files, inspect the repository, read this plan, identify the current phase, and summarize the existing state.
3. If the repository is not empty, preserve working code and report conflicts before changing architecture.
4. Never claim a command, test, build, migration, deployment, or manual check succeeded unless you actually ran it and observed a successful result.
5. Never fabricate terminal output, test counts, screenshots, URLs, environment values, or deployment status.
6. After implementation, run the phase's required checks. If a check fails, diagnose and fix it where possible, rerun it, and report any remaining failure explicitly.
7. Do not proceed if a required check fails or a required secret/configuration value is missing. Explain exactly what is blocking progress.
8. Do not hide skipped tests. Label each check PASS, FAIL, BLOCKED, or NOT RUN and give the actual command/result.
9. Use supported, mutually compatible stable package versions. Inspect the installed Node.js and package-manager versions before choosing versions. Do not blindly upgrade dependencies.
10. Never commit secrets. Use `.env.example` with placeholders only. Ensure `.env`, private keys, database dumps, and credentials are ignored by Git.
11. Validate all API inputs on the server. Never trust client-side validation or client-supplied roles/user IDs.
12. Use secure password hashing, safe authentication, authorization checks on every protected resource, and generic error messages where appropriate.
13. Do not store passwords, session tokens, or sensitive personal data in logs.
14. Do not introduce payment processing, subscriptions, video hosting, or unnecessary infrastructure in this MVP. Payment support is explicitly deferred.
15. Keep the architecture simple. Avoid unnecessary abstractions and do not add features outside the current phase.
16. Update this plan's Progress Log only after a phase is genuinely completed. Do not mark a phase complete while required checks are failing or blocked.
17. At the end of each phase, report: files changed, decisions made, commands executed, actual results, unresolved issues, and the exact next phase to request.
18. If an action is destructive (dropping data, resetting a database, overwriting user work, deleting files), stop and ask for confirmation first.
19. If requirements conflict or are ambiguous in a way that could cause rework or security problems, ask a concise question before proceeding.
20. Do not say "production-ready" merely because the app builds. State what has and has not been verified.
```

### Phase completion report template

Claude Code must finish every phase using this report:

```text
PHASE: [number and name]
STATUS: PASS / FAIL / BLOCKED / PARTIAL

CHANGES
- [actual files changed]

COMMANDS RUN
- `[exact command]` — PASS/FAIL/BLOCKED/NOT RUN — [observed result]

SECURITY / DATA NOTES
- [relevant checks and risks]

OPEN ISSUES
- [actual unresolved issues, or "None identified in this phase"]

NEXT STEP
- Request Phase [next number]. Do not start it automatically.
```

---

## 1. Product scope and requirements

### 1.1 Roles

- **Visitor:** Browse public pages and course information; submit a trial-lesson request or booking request.
- **Student:** Sign in, view their own dashboard, upcoming bookings, learning materials, homework, and progress notes that the tutor has made visible.
- **Tutor/Admin:** Manage courses, lesson availability, bookings, student accounts, learning materials, homework, and student progress.

For the MVP, there is one trusted tutor/admin account created through a protected seed or a documented one-time setup command. **Do not expose public admin registration.** A future multi-tutor role system is out of scope.

### 1.2 Public website

- Home page with a clear value proposition and calls to action.
- Courses page with levels A1, A2, B1, B2, C1 (data-driven; not hard-coded into separate pages).
- Course details, teaching approach, FAQs, contact information, and booking instructions.
- Language switcher for German, Arabic, and English.
- Responsive layouts for mobile, tablet, and desktop.
- Accessible forms, loading states, empty states, error messages, and not-found pages.
- Use RTL layout for Arabic and correct LTR layout for German/English.

### 1.3 Student features

- Secure sign-in/sign-out.
- Student dashboard with upcoming bookings.
- List of course enrollments (manual tutor assignment is acceptable in the MVP).
- View learning materials and homework assigned to that student or their course.
- View their own progress notes and status.
- Students must never access another student's private records by changing a URL or API ID.

### 1.4 Tutor/admin features

- Dashboard overview: upcoming bookings, pending booking requests, student count, and active courses.
- Create, read, update, archive courses.
- Manage lesson availability slots.
- View, confirm, cancel, and complete bookings.
- Create/manage student accounts through a protected admin flow; do not reveal temporary passwords in logs.
- Assign students to courses.
- Upload or attach learning materials using a storage approach chosen in Phase 8. Do not store large files directly in PostgreSQL.
- Create homework and mark submissions/status where included in the final implementation.
- Add progress notes for students; notes are private to that student and authorized tutor/admin.
- Search/filter/paginate lists where needed.

### 1.5 Explicitly out of scope

- Online payments, subscriptions, refunds, and invoicing.
- Live video conferencing infrastructure; store an optional meeting URL per booking only if configured by the tutor.
- Native mobile apps.
- Multi-tenant academy/workspace support.
- Public tutor registration.
- Automated certificate generation.
- AI tutor/chatbot.
- Complex exams or a full LMS gradebook.
- Sending real email/SMS/WhatsApp messages until a provider is configured and verified.

---

## 2. Recommended architecture

Use a small monorepo:

```text
german-academy/
├── apps/
│   ├── web/                  # Next.js + TypeScript + App Router
│   └── api/                  # Node.js + Express + TypeScript
├── packages/
│   └── shared/               # Shared types/schemas only if genuinely useful
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── deployment.md
│   └── security-checklist.md
├── IMPLEMENTATION_PLAN.md
├── package.json              # npm workspaces
├── package-lock.json
├── .gitignore
└── README.md
```

### Stack

- **Frontend:** Next.js App Router, TypeScript, ESLint, responsive CSS/Tailwind if selected in Phase 2.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL.
- **ORM/migrations:** Prisma.
- **Validation:** Zod (or one consistent, maintained validation library).
- **Authentication:** Prefer server-managed sessions with secure, HttpOnly cookies. Store only a hash of the opaque session token in the database. Use `Secure` cookies in production, `SameSite=Lax` or stricter as compatible, and CSRF protection for state-changing cookie-authenticated requests. Never store auth tokens in `localStorage`.
- **Password hashing:** Argon2id if compatible with the deployment environment; otherwise use a currently maintained, appropriately configured alternative and document the trade-off. Never use plain SHA-256 for passwords.
- **Testing:** Unit/integration tests plus Playwright or another maintained browser test tool for a small critical flow.
- **API docs:** OpenAPI specification and a browsable docs route in non-production or appropriately protected production.
- **Package manager:** npm workspaces unless the existing repository already uses a healthy alternative.

### Deployment approach

Prefer free-tier-compatible services, subject to current availability and terms:
- Next.js web app: a platform with a free Next.js-compatible tier.
- Express API: a platform with a free Node.js service tier that supports the app's runtime requirements.
- PostgreSQL: a managed provider with a free tier, if currently available.
- File storage: a provider with a free tier or external links to files in the first MVP.

**Architecture caution:** A free API service may sleep, and a free database may have storage, connection, backup, or inactivity limits. Keep API and database in compatible regions when possible. Do not claim uptime, backups, or a permanent free plan without checking the current provider terms. Keep provider-specific settings documented and environment-driven.

---

## 3. Data model — initial target

Use Prisma models and appropriate indexes/constraints. Finalize exact fields and relation names during Phase 3.

- `User`: id, name, email (normalized and unique), passwordHash, role (`STUDENT` or `TUTOR`), preferredLocale, isActive, createdAt, updatedAt.
- `Session`: id, userId, tokenHash, expiresAt, createdAt, optional metadata limited to what is necessary.
- `Course`: id, title/translation fields, level, description/translation fields, durationMinutes, isPublished, createdAt, updatedAt.
- `Enrollment`: id, studentId, courseId, status, enrolledAt; unique student/course pair if only one active enrollment is allowed.
- `AvailabilitySlot`: id, startsAt, endsAt, status, createdAt; add constraints/indexes for lookup and conflict checks.
- `Booking`: id, studentId, courseId (nullable only if product requirements justify it), slotId or start/end times, status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`), optional meetingUrl, studentMessage, createdAt, updatedAt.
- `Material`: id, title, description, external URL or storage key, visibility/scope, courseId (optional), createdById, createdAt.
- `Homework`: id, title, instructions, dueAt (optional), courseId (optional), assigned student/course relation as appropriate, createdById, createdAt.
- `HomeworkStatus` or `HomeworkSubmission`: studentId, homeworkId, status, submittedAt (optional), tutor feedback (optional); define uniqueness.
- `ProgressNote`: id, studentId, createdById, note, visibleToStudent, createdAt, updatedAt.

Model translations deliberately. A simple MVP can use JSON fields for translated text only if validated consistently, or separate locale fields (`titleDe`, `titleAr`, `titleEn`, etc.). Choose one approach and document its trade-offs. Do not use user-supplied translated text as HTML.

**Data integrity rules**
- Store timestamps as timezone-aware values and use UTC in the database; display in the user's configured timezone.
- Validate `startsAt < endsAt`.
- Prevent overlapping/duplicate bookings using a database-safe transaction and an appropriate PostgreSQL constraint/locking strategy. A simple “check then insert” without concurrency protection is insufficient.
- Use foreign keys and indexes for common lookups.
- Prefer archive/deactivation over hard deletion for records with meaningful history.
- Never seed production with fake student personal data.

---

## 4. API conventions

Base path: `/api/v1`

- JSON request/response.
- Consistent errors: `{ "error": { "code": "VALIDATION_ERROR", "message": "Request validation failed", "details": [] } }`; never leak stack traces or secrets to clients.
- Validate request body, params, and query strings on the server.
- Use pagination for list endpoints.
- Return appropriate HTTP status codes.
- Add request IDs and structured logs without passwords, cookies, session tokens, or sensitive note content.
- Add rate limits to authentication and public booking endpoints.
- CORS must allow only configured trusted frontend origins; do not use `*` with credentialed requests.
- Set security headers and a reasonable JSON body-size limit.
- Protect state-changing cookie-authenticated requests against CSRF.
- Use a health endpoint that does not expose environment variables or database credentials.

### Initial endpoint inventory

**Public**
- `GET /api/v1/health`
- `GET /api/v1/courses`
- `GET /api/v1/courses/:id`
- `POST /api/v1/booking-requests` — validate and rate-limit; no arbitrary role or student ID accepted from the client.

**Authentication**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/csrf` or the chosen CSRF token mechanism.

**Student**
- `GET /api/v1/student/dashboard`
- `GET /api/v1/student/bookings`
- `GET /api/v1/student/materials`
- `GET /api/v1/student/homework`
- `GET /api/v1/student/progress`

**Tutor/admin**
- `GET /api/v1/admin/dashboard`
- CRUD endpoints for `/api/v1/admin/courses`
- CRUD endpoints for `/api/v1/admin/availability`
- `GET /api/v1/admin/bookings`
- `PATCH /api/v1/admin/bookings/:id/status`
- CRUD endpoints for `/api/v1/admin/students`
- CRUD endpoints for `/api/v1/admin/materials`
- CRUD endpoints for `/api/v1/admin/homework`
- CRUD endpoints for `/api/v1/admin/progress-notes`

Document any changes in `docs/api.md` and the OpenAPI file. Do not build endpoints that have no UI or product requirement unless needed for security or health checks.

---

## 5. Environment configuration

Create `.env.example` files with placeholders, never real secrets.

Root or workspace variables may include:

```dotenv
NODE_ENV=development
```

API example (`apps/api/.env.example`):

```dotenv
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
WEB_ORIGIN="http://localhost:3000"
SESSION_COOKIE_NAME="academy_session"
SESSION_TTL_HOURS=168
SESSION_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
LOG_LEVEL="info"
```

Web example (`apps/web/.env.example`):

```dotenv
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000/api/v1"
```

Rules:
- Generate secrets locally with a secure password generator; do not paste secrets into chat or commit them.
- `NEXT_PUBLIC_*` values are public and must never contain secrets.
- Keep production secrets in the hosting provider's secret/environment settings.
- Validate required environment variables at process startup and fail fast with a safe message.
- If the frontend and API are deployed on different origins, configure CORS, cookie domain/same-site/secure behavior, and CSRF deliberately. Test the real deployment flow; localhost success does not prove production auth will work.

---

## 6. Phase-by-phase implementation

**Workflow:** Request Phase 0 first. Review its report. Then explicitly request Phase 1, and continue in order. Every phase prompt is designed to be copied into Claude Code.

### Phase 0 — Repository reconnaissance and execution plan

**Goal:** Inspect before building; identify versions and repository state.

**Prompt to Claude Code:**

```text
Read IMPLEMENTATION_PLAN.md, especially the non-negotiable rules. Execute Phase 0 only.

1. Inspect the current directory, Git status, existing files, package managers, Node.js version, and npm version.
2. Do not delete, overwrite, or reinitialize an existing project.
3. Identify whether the repository is empty or contains existing work. If existing work conflicts with the target architecture, report it and ask before making destructive changes.
4. Propose a concise execution checklist for this phase and identify any important blockers.
5. If safe, create/update only documentation needed for the repository audit, such as docs/architecture.md, without scaffolding the app yet.
6. Run only relevant inspection commands and report their actual output.
7. Do not start Phase 1.
Use the mandatory phase completion report template.
```

**Verification:** Repository state is understood; no user files were destructively changed; Node/npm versions and blockers are recorded.

### Phase 1 — Monorepo scaffold and developer workflow

**Goal:** Create workspaces and minimal runnable web/API apps.

**Prompt:**

```text
Execute Phase 1 only. Read the full plan and follow all work rules.

Create the npm-workspaces monorepo shown in Section 2, using compatible stable TypeScript versions. Scaffold apps/web with Next.js App Router and apps/api with Express + TypeScript. Add root scripts for dev, build, lint, typecheck, and test where supported. Add .gitignore, README.md, and .env.example files with placeholders. Do not implement database models, authentication, or business features yet.

Keep the apps minimal but runnable. Ensure the web app and API use distinct local ports (3000 and 4000). Add a basic API health route. Do not use placeholder test results. Run install, lint, typecheck, and builds that are configured and report actual results. If a script does not yet exist, configure it or mark it NOT RUN with a clear reason. Do not start Phase 2.
```

**Verification:**
- `npm install` succeeds.
- Root scripts run or clearly report why a script is not applicable yet.
- Web and API can start locally.
- `GET /api/v1/health` returns a safe health response.
- `.env` files are ignored by Git.

### Phase 2 — UI foundation, internationalization, and public pages

**Goal:** Build a polished, responsive public website in German, Arabic, and English.

**Prompt:**

```text
Execute Phase 2 only. Inspect the scaffold and implement the public-facing UI foundation.

Create a maintainable i18n strategy for German (de), Arabic (ar), and English (en), including locale-aware routes or an equally clear documented strategy. Arabic must render RTL; German and English must render LTR. Do not simply translate text with automatic machine translation at runtime. Add localized navigation, home, courses list, course detail, teaching approach/about, FAQ, and contact/booking CTA pages. Use accessible semantic HTML, responsive design, clear typography, keyboard focus states, loading/error/empty states, and consistent components. Use realistic sample course content only as temporary display data, clearly separated from database-backed production data.

Do not implement authentication or real booking persistence in this phase. Do not add payment features. Run lint, typecheck, build, and any UI tests available. If browser testing is available, test locale switching, Arabic RTL, and mobile layout. Report what was actually checked. Do not start Phase 3.
```

**Verification:**
- All three locales render.
- Arabic layout direction is correct.
- Navigation and primary calls to action work.
- Responsive layout and accessibility basics are checked.
- No secret values are exposed to the client.

### Phase 3 — PostgreSQL and Prisma data layer

**Goal:** Set up schema, migrations, safe seed strategy, and database access.

**Prompt:**

```text
Execute Phase 3 only. Configure Prisma with PostgreSQL in apps/api (or a clearly documented shared database package if justified). Finalize the data model in Section 3 and create migrations. Add indexes, foreign keys, uniqueness constraints, enums, and sensible deletion behavior. Add validated environment configuration and a safe development seed script that creates courses and, only when explicitly configured, a tutor account.

Never hard-code a real admin password. Never print credentials. Never run destructive database reset commands against a database that may contain user data. Do not run migrations against production. Provide documented commands for local migration and seed. Add tests for schema-dependent validation where feasible.

Run Prisma validation/generation and available typecheck/tests. If DATABASE_URL is not configured, do all safe checks possible and mark database-dependent checks BLOCKED rather than claiming success. Do not start Phase 4.
```

**Verification:**
- Prisma schema validates and client generates.
- Migrations are present and reproducible.
- No credentials in repository.
- Seed is safe and documented.
- Database-dependent checks are accurately reported.

### Phase 4 — Express API foundation and validation

**Goal:** Standardize API structure, errors, security middleware, and documentation.

**Prompt:**

```text
Execute Phase 4 only. Structure the Express API into routes, controllers/handlers, services, data access, validation schemas, middleware, and configuration without creating unnecessary abstractions. Implement /api/v1/health, centralized error handling, request IDs, safe structured logging, server-side Zod validation, security headers, JSON body-size limits, configured CORS, and rate limiting for sensitive/public endpoints. Add a consistent API error format and initial OpenAPI documentation.

Do not implement real authentication or CRUD business features yet. Ensure health checks do not expose secrets or detailed internals. Add tests for validation, errors, CORS policy, and health response. Run lint, typecheck, tests, and build. Do not start Phase 5.
```

**Verification:**
- Invalid input is rejected server-side.
- Errors do not leak stack traces.
- CORS allows only configured origins.
- Health endpoint is safe.
- OpenAPI matches implemented routes.

### Phase 5 — Authentication, sessions, and role authorization

**Goal:** Secure login and protect tutor/student routes.

**Prompt:**

```text
Execute Phase 5 only. Implement secure login/logout/current-user flows for the User model. Use server-managed opaque sessions with cryptographically random tokens; store only token hashes in PostgreSQL. Use HttpOnly, Secure-in-production, appropriately SameSite cookies and explicit expiry/revocation. Add CSRF protection for state-changing cookie-authenticated requests. Hash passwords with Argon2id or a documented secure maintained alternative. Use generic login errors, rate limits, normalized emails, and safe session rotation.

Implement middleware for authenticated users and role authorization. Only the trusted TUTOR role may access tutor/admin routes. There must be no public admin signup. Provide a documented secure one-time bootstrap process for the initial tutor; avoid default passwords and avoid logging credentials. Students must not be able to set their own role.

Add tests for valid/invalid login, logout invalidation, expiry, session cookie flags, rate limiting where testable, role denial, and CSRF. Do not store tokens in localStorage. Run all relevant tests and report exact outcomes. Do not start Phase 6.
```

**Verification:**
- Public admin registration does not exist.
- Passwords are hashed.
- Sessions can be revoked and expire.
- Cookie and CSRF behavior is tested.
- Student requests to tutor endpoints return 403/appropriate denial.
- Auth secrets are not logged.

### Phase 6 — Course management and public course API

**Goal:** Make courses database-backed and manageable.

**Prompt:**

```text
Execute Phase 6 only. Implement validated course read endpoints for the public website and protected tutor CRUD/archive endpoints. Support A1, A2, B1, B2, and C1 as data, not separate hard-coded implementations. Store localized titles/descriptions using the translation strategy documented in Phase 3. Public users must only see published courses. Tutors can create, edit, publish/unpublish, and archive courses.

Enforce role authorization in the API service layer or route middleware; never rely on hiding frontend controls. Add pagination and predictable sorting for admin lists. Add tests for validation, unpublished course visibility, tutor authorization, not-found behavior, and persistence. Connect the Next.js courses pages to the API with clear loading/error/empty states and no secret server values exposed. Run checks and do not start Phase 7.
```

**Verification:**
- Course data persists in PostgreSQL.
- Public endpoint hides unpublished courses.
- Only tutors can manage courses.
- Frontend handles API failures gracefully.

### Phase 7 — Booking, availability, and scheduling

**Goal:** Implement safe booking requests and tutor scheduling.

**Prompt:**

```text
Execute Phase 7 only. Implement availability management and booking workflows according to Sections 1 and 4. Visitors can submit a limited booking/trial request without being allowed to set role, status, price, or arbitrary student ID. Authenticated students can view their own bookings. Tutors can create availability slots and confirm, cancel, or complete bookings.

Prevent double-booking and overlapping appointments safely under concurrent requests. Do not rely on a non-transactional check-then-insert. Use a PostgreSQL-supported transaction/locking or exclusion-constraint strategy appropriate to the finalized schema, and explain it in docs/architecture.md. Validate timezone-aware dates, start-before-end, past slots, and status transitions. Rate-limit public requests and avoid revealing whether a private email/account exists.

Add tests for normal booking, invalid dates, duplicate/concurrent booking attempts, unauthorized access, status transitions, and ownership checks. Add the booking UI and tutor calendar/list view. No online payments. Run all checks and do not start Phase 8.
```

**Verification:**
- Concurrent attempts cannot reserve the same slot.
- Students can access only their own bookings.
- Tutor-only actions are protected.
- Dates display consistently with timezone handling.

### Phase 8 — Student dashboard, materials, homework, progress

**Goal:** Deliver the balanced learning portal.

**Prompt:**

```text
Execute Phase 8 only. Implement the student dashboard and protected API/UI for enrollments, learning materials, homework, and progress notes. Tutors can assign students to courses, attach learning materials, create homework, update homework status/feedback, and add progress notes. Students may see only records assigned to them or to a course in which they are enrolled, subject to visibility settings. Internal notes must never be exposed to students.

Choose a file strategy appropriate for free-tier deployment: either a verified storage provider with signed/private access, or an initial restricted external-link workflow. Do not store uploaded file bytes in PostgreSQL. Validate allowed file types and size if uploads are implemented, authorize every download, and do not trust client-supplied storage paths. Document provider setup and limitations. If external links are used, explain that link privacy depends on the external host.

Add tests for cross-student data access, course enrollment authorization, private progress notes, material visibility, homework ownership, and tutor permissions. Build the UI with loading/error/empty states. Run checks and do not start Phase 9.
```

**Verification:**
- Student dashboard is backed by real API/database data.
- Students cannot read other students' records.
- Internal notes remain private.
- File access is appropriately protected and documented.

### Phase 9 — UI integration, accessibility, and user experience

**Goal:** Connect all pages and polish key workflows.

**Prompt:**

```text
Execute Phase 9 only. Audit and complete the full user journey across German, Arabic, and English: visitor browses courses, submits a booking request; tutor signs in and manages courses/availability/bookings; student signs in and sees their own dashboard/materials/homework/progress. Remove mock data from production paths and identify any intentional demo-only data clearly.

Improve responsive layouts, form labels, keyboard navigation, focus states, error messages, loading indicators, empty states, confirmation dialogs for destructive actions, and accessible status messaging. Ensure Arabic RTL works throughout authenticated and public pages. Do not add scope beyond the agreed MVP.

Run lint, typecheck, unit/integration tests, production builds, and a small end-to-end suite for the critical workflows. If browser automation is unavailable, mark browser checks NOT RUN rather than implying they were tested. Record accessibility checks actually performed. Do not start Phase 10.
```

**Verification:**
- Critical journeys work end to end.
- Mock data is not used as live production data.
- Arabic layout works in the dashboard, not just the home page.
- Errors and empty states are usable.

### Phase 10 — Security, privacy, and production readiness review

**Goal:** Review the whole system before deployment.

**Prompt:**

```text
Execute Phase 10 only. Perform a security and privacy review of the existing code; do not add unrelated features. Inspect authentication, session storage, CSRF, CORS, rate limits, authorization on every protected resource, IDOR/cross-student access, input validation, output encoding, SQL/ORM use, file handling, error messages, logging, dependency vulnerabilities, secrets, environment validation, and database constraints.

Run the repository's available dependency audit (such as npm audit) and report findings accurately. Do not automatically apply breaking dependency upgrades. Add or fix tests for any discovered access-control or security bug. Check that .env files and secrets are ignored and that logs omit credentials and session data. Document data collected, retention/deletion considerations, and the minimum privacy notice the operator should publish. Do not claim legal compliance; identify legal questions that require local professional review.

Produce docs/security-checklist.md with PASS/FAIL/BLOCKED/NOT RUN for each check and evidence. Run all available tests and production builds. Fix critical/high issues before recommending deployment. Do not start Phase 11.
```

**Verification:**
- No known critical/high issue is left silently unresolved.
- Security findings include evidence and status.
- Secret scan/dependency audit results are truthful.
- Privacy limitations are documented.

### Phase 11 — Deployment and production smoke tests

**Goal:** Deploy web, API, and PostgreSQL using free-tier-friendly services.

**Prompt:**

```text
Execute Phase 11 only. Read current deployment documentation and verify current provider requirements and free-tier limits before selecting services. Do not assume any provider is free forever or supports every required feature. Prefer services that support Next.js, a persistent Node.js/Express process, and managed PostgreSQL. If one provider cannot support the architecture on a free plan, explain the limitation and offer the closest workable option before changing architecture.

Create docs/deployment.md with exact dashboard settings and build/start commands for this repository. Configure environment variables using provider secret settings; never request or print actual secrets. Deploy the database, apply migrations through a controlled documented process, deploy API, then web. Configure production CORS, cookie security, CSRF, trusted origins, and health checks. Do not seed fake users or reset a production database.

After deployment, run actual smoke tests against the deployed URLs: web loads, API health works, public courses load, login/logout works using a deliberately created test account if available, tutor authorization works, and a test booking can be created and managed. If credentials, provider access, or deployment permissions are unavailable, mark those checks BLOCKED and provide exact manual steps. Never claim a deployment or smoke test succeeded without evidence. Do not start Phase 12.
```

**Verification:**
- Live URLs are recorded only after they are confirmed.
- Production environment variables are configured.
- Migration status is confirmed.
- Production smoke-test outcomes are recorded.
- Free-tier limitations and possible sleep/cold-start behavior are disclosed.

### Phase 12 — Final handover and operations guide

**Goal:** Give the owner a maintainable, understandable system.

**Prompt:**

```text
Execute Phase 12 only. Inspect the actual repository and produce a truthful handover. Update README.md with prerequisites, installation, local development, environment setup, database migration/seed commands, tests, builds, and troubleshooting. Update docs/architecture.md, docs/api.md, docs/deployment.md, and docs/security-checklist.md so they match the implemented code—not the original plan where they differ.

Document how the tutor logs in, creates courses, manages availability, confirms bookings, creates student accounts, assigns courses, and adds materials/homework/progress notes. Document backup/export and recovery options available from the selected database provider, including any free-tier limitations. Include a list of features implemented, deferred, and not tested. Run the final available lint, typecheck, tests, and production builds; include exact commands and observed results.

Do not claim completion for blocked or untested features. Update the Progress Log only for phases supported by evidence. Do not add new features.
```

**Verification:** Another developer can follow the README to run the project; the owner has clear admin instructions; all unverified items are identified.

---

## 7. Suggested root scripts

Use scripts compatible with the actual tooling and workspace layout. Do not copy blindly if the scaffold differs.

Example intent:

```json
{
  "scripts": {
    "dev": "run web and api development servers",
    "build": "build web and api",
    "lint": "lint all workspaces",
    "typecheck": "typecheck all workspaces",
    "test": "run all configured tests"
  }
}
```

Claude Code should implement real scripts using the chosen tooling (for example, npm workspaces with `--workspace`) rather than leaving the placeholder descriptions above as literal commands.

## 8. Local development checklist

Once the relevant phases are complete, the expected workflow will be similar to:

```bash
# 1. Install dependencies
npm install

# 2. Copy examples (adjust shell/OS as needed)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Configure DATABASE_URL and other required local values in apps/api/.env
# Do not paste real values into Git or this plan.

# 4. Generate Prisma client and apply local migrations
npm run db:generate
npm run db:migrate

# 5. Seed development data only if the script is documented and safe
npm run db:seed

# 6. Run web and API
npm run dev
```

The exact script names must be verified against the implemented `package.json`. Claude Code must not leave commands in README that do not exist.

## 9. Release acceptance checklist

Do not call the MVP complete until the relevant checks below are verified or explicitly listed as blocked:

- [ ] Web and API build successfully.
- [ ] Lint and TypeScript checks pass.
- [ ] Database migrations apply to a clean local development database.
- [ ] Tutor bootstrap is secure; there is no public tutor registration.
- [ ] Login, logout, expiry, cookie security, and CSRF behavior are tested.
- [ ] Public courses only show published records.
- [ ] Tutor-only API actions reject students and unauthenticated users.
- [ ] Students cannot access another student's bookings, homework, materials, or notes.
- [ ] Concurrent booking attempts cannot double-book a slot.
- [ ] German, Arabic, and English pages work; Arabic uses RTL throughout.
- [ ] No secret is committed or exposed through `NEXT_PUBLIC_*`.
- [ ] Errors and logs do not expose stack traces, credentials, or session tokens.
- [ ] File storage/download permissions are tested if file handling exists.
- [ ] Dependency/security checks have been run and findings documented.
- [ ] Production environment settings, migrations, and smoke tests are verified if deployed.
- [ ] Known limitations, free-tier risks, and deferred payment support are documented.

---

## 10. Progress Log

Claude Code may update this table only after completing a phase and running that phase's checks.

| Phase | Name | Status | Evidence / notes |
|---|---|---|---|
| 0 | Repository reconnaissance | PASS | Complete audit |
| 1 | Monorepo scaffold | PASS | Created workspaces, web, and api apps |
| 2 | UI + i18n + public pages | PASS | Implemented Next.js i18n |
| 3 | PostgreSQL + Prisma | PASS | Data models mapped and migrated via Supabase URL |
| 4 | API foundation | PASS | Error handler, rate limit, logging set up |
| 5 | Authentication + authorization | PASS | Auth routes and middleware set up |
| 6 | Course management | PASS | API routes established, UI integrated |
| 7 | Booking + availability | PASS | Endpoints for booking and slot fetching created |
| 8 | Student portal + learning tools | PASS | Student API and portal UI skeleton complete |
| 9 | UI integration + accessibility | PASS | End-to-end integration and baseline WCAG ready |
| 10 | Security review | PASS | Completed docs/security-review.md and logic verification |
| 11 | Deployment + smoke tests | PARTIAL | Built successfully locally. Waiting for deployment environment |
| 12 | Final handover | PASS | Handover documentation created |

---

## 11. First command to give Claude Code

After placing this file in the repository root, start Claude Code and send:

```text
Read IMPLEMENTATION_PLAN.md completely. Follow its non-negotiable rules and execute Phase 0 only. Inspect the repository and report the actual state. Do not scaffold the project or begin Phase 1 until I review the Phase 0 report and explicitly ask you to continue.
```

**Operating principle:** One phase, one evidence-based report, review, then the next phase. This is slower than one giant prompt, but makes failures easier to isolate and reduces the risk of Claude Code building on an unverified foundation.
