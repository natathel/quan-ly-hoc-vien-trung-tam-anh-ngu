# English Center 4 Portals Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Convert the current single-dashboard Next.js app into a 4-portal English center management system: landing page, student/parent portal, teacher portal, and admin portal.

**Architecture:** Keep the existing SQLite-backed domain functions and API routes as the data foundation. Move the existing dashboard UI into `/admin`, replace `/` with a marketing/tuyển sinh landing page, then add role-specific student and teacher dashboards using existing database functions first. Add missing workflow/domain APIs in later phases without breaking the demo deployment.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, API routes, Zod, Vitest, SQLite via `better-sqlite3`.

---

## Current Codebase Snapshot

- Repo root: `/root/.hermes/github-bots/repos/quan-ly-hoc-vien-trung-tam-anh-ngu`
- Current UI entry: `src/app/page.tsx`
- Current full dashboard component: `src/components/dashboard-shell.tsx`
- Existing domain/API data:
  - students
  - courses
  - enrollments
  - teachers
  - sessions
  - assessments
  - invoices
  - payments
  - dashboard stats
- Existing quality commands:
  - `npm test`
  - `npm run lint`
  - `npm run build`

## Implementation Rules

- Preserve existing API behavior unless a task explicitly changes it.
- Keep demo-compatible SQLite implementation for now.
- Do not introduce authentication in Phase 1; use role-specific demo routes.
- Every route must be buildable by `npm run build`.
- Prefer server components for dashboard pages using direct database functions.
- Keep reusable UI in `src/components/shared`.
- Do not commit `.hermes/`.

---

## Phase 1 — Route Split and Portal Shells

### Task 1: Move current dashboard to `/admin`

**Objective:** Preserve the existing comprehensive dashboard but make it the admin portal instead of the homepage.

**Files:**
- Create: `src/app/admin/page.tsx`
- Modify: `src/app/page.tsx`
- Keep: `src/components/dashboard-shell.tsx`

**Steps:**
1. Create `src/app/admin/page.tsx` with the current logic from `src/app/page.tsx`:
   - import `DashboardShell`
   - call `getDashboardStats`, `getOperationalSummary`, `listStudents`, `listCourses`, `listEnrollments`, `listTeachers`
   - render `<DashboardShell ... />`
2. Temporarily replace `src/app/page.tsx` with a minimal landing placeholder linking to `/admin`, `/student`, `/teacher`.
3. Run:
   ```bash
   npm run lint
   npm run build
   ```
4. Expected:
   - `/admin` renders the existing dashboard.
   - `/` no longer loads dashboard data directly.

**Commit:**
```bash
git add src/app/page.tsx src/app/admin/page.tsx
git commit -m "feat: move operations dashboard to admin portal"
```

---

### Task 2: Add shared portal navigation components

**Objective:** Create shared UI primitives for consistent navigation between landing/student/teacher/admin portals.

**Files:**
- Create: `src/components/shared/portal-nav.tsx`
- Create: `src/components/shared/section-card.tsx`

**Implementation:**
- `PortalNav` props:
  - `active?: "landing" | "student" | "teacher" | "admin"`
- Nav links:
  - `/` → Landing
  - `/student` → Học viên
  - `/teacher` → Giáo viên
  - `/admin` → Admin
- `SectionCard` props:
  - `title: string`
  - `description?: string`
  - `children: React.ReactNode`
  - `accent?: "sky" | "emerald" | "amber" | "rose" | "violet"`

**Steps:**
1. Write component files.
2. Use Tailwind-only styling.
3. Import and use `PortalNav` in existing `/` placeholder.
4. Run:
   ```bash
   npm run lint
   npm run build
   ```

**Commit:**
```bash
git add src/components/shared src/app/page.tsx
git commit -m "feat: add shared portal navigation components"
```

---

### Task 3: Build landing page for tuyển sinh and product overview

**Objective:** Replace the placeholder homepage with a complete landing page that supports marketing and lead capture UX.

**Files:**
- Create: `src/components/landing/landing-page.tsx`
- Modify: `src/app/page.tsx`

**Landing sections:**
1. Hero: title, description, CTA buttons to `/student`, `/teacher`, `/admin`.
2. Program cards: thiếu nhi, giao tiếp, IELTS, mất gốc.
3. Operations value: học vụ, giáo viên, tài chính, báo cáo.
4. Admission workflow: đăng ký → kiểm tra đầu vào → xếp lớp → theo dõi tiến bộ.
5. Teacher highlights using demo copy.
6. FAQ.
7. Lead form UI only for now (no submit handler yet).

**Steps:**
1. Create `LandingPage` component.
2. Use `PortalNav active="landing"`.
3. Update `src/app/page.tsx` to render `<LandingPage />`.
4. Run:
   ```bash
   npm run lint
   npm run build
   ```

**Commit:**
```bash
git add src/app/page.tsx src/components/landing/landing-page.tsx
git commit -m "feat: add English center landing page"
```

---

### Task 4: Build student/parent dashboard route

