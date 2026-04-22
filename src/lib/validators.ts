import { z } from "zod";

export const studentStatusSchema = z.enum(["active", "paused", "graduated"]);
export const paymentStatusSchema = z.enum(["paid", "partial", "unpaid"]);
export const teacherStatusSchema = z.enum(["active", "on_leave", "inactive"]);
export const sessionStatusSchema = z.enum(["scheduled", "completed", "cancelled"]);
export const attendanceStatusSchema = z.enum(["present", "absent", "late", "excused"]);
export const assessmentTypeSchema = z.enum(["placement", "quiz", "midterm", "final", "speaking", "writing"]);
export const invoiceStatusSchema = z.enum(["draft", "issued", "partially_paid", "paid", "overdue", "void"]);
export const paymentMethodSchema = z.enum(["cash", "bank_transfer", "card", "e_wallet"]);

const dateString = z
  .string()
  .min(1, "Vui lòng nhập ngày")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải có định dạng YYYY-MM-DD");

const timeString = z
  .string()
  .min(1, "Vui lòng nhập giờ")
  .regex(/^\d{2}:\d{2}$/, "Giờ phải có định dạng HH:mm");

export const studentSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().trim().min(8, "Số điện thoại chưa hợp lệ"),
  email: z.string().trim().email("Email chưa hợp lệ"),
  dateOfBirth: dateString,
  level: z.string().trim().min(1, "Vui lòng chọn trình độ"),
  status: studentStatusSchema.default("active"),
  enrollmentDate: dateString,
  guardianName: z.string().trim().optional().default(""),
  guardianPhone: z.string().trim().optional().default(""),
  learningGoal: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
});

export const courseSchema = z.object({
  name: z.string().trim().min(2, "Tên lớp phải có ít nhất 2 ký tự"),
  level: z.string().trim().min(1, "Vui lòng chọn trình độ"),
  teacher: z.string().trim().min(2, "Tên giáo viên phải có ít nhất 2 ký tự"),
  schedule: z.string().trim().min(3, "Vui lòng nhập lịch học"),
  monthlyFee: z.coerce.number().int().min(0, "Học phí không được âm"),
  capacity: z.coerce.number().int().min(1, "Sĩ số tối thiểu là 1"),
});

export const teacherSchema = z.object({
  fullName: z.string().trim().min(2, "Tên giáo viên phải có ít nhất 2 ký tự"),
  email: z.string().trim().email("Email chưa hợp lệ"),
  phone: z.string().trim().min(8, "Số điện thoại chưa hợp lệ"),
  specialization: z.string().trim().min(2, "Vui lòng nhập chuyên môn"),
  status: teacherStatusSchema.default("active"),
  hourlyRate: z.coerce.number().int().min(0, "Lương giờ không được âm"),
  notes: z.string().trim().optional().default(""),
});

export const enrollmentSchema = z.object({
  studentId: z.coerce.number().int().positive("Vui lòng chọn học viên"),
  courseId: z.coerce.number().int().positive("Vui lòng chọn lớp học"),
  startDate: dateString,
  endDate: z.string().nullable().optional(),
  paymentStatus: paymentStatusSchema.default("unpaid"),
});

export const sessionSchema = z.object({
  courseId: z.coerce.number().int().positive("Vui lòng chọn lớp học"),
  teacherId: z.coerce.number().int().positive("Vui lòng chọn giáo viên"),
  sessionDate: dateString,
  startTime: timeString,
  endTime: timeString,
  topic: z.string().trim().min(2, "Vui lòng nhập nội dung buổi học"),
  homework: z.string().trim().optional().default(""),
  status: sessionStatusSchema.default("scheduled"),
});

export const attendanceSchema = z.object({
  sessionId: z.coerce.number().int().positive("Vui lòng chọn buổi học"),
  studentId: z.coerce.number().int().positive("Vui lòng chọn học viên"),
  status: attendanceStatusSchema.default("present"),
  note: z.string().trim().optional().default(""),
});

export const assessmentSchema = z.object({
  courseId: z.coerce.number().int().positive("Vui lòng chọn lớp học"),
  title: z.string().trim().min(2, "Tên bài kiểm tra phải có ít nhất 2 ký tự"),
  assessmentType: assessmentTypeSchema.default("quiz"),
  assessmentDate: dateString,
  maxScore: z.coerce.number().positive("Điểm tối đa phải lớn hơn 0"),
  weight: z.coerce.number().min(0, "Trọng số không được âm").max(100, "Trọng số tối đa là 100"),
});

export const assessmentScoreSchema = z.object({
  assessmentId: z.coerce.number().int().positive("Vui lòng chọn bài kiểm tra"),
  studentId: z.coerce.number().int().positive("Vui lòng chọn học viên"),
  score: z.coerce.number().min(0, "Điểm không được âm"),
  feedback: z.string().trim().optional().default(""),
});

export const invoiceSchema = z.object({
  invoiceNo: z.string().trim().optional(),
  studentId: z.coerce.number().int().positive("Vui lòng chọn học viên"),
  enrollmentId: z.coerce.number().int().positive().nullable().optional(),
  issueDate: dateString,
  dueDate: dateString,
  amount: z.coerce.number().int().positive("Số tiền phải lớn hơn 0"),
  discount: z.coerce.number().int().min(0, "Giảm giá không được âm").optional().default(0),
  status: invoiceStatusSchema.default("issued"),
  description: z.string().trim().min(2, "Vui lòng nhập nội dung chứng từ"),
});

export const paymentSchema = z.object({
  invoiceId: z.coerce.number().int().positive("Vui lòng chọn hóa đơn"),
  paymentDate: dateString,
  amount: z.coerce.number().int().positive("Số tiền thanh toán phải lớn hơn 0"),
  method: paymentMethodSchema.default("cash"),
  referenceNo: z.string().trim().optional().default(""),
  note: z.string().trim().optional().default(""),
});
