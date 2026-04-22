export type StudentStatus = "active" | "paused" | "graduated";

export type PaymentStatus = "paid" | "partial" | "unpaid";

export interface Student {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  level: string;
  status: StudentStatus;
  enrollmentDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  name: string;
  level: string;
  teacher: string;
  schedule: string;
  monthlyFee: number;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  startDate: string;
  endDate: string | null;
  paymentStatus: PaymentStatus;
  studentName?: string;
  courseName?: string;
  level?: string;
  teacher?: string;
  monthlyFee?: number;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  activeCourses: number;
  monthlyRevenue: number;
  unpaidEnrollments: number;
  capacityUsage: number;
}

export interface StudentInput {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  level: string;
  status: StudentStatus;
  enrollmentDate: string;
  notes?: string;
}

export interface CourseInput {
  name: string;
  level: string;
  teacher: string;
  schedule: string;
  monthlyFee: number;
  capacity: number;
}

export interface EnrollmentInput {
  studentId: number;
  courseId: number;
  startDate: string;
  endDate?: string | null;
  paymentStatus: PaymentStatus;
}
