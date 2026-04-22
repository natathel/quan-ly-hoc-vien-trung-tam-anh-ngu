export type StudentStatus = "active" | "paused" | "graduated";

export type PaymentStatus = "paid" | "partial" | "unpaid";
export type TeacherStatus = "active" | "on_leave" | "inactive";
export type SessionStatus = "scheduled" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type AssessmentType = "placement" | "quiz" | "midterm" | "final" | "speaking" | "writing";
export type InvoiceStatus = "draft" | "issued" | "partially_paid" | "paid" | "overdue" | "void";
export type PaymentMethod = "cash" | "bank_transfer" | "card" | "e_wallet";

export interface Student {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  level: string;
  status: StudentStatus;
  enrollmentDate: string;
  guardianName: string;
  guardianPhone: string;
  learningGoal: string;
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

export interface Teacher {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  status: TeacherStatus;
  hourlyRate: number;
  notes: string;
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

export interface Session {
  id: number;
  courseId: number;
  teacherId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  topic: string;
  homework: string;
  status: SessionStatus;
  courseName?: string;
  teacherName?: string;
  attendanceTotal?: number;
  absentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: number;
  sessionId: number;
  studentId: number;
  status: AttendanceStatus;
  note: string;
  studentName?: string;
}

export interface Assessment {
  id: number;
  courseId: number;
  title: string;
  assessmentType: AssessmentType;
  assessmentDate: string;
  maxScore: number;
  weight: number;
  courseName?: string;
  scoreCount?: number;
  averageScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentScore {
  id: number;
  assessmentId: number;
  studentId: number;
  score: number;
  feedback: string;
  studentName?: string;
}

export interface Invoice {
  id: number;
  invoiceNo: string;
  studentId: number;
  enrollmentId: number | null;
  issueDate: string;
  dueDate: string;
  amount: number;
  discount: number;
  status: InvoiceStatus;
  description: string;
  studentName?: string;
  courseName?: string;
  paidAmount?: number;
  outstandingAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  invoiceId: number;
  paymentDate: string;
  amount: number;
  method: PaymentMethod;
  referenceNo: string;
  note: string;
}

export interface StudentCareItem {
  studentId: number;
  studentName: string;
  reason: string;
  severity: "low" | "medium" | "high";
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  activeCourses: number;
  monthlyRevenue: number;
  unpaidEnrollments: number;
  capacityUsage: number;
  activeTeachers: number;
  scheduledSessions: number;
  completedSessions: number;
  attendanceRate: number;
  averageScore: number;
  issuedInvoices: number;
  overdueInvoices: number;
  outstandingTuition: number;
  collectedTuition: number;
}

export interface OperationalSummary {
  upcomingSessions: Session[];
  recentAssessments: Assessment[];
  openInvoices: Invoice[];
  studentCareList: StudentCareItem[];
}

export interface StudentInput {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  level: string;
  status: StudentStatus;
  enrollmentDate: string;
  guardianName?: string;
  guardianPhone?: string;
  learningGoal?: string;
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

export interface TeacherInput {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  status: TeacherStatus;
  hourlyRate: number;
  notes?: string;
}

export interface EnrollmentInput {
  studentId: number;
  courseId: number;
  startDate: string;
  endDate?: string | null;
  paymentStatus: PaymentStatus;
}

export interface SessionInput {
  courseId: number;
  teacherId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  topic: string;
  homework?: string;
  status: SessionStatus;
}

export interface AttendanceInput {
  sessionId: number;
  studentId: number;
  status: AttendanceStatus;
  note?: string;
}

export interface AssessmentInput {
  courseId: number;
  title: string;
  assessmentType: AssessmentType;
  assessmentDate: string;
  maxScore: number;
  weight: number;
}

export interface AssessmentScoreInput {
  assessmentId: number;
  studentId: number;
  score: number;
  feedback?: string;
}

export interface InvoiceInput {
  invoiceNo?: string;
  studentId: number;
  enrollmentId?: number | null;
  issueDate: string;
  dueDate: string;
  amount: number;
  discount?: number;
  status: InvoiceStatus;
  description: string;
}

export interface PaymentInput {
  invoiceId: number;
  paymentDate: string;
  amount: number;
  method: PaymentMethod;
  referenceNo?: string;
  note?: string;
}
