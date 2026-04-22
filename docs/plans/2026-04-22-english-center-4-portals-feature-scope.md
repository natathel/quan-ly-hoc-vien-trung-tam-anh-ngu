# Quản lý học viên trung tâm anh ngữ — Phạm vi tính năng 4 cổng

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Mở rộng hệ thống thành 4 cổng rõ ràng gồm landing page, cổng học viên, cổng giáo viên và cổng admin với đầy đủ tính năng nghiệp vụ cho trung tâm anh ngữ.

**Architecture:** Giữ Next.js App Router làm nền tảng full stack, tách giao diện hiện tại thành các khu vực theo vai trò, tái sử dụng lớp API/domain hiện có rồi bổ sung phân quyền, workflow nghiệp vụ và báo cáo. Giai đoạn đầu ưu tiên hoàn thiện scope và UX theo vai trò; giai đoạn production sẽ chuyển dần từ SQLite local sang database hosted để vận hành bền vững.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, API routes, Zod, SQLite hiện tại (định hướng Turso/Postgres cho production).

---

## 1) Landing page

### Mục tiêu nghiệp vụ
- Giới thiệu trung tâm và các chương trình học.
- Chuyển đổi khách truy cập thành lead đăng ký tư vấn/học thử.
- Làm trang marketing và cổng điều hướng tới các khu vực đăng nhập.

### Tính năng cần có
- Hero section + CTA đăng ký học thử / tư vấn.
- Giới thiệu chương trình học theo độ tuổi/trình độ.
- Lợi thế cạnh tranh của trung tâm.
- Quy trình kiểm tra đầu vào và xếp lớp.
- Lịch khai giảng / lớp nổi bật.
- Đội ngũ giáo viên tiêu biểu.
- Feedback phụ huynh/học viên.
- FAQ.
- Form để lại thông tin lead.
- Điều hướng tới đăng nhập học viên / giáo viên / admin.

### Dữ liệu nghiệp vụ nên quản lý
- Leads tiềm năng.
- Nguồn lead (Facebook, website, giới thiệu, offline...).
- Nhu cầu học (IELTS, giao tiếp, thiếu nhi...).
- Trạng thái chăm sóc lead.

---

## 2) Cổng học viên / phụ huynh

### Mục tiêu nghiệp vụ
- Học viên hoặc phụ huynh tự theo dõi hành trình học tập và tài chính.
- Giảm tải khối lượng hỏi đáp thủ công cho giáo vụ.

### Tính năng hồ sơ
- Thông tin cá nhân học viên.
- Thông tin phụ huynh/người giám hộ.
- Trình độ, mục tiêu học tập.
- Tình trạng học tập hiện tại.
- Lịch sử đổi lớp / bảo lưu / nghỉ học.

### Tính năng học vụ
- Xem lớp đang học.
- Xem thời khóa biểu.
- Xem phòng học / giáo viên phụ trách.
- Xem lịch thi / lịch đánh giá.
- Xem điểm danh từng buổi.
- Xem tiến độ học tập và tỷ lệ chuyên cần.

### Tính năng kết quả học tập
- Xem điểm bài quiz, speaking, writing, midterm, final.
- Xem nhận xét của giáo viên.
- Xem năng lực theo kỹ năng (listening, speaking, reading, writing).
- Xem báo cáo tiến bộ theo tuần/tháng/kỳ.
- Xem khuyến nghị học tập cá nhân hóa.

### Tính năng tài chính
- Xem học phí theo lớp/đợt.
- Xem hóa đơn, công nợ, lịch đến hạn.
- Xem lịch sử thanh toán.
- Tải phiếu thu/biên nhận.
- Gửi yêu cầu hỗ trợ học phí hoặc xác nhận chuyển khoản.

### Tính năng tương tác
- Nhận thông báo nghỉ học / đổi lịch / thông báo học phí.
- Nhận bài tập về nhà.
- Gửi câu hỏi tới giáo vụ.
- Gửi đơn xin nghỉ / bảo lưu / đổi lớp.
- Theo dõi trạng thái xử lý yêu cầu.

---

## 3) Cổng giáo viên

### Mục tiêu nghiệp vụ
- Hỗ trợ giáo viên quản lý giảng dạy hằng ngày.
- Chuẩn hóa việc điểm danh, nhập điểm, ghi nhận tiến độ.

