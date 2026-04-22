# Auth Login Pages Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Bổ sung trang đăng nhập rõ ràng cho từng loại người dùng của hệ thống trung tâm anh ngữ: học viên/phụ huynh, giáo viên, admin/điều hành.

**Architecture:** Giai đoạn này thêm login UI/route và điều hướng portal theo role, chưa triển khai auth/session/RBAC thật. Các portal hiện tại vẫn là demo/live-data pages; login page đóng vai trò entry point để người dùng chọn đúng cổng và chuẩn bị cho auth backend ở phase sau.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS, Vitest + `renderToStaticMarkup`.

---

### Task 1: Create shared role login UI

**Objective:** Tạo component login dùng chung cho 3 role với copy, demo credential hint và CTA riêng.

**Files:**
- Create: `src/components/auth/login-page.tsx`
- Test: `src/components/auth/login-page.test.tsx`

**Requirements:**
- Render title "Đăng nhập hệ thống".
- Có 3 thẻ đăng nhập:
  - Học viên / phụ huynh → `/student`
  - Giáo viên → `/teacher`
  - Admin / điều hành → `/admin`
- Mỗi role có email/password fields, demo account hint, link/submit button đến portal tương ứng.
- Form phải là UI-only rõ ràng: ghi chú sẽ nối xác thực/session ở phase sau.

**Step 1: Write failing test**
- Test render contains 3 role labels.
- Test markup contains form actions `/student`, `/teacher`, `/admin`.
- Test contains demo credential text and security note.

**Step 2: Run test to verify RED**

Run: `npm test -- --run src/components/auth/login-page.test.tsx`
Expected: FAIL because files/component do not exist.

**Step 3: Implement component**
- Build responsive dark themed page consistent with portal pages.
- Use `PortalNav active="landing"` at top.
- Use `Link` back to landing.

**Step 4: Verify GREEN**

Run: `npm test -- --run src/components/auth/login-page.test.tsx`
Expected: PASS.

---

### Task 2: Add login routes and landing navigation

**Objective:** Expose login entry routes and replace direct portal CTAs on landing/nav with login-first journey.

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/student/login/page.tsx`
- Create: `src/app/teacher/login/page.tsx`
- Create: `src/app/admin/login/page.tsx`
- Modify: `src/components/shared/portal-nav.tsx`
- Modify: `src/components/landing/landing-page.tsx`

**Requirements:**
- `/login` renders all roles.
- `/student/login` renders/focuses student role but still shows role options.
- `/teacher/login` renders/focuses teacher role.
- `/admin/login` renders/focuses admin role.
- Global nav has "Đăng nhập" link.
- Landing CTAs point to the corresponding login pages, not directly to protected/demo portals.

**Step 1: Write failing tests**
- Extend login page test for focused role label/heading.
- Optionally assert landing markup includes `/student/login`, `/teacher/login`, `/admin/login`.

**Step 2: Run focused test RED/GREEN**

Run: `npm test -- --run src/components/auth/login-page.test.tsx`

**Step 3: Implement routes/nav changes**

**Step 4: Verify**

Run:
- `npm test -- --run src/components/auth/login-page.test.tsx`
- `npm test`
- `npm run lint`
- `npm run build`

---

### Task 3: Final review and deploy

**Objective:** Commit, push, redeploy Vercel, and verify login pages are reachable.

**Files:** all changed files.

**Verification:**
- `npm test` pass.
- `npm run lint` pass.
- `npm run build` pass.
- `git status --short` reviewed.
- Commit message: `feat: add role-based login pages`.
- Push main.
- Deploy Vercel production.
- Verify HTTP 200 for `/login`, `/student/login`, `/teacher/login`, `/admin/login`.

**Known limitation:** Auth/session/RBAC backend is not implemented in this task. Login forms are UI entry points only, consistent with current demo portal stage.
