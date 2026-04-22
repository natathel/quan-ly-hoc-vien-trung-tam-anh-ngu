# Quản lý học viên trung tâm anh ngữ

Ứng dụng **Next.js full stack + SQLite** để quản lý học viên, lớp học, ghi danh và học phí cho một trung tâm anh ngữ.

## Tính năng đã có

- Dashboard tổng quan:
  - tổng học viên,
  - học viên đang học,
  - số lớp đang mở,
  - doanh thu dự kiến theo tháng,
  - công suất lớp,
  - số ghi danh chưa thu học phí.
- Frontend quản trị bằng Next.js App Router + Tailwind CSS.
- Backend API Route Handlers:
  - `GET/POST /api/students`
  - `GET/POST /api/courses`
  - `GET/POST /api/enrollments`
  - `GET /api/dashboard`
- SQLite local database với migration tự động.
- Seed dữ liệu mẫu cho trung tâm anh ngữ.
- Validation bằng Zod.
- Test bằng Vitest cho database và validators.

## Công nghệ

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- SQLite qua `better-sqlite3`
- Zod
- Vitest
- ESLint

## Cài đặt

```bash
npm install
```

## Chạy development

```bash
npm run dev
```

Mở trình duyệt tại:

```text
http://localhost:3000
```

## Database

Mặc định SQLite database được tạo tại:

```text
data/english-center.db
```

Có thể override bằng biến môi trường:

```bash
SQLITE_PATH=/duong/dan/database.db npm run dev
```

## Kiểm tra chất lượng

```bash
npm test
npm run lint
npm run build
```

Kết quả verify hiện tại:

- `npm test`: pass, 4 tests
- `npm run lint`: pass
- `npm run build`: pass

## Cấu trúc chính

```text
src/
  app/
    api/
      courses/route.ts
      dashboard/route.ts
      enrollments/route.ts
      students/route.ts
    layout.tsx
    page.tsx
  components/
    dashboard-shell.tsx
  lib/
    database.ts
    database.test.ts
    types.ts
    validators.ts
    validators.test.ts
```

## Hướng mở rộng tiếp theo

- Thêm form frontend để tạo/sửa/xóa học viên, lớp học và ghi danh.
- Thêm trang chi tiết học viên.
- Thêm phân quyền admin/nhân viên tư vấn/giáo viên.
- Thêm import/export Excel.
- Thêm lịch học và điểm danh.
- Thêm báo cáo học phí theo tháng.