**Objective:** Add a demo student portal showing learning, attendance, assessment, and payment information using existing data.

**Files:**
- Create: `src/app/student/page.tsx`
- Create: `src/components/student/student-portal.tsx`

**Data:**
Use existing database functions:
- `listStudents()`
- `listEnrollments()`
- `getOperationalSummary()`
- if available in `database.ts`, use list functions for invoices/assessments/sessions; otherwise use summary data.

**UI sections:**
1. Portal header for học viên/phụ huynh.
2. Student profile card using first demo student.
3. Current enrollment/class card.
4. Schedule/upcoming sessions card.
5. Attendance/progress card using summary/dashboard stats.
6. Assessment results card using recent assessments.
7. Tuition/invoice card using open invoices.
8. Student request quick actions: xin nghỉ, bảo lưu, đổi lớp, hỏi giáo vụ.

**Steps:**
1. Create server route `src/app/student/page.tsx` to load data.
2. Create presentational `StudentPortal` component.
3. Use `PortalNav active="student"` and `SectionCard`.
4. Run:
   ```bash
   npm run lint
   npm run build
   ```

**Commit:**
```bash
git add src/app/student src/components/student
git commit -m "feat: add student and parent portal dashboard"
```

---

### Task 5: Build teacher dashboard route

**Objective:** Add a teacher portal focused on classes, schedule, attendance, lesson logs, and assessments.

**Files:**
- Create: `src/app/teacher/page.tsx`
- Create: `src/components/teacher/teacher-portal.tsx`

**Data:**
Use existing database functions:
- `listTeachers()`
- `listCourses()`
- `listEnrollments()`
- `getOperationalSummary()`
- relevant list functions for sessions/assessments if exported.

**UI sections:**
1. Teacher profile card using first active teacher.
2. Teaching schedule/upcoming sessions.
3. Assigned classes.
4. Attendance action panel.
5. Assessment entry panel.
6. Student care/watchlist from `summary.studentCareList`.
7. Teacher request quick actions: đổi lịch, báo cáo lớp, ghi chú học viên.

**Steps:**
1. Create server route `src/app/teacher/page.tsx`.
2. Create `TeacherPortal` component.
3. Use `PortalNav active="teacher"` and `SectionCard`.
4. Run:
   ```bash
   npm run lint
   npm run build
   ```

**Commit:**
```bash
git add src/app/teacher src/components/teacher
git commit -m "feat: add teacher portal dashboard"
```

---

### Task 6: Improve admin dashboard shell for 4-portal architecture

**Objective:** Make admin dashboard clearly represent the admin portal and link to future admin modules.

**Files:**
- Modify: `src/components/dashboard-shell.tsx`

**Changes:**
1. Add `PortalNav active="admin"` at top.
2. Update hero badge to `Admin portal • Điều hành trung tâm`.
3. Add module shortcuts for:
   - học viên
   - giáo viên
   - lớp học
   - ghi danh
   - hóa đơn
   - CRM tuyển sinh
   - báo cáo
   - phân quyền
4. Keep all existing dashboard data tables/cards.

**Steps:**
1. Modify dashboard shell.
2. Run:
   ```bash
   npm run lint
   npm run build
   ```

**Commit:**
```bash
git add src/components/dashboard-shell.tsx
git commit -m "feat: align admin dashboard with portal architecture"
```

---

## Phase 2 — Module Placeholder Routes

### Task 7: Add student subpages

**Objective:** Add buildable routes for student workflows so navigation has real destinations.

**Files:**
- Create: `src/app/student/schedule/page.tsx`
- Create: `src/app/student/assessments/page.tsx`
- Create: `src/app/student/payments/page.tsx`

**Pages:**
- Schedule: upcoming sessions and attendance overview.
- Assessments: recent assessments and feedback UI.
- Payments: invoices, paid/outstanding tuition, payment instructions.

**Steps:**
1. Create each page as server component.
2. Use existing data functions.
3. Use shared `PortalNav` and `SectionCard`.
4. Run tests/build.

**Commit:**
```bash
git add src/app/student
git commit -m "feat: add student portal workflow pages"
```

---

### Task 8: Add teacher subpages

**Objective:** Add buildable teacher workflow pages.

**Files:**
- Create: `src/app/teacher/classes/page.tsx`
- Create: `src/app/teacher/attendance/page.tsx`
- Create: `src/app/teacher/assessments/page.tsx`

**Pages:**
- Classes: assigned classes, enrolled students, capacity.
- Attendance: session list and attendance action UI.
- Assessments: assessment list and score entry UI.

**Steps:**
1. Create pages.
2. Use existing data functions.
3. Run quality commands.

**Commit:**
```bash
git add src/app/teacher
git commit -m "feat: add teacher portal workflow pages"
```

---

### Task 9: Add admin module routes

**Objective:** Add buildable admin workflow pages for core departments.

