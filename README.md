# Quản lý học viên trung tâm anh ngữ

Ứng dụng **Next.js full stack + SQLite** để quản lý toàn diện hoạt động của một trung tâm anh ngữ: học viên, phụ huynh, lớp học, giáo viên, ghi danh, buổi học, điểm danh, điểm số, học phí, chứng từ và dashboard điều hành.

## Tính năng đã có

### Dashboard điều hành

- KPI học vụ:
  - tổng học viên,
  - học viên đang học,
  - số lớp đang mở,
  - công suất lớp.
- KPI giảng dạy:
  - giáo viên đang hoạt động,
  - buổi học đã hoàn thành,
  - buổi học sắp tới,
  - tỷ lệ điểm danh quy đổi.
- KPI chất lượng:
  - điểm trung bình,
  - bài đánh giá gần đây,
  - danh sách học viên cần chăm sóc.
- KPI tài chính:
  - doanh thu dự kiến,
  - học phí đã thu,
  - công nợ còn phải thu,
  - hóa đơn quá hạn.

### Phân hệ nghiệp vụ

- Hồ sơ học viên:
  - thông tin liên hệ,
  - phụ huynh/người giám hộ,
  - mục tiêu học tập,
  - trạng thái học vụ.
- Lớp học và ghi danh:
  - trình độ,
  - giáo viên phụ trách,
  - lịch học,
  - sĩ số,
  - trạng thái thu học phí theo ghi danh.
- Giáo viên:
  - thông tin liên hệ,
  - chuyên môn,
  - trạng thái công tác,
  - đơn giá giờ dạy.
- Giảng dạy:
  - buổi học,
  - chủ đề,
  - bài tập về nhà,
  - trạng thái buổi học,
  - điểm danh.
- Điểm số:
  - bài kiểm tra / đánh giá,
  - loại đánh giá,
  - trọng số,
  - điểm từng học viên,
  - phản hồi học tập.
- Tài chính & chứng từ:
  - hóa đơn học phí,
  - giảm giá,
  - hạn thanh toán,
  - thanh toán,
  - tự động cập nhật trạng thái hóa đơn sau khi ghi nhận thanh toán.

## Backend API

- `GET/POST /api/students`
- `GET/POST /api/courses`
- `GET/POST /api/enrollments`
- `GET/POST /api/teachers`
- `GET/POST /api/sessions`
- `GET/POST /api/assessments`
- `GET/POST /api/invoices`
- `GET/POST /api/payments`
- `GET /api/dashboard`

API dùng Zod để validate payload đầu vào. SQLite migration tự động tạo các bảng cần thiết khi app khởi động.

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

## Cấu trúc chính

```text
src/
  app/
    api/
      assessments/route.ts
      courses/route.ts
      dashboard/route.ts
      enrollments/route.ts
      invoices/route.ts
      payments/route.ts
      sessions/route.ts
      students/route.ts
      teachers/route.ts
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

## Phase tiếp theo đề xuất

- CRUD frontend đầy đủ cho từng phân hệ.
- Trang chi tiết học viên với lịch sử điểm danh, điểm số, chứng từ.
- Phân quyền admin / giáo vụ / giáo viên / kế toán.
- Import/export Excel.
- Xuất PDF biên lai và phiếu thu.
- Lịch giáo viên, phòng học, nhắc nợ tự động.
- Sổ liên lạc phụ huynh và báo cáo tiến bộ định kỳ.
