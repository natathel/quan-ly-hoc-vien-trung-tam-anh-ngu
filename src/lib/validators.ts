import { z } from "zod";

export const studentStatusSchema = z.enum(["active", "paused", "graduated"]);
export const paymentStatusSchema = z.enum(["paid", "partial", "unpaid"]);

const dateString = z
  .string()
  .min(1, "Vui lòng nhập ngày")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải có định dạng YYYY-MM-DD");

export const studentSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().trim().min(8, "Số điện thoại chưa hợp lệ"),
  email: z.string().trim().email("Email chưa hợp lệ"),
  dateOfBirth: dateString,
  level: z.string().trim().min(1, "Vui lòng chọn trình độ"),
  status: studentStatusSchema.default("active"),
  enrollmentDate: dateString,
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

export const enrollmentSchema = z.object({
  studentId: z.coerce.number().int().positive("Vui lòng chọn học viên"),
  courseId: z.coerce.number().int().positive("Vui lòng chọn lớp học"),
  startDate: dateString,
  endDate: z.string().nullable().optional(),
  paymentStatus: paymentStatusSchema.default("unpaid"),
});