### Tính năng lớp phụ trách
- Danh sách lớp đang dạy.
- Thời khóa biểu cá nhân.
- Danh sách học viên trong từng lớp.
- Sĩ số, tình trạng chuyên cần, học viên cần chú ý.

### Tính năng vận hành buổi học
- Tạo/cập nhật lesson plan từng buổi.
- Ghi nội dung giảng dạy.
- Giao bài tập về nhà.
- Điểm danh theo buổi.
- Ghi chú tình huống lớp học.
- Đánh dấu buổi hoàn thành / dời lịch / hủy buổi.

### Tính năng đánh giá học tập
- Tạo bài kiểm tra/đầu mục đánh giá.
- Nhập điểm từng học viên.
- Ghi nhận feedback cá nhân.
- Theo dõi học viên yếu / tiến bộ chậm / nghỉ nhiều.
- Đề xuất can thiệp học thuật.

### Tính năng phối hợp nội bộ
- Gửi yêu cầu đổi lịch dạy.
- Gửi báo cáo lớp cho admin/giáo vụ.
- Nhận thông báo phân công lớp mới.
- Theo dõi định mức giờ dạy.
- Xem thu nhập/đối soát giờ dạy nếu cần.

---

## 4) Cổng admin

### Mục tiêu nghiệp vụ
- Điều hành toàn bộ trung tâm: tuyển sinh, học vụ, giáo viên, tài chính, báo cáo.
- Là nguồn dữ liệu chuẩn cho mọi bộ phận.

### Phân hệ dashboard điều hành
- KPI tổng học viên, lớp mở, giáo viên active.
- KPI doanh thu, công nợ, học phí đã thu.
- KPI chất lượng đào tạo, tỷ lệ điểm danh.
- Cảnh báo học viên có nguy cơ nghỉ học.
- Cảnh báo lớp gần đầy / thiếu giáo viên / công nợ quá hạn.

### Phân hệ CRM / tuyển sinh
- Quản lý lead từ website/ads/offline.
- Phân công nhân sự chăm sóc lead.
- Theo dõi trạng thái lead: mới, đã gọi, tư vấn, học thử, chốt, thất bại.
- Lịch sử tương tác với phụ huynh/học viên.
- Chuyển lead thành học viên chính thức.

### Phân hệ học viên
- CRUD hồ sơ học viên.
- Quản lý phụ huynh/người giám hộ.
- Xếp lớp / chuyển lớp / bảo lưu / nghỉ học / thôi học.
- Theo dõi lịch sử học tập.
- Ghi chú chăm sóc đặc biệt.

### Phân hệ lớp học
- Tạo lớp học.
- Gán giáo viên.
- Gán phòng học / ca học / lịch học.
- Kiểm soát sĩ số.
- Quản lý lịch khai giảng / kết thúc.
- Theo dõi công suất lớp.

### Phân hệ giáo viên & nhân sự chuyên môn
- Hồ sơ giáo viên.
- Chuyên môn, chứng chỉ, năng lực.
- Tình trạng công tác.
- Lịch dạy.
- Định mức giờ dạy.
- Đánh giá hiệu quả giảng dạy.

### Phân hệ khảo thí / chất lượng
- Tạo bộ tiêu chí đánh giá.
- Quản lý điểm số theo kỹ năng.
- Theo dõi tiến bộ theo lớp / giáo viên / khóa học.
- Danh sách học viên cần can thiệp.
- Báo cáo chất lượng đào tạo định kỳ.

### Phân hệ tài chính
- Tạo học phí / gói học / chính sách giá.
- Tạo hóa đơn.
- Ghi nhận thanh toán.
- Theo dõi công nợ.
- Giảm giá / học bổng / ưu đãi.
- Xuất phiếu thu / biên lai.
- Báo cáo doanh thu theo lớp, khóa, giáo viên, thời gian.

### Phân hệ yêu cầu & chăm sóc
- Tiếp nhận đơn xin nghỉ/bảo lưu/đổi lớp.
- Quy trình duyệt và phản hồi.
- Nhật ký xử lý yêu cầu.
- Nhắc việc cho giáo vụ.

### Phân hệ phân quyền & hệ thống
- Vai trò: super admin, admin, giáo vụ, kế toán, giáo viên, học viên/phụ huynh.
- Phân quyền theo chức năng và dữ liệu.
- Nhật ký thao tác hệ thống.
- Cấu hình học kỳ, ca học, loại đánh giá, mẫu thông báo.