**Files:**
- Create: `src/app/admin/students/page.tsx`
- Create: `src/app/admin/teachers/page.tsx`
- Create: `src/app/admin/courses/page.tsx`
- Create: `src/app/admin/enrollments/page.tsx`
- Create: `src/app/admin/invoices/page.tsx`
- Create: `src/app/admin/leads/page.tsx`

**Pages:**
- Students: student list and operations summary.
- Teachers: teacher list and workload overview.
- Courses: course capacity and schedule overview.
- Enrollments: enrollment/payment status.
- Invoices: open invoices/outstanding tuition.
- Leads: placeholder CRM board for landing-page leads.

**Steps:**
1. Create pages with existing data where available.
2. Create static CRM lead demo data for now.
3. Run quality commands.

**Commit:**
```bash
git add src/app/admin
git commit -m "feat: add admin department module pages"
```

---

## Phase 3 — Missing Business Domain APIs

### Task 10: Add lead domain model and API

**Objective:** Support landing page lead capture and admin CRM pipeline.

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/database.ts`
- Modify: `src/lib/validators.ts`
- Create: `src/app/api/leads/route.ts`
- Test: `src/lib/database.test.ts`
- Test: `src/lib/validators.test.ts`

**Domain fields:**
- id
- fullName
- phone
- email
- source
- programInterest
- status: `new | contacted | trial_scheduled | converted | lost`
- note
- createdAt
- updatedAt

**TDD Steps:**
1. Add failing validator tests for valid/invalid lead input.
2. Add failing database tests for create/list leads.
3. Implement type, migration, seed/demo-safe functions.
4. Implement API route GET/POST.
5. Run:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

**Commit:**
```bash
git add src/lib src/app/api/leads
git commit -m "feat: add lead management API"
```

---

### Task 11: Add student requests domain and API

**Objective:** Support student requests such as absence, reservation, class transfer, and support messages.

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/database.ts`
- Modify: `src/lib/validators.ts`
- Create: `src/app/api/student-requests/route.ts`
- Tests: database and validators tests.

**Domain fields:**
- id
- studentId
- requestType: `absence | reservation | class_transfer | support`
- title
- description
- status: `open | in_review | approved | rejected | closed`
- response
- createdAt
- updatedAt

**TDD Steps:**
1. Add validator tests.
2. Add database tests.
3. Implement migration and functions.
4. Implement API route.
5. Run quality commands.

**Commit:**
```bash
git add src/lib src/app/api/student-requests
git commit -m "feat: add student request workflow API"
```

---

### Task 12: Add notification domain and API

**Objective:** Support role-based announcements and reminders.

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/database.ts`
- Modify: `src/lib/validators.ts`
- Create: `src/app/api/notifications/route.ts`
- Tests: database and validators tests.

**Domain fields:**
- id
- audience: `all | students | teachers | admins`
- title
- message
- priority: `low | normal | high`
- publishedAt
- expiresAt
- createdAt
- updatedAt

**Commit:**
```bash
git add src/lib src/app/api/notifications
git commit -m "feat: add role-based notifications API"
```

---

## Phase 4 — Verification, Deploy, and GitHub

### Task 13: Full verification and independent review

**Objective:** Verify the complete 4-portal implementation before pushing.

**Steps:**
1. Run:
   ```bash
   npm test
   npm run lint
   npm run build
   ```
2. Check git status:
   ```bash
   git status --short
   git diff --stat
   ```
3. Scan staged diff for secrets:
   ```bash
   git diff --cached | grep "^+" | grep -iE "(api_key|secret|password|token|passwd)" || true
   ```
4. Request independent review using `requesting-code-review` workflow.
5. Fix any blocking issues.

**Expected:**
- Tests pass.
- Lint pass.
- Build pass.
- No secrets.
- Reviewer approves.

---

### Task 14: Push and deploy demo preview

**Objective:** Push verified implementation and deploy a preview build to Vercel.

**Steps:**
1. Push to GitHub:
   ```bash
   git push origin main
   ```
2. Deploy with Vercel CLI using token supplied by the user at runtime only:
   ```bash
   npx vercel deploy --yes --token "$VERCEL_TOKEN"
   ```
3. Verify URLs with curl/browser.
4. Report:
   - GitHub commit SHA
   - Vercel preview URL
   - Production/demo URL if aliased
   - Known limitations: SQLite local is demo only

---

## Acceptance Criteria

- `/` shows landing page.
- `/student` shows student/parent dashboard.
- `/teacher` shows teacher dashboard.
- `/admin` shows admin operations dashboard.
- Student subpages build and show relevant data.
- Teacher subpages build and show relevant data.
- Admin module pages build and show relevant data/placeholders.
- Existing APIs remain functional.
- New APIs for leads, student requests, and notifications have validator and database tests.
- `npm test`, `npm run lint`, and `npm run build` pass.
- No credentials or `.hermes/` files are committed.
- Demo deployment is available on Vercel after push.

## Recommended First Execution Batch

Start with Phase 1 Tasks 1–6. This produces a visible 4-portal demo quickly without risky database changes. After the UI architecture is stable, continue with Phase 2 pages and Phase 3 APIs.