---

## 5) Workflow nghiệp vụ xuyên suốt

### Workflow tuyển sinh → nhập học
1. Lead đăng ký từ landing page.
2. Admin/giáo vụ tiếp nhận lead.
3. Tư vấn và đặt lịch kiểm tra đầu vào.
4. Xếp lớp phù hợp.
5. Tạo hồ sơ học viên.
6. Tạo ghi danh + học phí.
7. Gửi thông báo nhập học.

### Workflow vận hành lớp học
1. Admin tạo lớp và phân công giáo viên.
2. Giáo viên nhận lớp và xem danh sách học viên.
3. Mỗi buổi giáo viên điểm danh + nhập nội dung học.
4. Hệ thống cập nhật tỷ lệ chuyên cần.
5. Admin theo dõi tình trạng lớp và cảnh báo.

### Workflow đánh giá học tập
1. Giáo viên tạo bài đánh giá.
2. Giáo viên nhập điểm và nhận xét.
3. Hệ thống tổng hợp tiến độ.
4. Học viên/phụ huynh xem kết quả.
5. Admin xem báo cáo chất lượng.

### Workflow tài chính
1. Admin tạo hóa đơn.
2. Học viên/phụ huynh xem công nợ.
3. Kế toán/admin ghi nhận thanh toán.
4. Hệ thống cập nhật trạng thái hóa đơn.
5. Dashboard cập nhật doanh thu/công nợ.

---

## 6) Ưu tiên triển khai đề xuất

### Giai đoạn 1 — Tái cấu trúc 4 cổng
- `/` landing page.
- `/student` cổng học viên.
- `/teacher` cổng giáo viên.
- `/admin` cổng admin.
- Tách component hiện tại khỏi một dashboard đơn.

### Giai đoạn 2 — Hoàn thiện nghiệp vụ lõi
- Học viên: lịch học, điểm danh, điểm số, học phí.
- Giáo viên: lớp phụ trách, điểm danh, nhập điểm, lesson log.
- Admin: học viên, lớp học, giáo viên, ghi danh, hóa đơn.

### Giai đoạn 3 — Yêu cầu, thông báo, báo cáo
- Đơn từ online.
- Thông báo theo vai trò.
- Báo cáo vận hành và chất lượng.
- Lead management từ landing page.

### Giai đoạn 4 — Production hóa
- Auth + RBAC đầy đủ.
- Chuyển SQLite local sang DB hosted.
- Audit log.
- File export/import.
- Tối ưu deploy production.

---

## 7) File/route nên có trong kiến trúc mới

### Route chính
- `src/app/page.tsx` → landing page
- `src/app/student/page.tsx`
- `src/app/student/schedule/page.tsx`
- `src/app/student/assessments/page.tsx`
- `src/app/student/payments/page.tsx`
- `src/app/teacher/page.tsx`
- `src/app/teacher/classes/page.tsx`
- `src/app/teacher/attendance/page.tsx`
- `src/app/teacher/assessments/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/students/page.tsx`
- `src/app/admin/teachers/page.tsx`
- `src/app/admin/courses/page.tsx`
- `src/app/admin/enrollments/page.tsx`
- `src/app/admin/invoices/page.tsx`
- `src/app/admin/leads/page.tsx`

### Component groups
- `src/components/landing/*`
- `src/components/student/*`
- `src/components/teacher/*`
- `src/components/admin/*`
- `src/components/shared/*`

### Domain/API mở rộng nên bổ sung
- `src/app/api/leads/route.ts`
- `src/app/api/attendance/route.ts` (nếu tách riêng khỏi sessions)
- `src/app/api/student-requests/route.ts`
- `src/app/api/notifications/route.ts`
- `src/app/api/reports/route.ts`
- `src/app/api/auth/*` (khi vào phase auth)

---

## 8) Kết luận

Phạm vi mới của dự án không còn là một dashboard tổng hợp đơn lẻ mà là một hệ thống vận hành trung tâm anh ngữ nhiều vai trò. Backend hiện tại đã có nền tốt cho các nghiệp vụ chính; việc tiếp theo là tổ chức lại frontend và bổ sung workflow theo từng bộ phận để hệ thống đủ dùng cho demo nhanh lẫn phát triển production lâu dài.
