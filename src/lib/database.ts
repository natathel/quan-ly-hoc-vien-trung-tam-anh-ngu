import * as fs from "node:fs";
import * as path from "node:path";
import Database from "better-sqlite3";
import type {
  Assessment,
  AssessmentInput,
  AssessmentScore,
  AssessmentScoreInput,
  AttendanceRecord,
  AttendanceInput,
  Course,
  CourseInput,
  DashboardStats,
  Enrollment,
  EnrollmentInput,
  Invoice,
  InvoiceInput,
  OperationalSummary,
  Payment,
  PaymentInput,
  Session,
  SessionInput,
  Student,
  StudentCareItem,
  StudentInput,
  Teacher,
  TeacherInput,
} from "./types";

function resolveDatabasePath() {
  return process.env.SQLITE_PATH ?? path.join(process.cwd(), "data", "english-center.db");
}

let dbInstance: Database.Database | null = null;
let activeDatabasePath: string | null = null;

function getDb() {
  const databasePath = resolveDatabasePath();

  if (dbInstance && activeDatabasePath !== databasePath) {
    dbInstance.close();
    dbInstance = null;
    activeDatabasePath = null;
  }

  if (!dbInstance) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    dbInstance = new Database(databasePath);
    activeDatabasePath = databasePath;
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
    migrate(dbInstance);
    seed(dbInstance);
  }

  return dbInstance;
}

function hasColumn(db: Database.Database, table: string, column: string) {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === column);
}

function ensureColumn(db: Database.Database, table: string, column: string, definition: string) {
  if (!hasColumn(db, table, column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      date_of_birth TEXT NOT NULL,
      level TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      enrollment_date TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level TEXT NOT NULL,
      teacher TEXT NOT NULL,
      schedule TEXT NOT NULL,
      monthly_fee INTEGER NOT NULL DEFAULT 0,
      capacity INTEGER NOT NULL DEFAULT 12,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      specialization TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      hourly_rate INTEGER NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, course_id),
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      teacher_id INTEGER NOT NULL,
      session_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      topic TEXT NOT NULL,
      homework TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'scheduled',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attendance_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'present',
      note TEXT NOT NULL DEFAULT '',
      UNIQUE(session_id, student_id),
      FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      assessment_type TEXT NOT NULL DEFAULT 'quiz',
      assessment_date TEXT NOT NULL,
      max_score REAL NOT NULL,
      weight REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessment_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assessment_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      score REAL NOT NULL,
      feedback TEXT NOT NULL DEFAULT '',
      UNIQUE(assessment_id, student_id),
      FOREIGN KEY(assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no TEXT NOT NULL UNIQUE,
      student_id INTEGER NOT NULL,
      enrollment_id INTEGER,
      issue_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      amount INTEGER NOT NULL,
      discount INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'issued',
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY(enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      payment_date TEXT NOT NULL,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL DEFAULT 'cash',
      reference_no TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      FOREIGN KEY(invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
    CREATE INDEX IF NOT EXISTS idx_students_level ON students(level);
    CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_course_date ON sessions(course_id, session_date);
    CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance_records(session_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_course ON assessments(course_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_student ON invoices(student_id);
    CREATE INDEX IF NOT EXISTS idx_payment_invoice ON payments(invoice_id);
  `);

  ensureColumn(db, "students", "guardian_name", "TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "students", "guardian_phone", "TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "students", "learning_goal", "TEXT NOT NULL DEFAULT ''");
}

function seed(db: Database.Database) {
  const insertStudent = db.prepare(`
    INSERT INTO students (
      full_name, phone, email, date_of_birth, level, status, enrollment_date,
      guardian_name, guardian_phone, learning_goal, notes
    ) VALUES (
      @fullName, @phone, @email, @dateOfBirth, @level, @status, @enrollmentDate,
      @guardianName, @guardianPhone, @learningGoal, @notes
    )
  `);

  const insertCourse = db.prepare(`
    INSERT INTO courses (name, level, teacher, schedule, monthly_fee, capacity)
    VALUES (@name, @level, @teacher, @schedule, @monthlyFee, @capacity)
  `);

  const insertTeacher = db.prepare(`
    INSERT INTO teachers (full_name, email, phone, specialization, status, hourly_rate, notes)
    VALUES (@fullName, @email, @phone, @specialization, @status, @hourlyRate, @notes)
  `);

  const insertEnrollment = db.prepare(`
    INSERT INTO enrollments (student_id, course_id, start_date, payment_status)
    VALUES (@studentId, @courseId, @startDate, @paymentStatus)
  `);

  const insertSession = db.prepare(`
    INSERT INTO sessions (course_id, teacher_id, session_date, start_time, end_time, topic, homework, status)
    VALUES (@courseId, @teacherId, @sessionDate, @startTime, @endTime, @topic, @homework, @status)
  `);

  const insertAttendance = db.prepare(`
    INSERT INTO attendance_records (session_id, student_id, status, note)
    VALUES (@sessionId, @studentId, @status, @note)
  `);

  const insertAssessment = db.prepare(`
    INSERT INTO assessments (course_id, title, assessment_type, assessment_date, max_score, weight)
    VALUES (@courseId, @title, @assessmentType, @assessmentDate, @maxScore, @weight)
  `);

  const insertAssessmentScore = db.prepare(`
    INSERT INTO assessment_scores (assessment_id, student_id, score, feedback)
    VALUES (@assessmentId, @studentId, @score, @feedback)
  `);

  const insertInvoice = db.prepare(`
    INSERT INTO invoices (invoice_no, student_id, enrollment_id, issue_date, due_date, amount, discount, status, description)
    VALUES (@invoiceNo, @studentId, @enrollmentId, @issueDate, @dueDate, @amount, @discount, @status, @description)
  `);

  const insertPayment = db.prepare(`
    INSERT INTO payments (invoice_id, payment_date, amount, method, reference_no, note)
    VALUES (@invoiceId, @paymentDate, @amount, @method, @referenceNo, @note)
  `);

  const students = [
    {
      fullName: "Nguyễn Minh Anh",
      phone: "0901234567",
      email: "minhanh@example.com",
      dateOfBirth: "2011-05-12",
      level: "A2",
      status: "active",
      enrollmentDate: "2026-01-05",
      guardianName: "Nguyễn Thị Hồng",
      guardianPhone: "0903000111",
      learningGoal: "Tăng phản xạ giao tiếp để thi Cambridge Movers.",
      notes: "Cần luyện thêm speaking.",
    },
    {
      fullName: "Trần Gia Hân",
      phone: "0912222333",
      email: "giahan@example.com",
      dateOfBirth: "2012-09-03",
      level: "A1",
      status: "active",
      enrollmentDate: "2026-02-10",
      guardianName: "Trần Văn Dũng",
      guardianPhone: "0912000222",
      learningGoal: "Xây nền ngữ pháp và từ vựng tiểu học.",
      notes: "Phụ huynh muốn nhận báo cáo hàng tháng.",
    },
    {
      fullName: "Lê Quốc Bảo",
      phone: "0988888123",
      email: "quocbao@example.com",
      dateOfBirth: "2010-11-24",
      level: "B1",
      status: "paused",
      enrollmentDate: "2025-11-15",
      guardianName: "Lê Thị Mai",
      guardianPhone: "0988000123",
      learningGoal: "Đạt 5.5 IELTS Foundation.",
      notes: "Tạm nghỉ 2 tuần vì lịch thi ở trường.",
    },
  ];

  const teachers = [
    {
      fullName: "Nguyễn Khánh Linh",
      email: "linh.teacher@example.com",
      phone: "0909111222",
      specialization: "Young Learners",
      status: "active",
      hourlyRate: 220000,
      notes: "Phụ trách lớp starter và phonics.",
    },
    {
      fullName: "David Tran",
      email: "david.teacher@example.com",
      phone: "0918111222",
      specialization: "Communication & Speaking",
      status: "active",
      hourlyRate: 320000,
      notes: "Mạnh về speaking club và role-play.",
    },
    {
      fullName: "Trần Thu Trang",
      email: "trang.teacher@example.com",
      phone: "0933444555",
      specialization: "IELTS Foundation",
      status: "on_leave",
      hourlyRate: 350000,
      notes: "Nghỉ phép đến cuối tháng.",
    },
  ];

  const courses = [
    {
      name: "Starter Kids A1",
      level: "A1",
      teacher: "Nguyễn Khánh Linh",
      schedule: "Thứ 2-4, 18:00-19:30",
      monthlyFee: 1600000,
      capacity: 12,
    },
    {
      name: "Communication A2",
      level: "A2",
      teacher: "David Tran",
      schedule: "Thứ 3-5, 19:00-20:30",
      monthlyFee: 1800000,
      capacity: 10,
    },
    {
      name: "IELTS Foundation B1",
      level: "B1",
      teacher: "Trần Thu Trang",
      schedule: "Thứ 7-CN, 09:00-11:00",
      monthlyFee: 2400000,
      capacity: 14,
    },
  ];

  const transaction = db.transaction(() => {
    const getCount = (table: string) => (db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number }).count;

    if (getCount("students") === 0) {
      students.forEach((student) => {
        insertStudent.run(student);
      });
    }

    if (getCount("courses") === 0) {
      courses.forEach((course) => {
        insertCourse.run(course);
      });
    }

    if (getCount("teachers") === 0) {
      teachers.forEach((teacher) => {
        insertTeacher.run(teacher);
      });
    }

    const studentRows = db.prepare("SELECT id, email FROM students").all() as Array<{ id: number; email: string }>;
    const courseRows = db.prepare("SELECT id, name FROM courses").all() as Array<{ id: number; name: string }>;
    const teacherRows = db.prepare("SELECT id, email FROM teachers").all() as Array<{ id: number; email: string }>;

    const studentIds = {
      minhAnh: studentRows.find((row) => row.email === "minhanh@example.com")?.id,
      giaHan: studentRows.find((row) => row.email === "giahan@example.com")?.id,
      quocBao: studentRows.find((row) => row.email === "quocbao@example.com")?.id,
    };

    const courseIds = {
      starter: courseRows.find((row) => row.name === "Starter Kids A1")?.id,
      communication: courseRows.find((row) => row.name === "Communication A2")?.id,
      ieltsFoundation: courseRows.find((row) => row.name === "IELTS Foundation B1")?.id,
    };

    const teacherIds = {
      linh: teacherRows.find((row) => row.email === "linh.teacher@example.com")?.id,
      david: teacherRows.find((row) => row.email === "david.teacher@example.com")?.id,
      trang: teacherRows.find((row) => row.email === "trang.teacher@example.com")?.id,
    };

    if (
      getCount("enrollments") === 0 &&
      studentIds.minhAnh &&
      studentIds.giaHan &&
      studentIds.quocBao &&
      courseIds.communication &&
      courseIds.starter &&
      courseIds.ieltsFoundation
    ) {
      insertEnrollment.run({ studentId: studentIds.minhAnh, courseId: courseIds.communication, startDate: "2026-01-05", paymentStatus: "paid" });
      insertEnrollment.run({ studentId: studentIds.giaHan, courseId: courseIds.starter, startDate: "2026-02-10", paymentStatus: "partial" });
      insertEnrollment.run({ studentId: studentIds.quocBao, courseId: courseIds.ieltsFoundation, startDate: "2025-11-15", paymentStatus: "unpaid" });
    }

    const enrollmentRows = db.prepare("SELECT id, student_id, course_id FROM enrollments").all() as Array<{ id: number; student_id: number; course_id: number }>;
    const enrollmentIds = {
      minhAnh: enrollmentRows.find((row) => row.student_id === studentIds.minhAnh && row.course_id === courseIds.communication)?.id,
      giaHan: enrollmentRows.find((row) => row.student_id === studentIds.giaHan && row.course_id === courseIds.starter)?.id,
      quocBao: enrollmentRows.find((row) => row.student_id === studentIds.quocBao && row.course_id === courseIds.ieltsFoundation)?.id,
    };

    if (
      getCount("sessions") === 0 &&
      courseIds.communication &&
      courseIds.starter &&
      courseIds.ieltsFoundation &&
      teacherIds.david &&
      teacherIds.linh &&
      teacherIds.trang
    ) {
      insertSession.run({
        courseId: courseIds.communication,
        teacherId: teacherIds.david,
        sessionDate: "2026-04-24",
        startTime: "19:00",
        endTime: "20:30",
        topic: "Speaking confidence and daily routines",
        homework: "Practice 10 daily routine questions.",
        status: "scheduled",
      });
      insertSession.run({
        courseId: courseIds.starter,
        teacherId: teacherIds.linh,
        sessionDate: "2026-04-20",
        startTime: "18:00",
        endTime: "19:30",
        topic: "Phonics and alphabet review",
        homework: "Worksheet pages 12-13",
        status: "completed",
      });
      insertSession.run({
        courseId: courseIds.ieltsFoundation,
        teacherId: teacherIds.trang,
        sessionDate: "2026-04-26",
        startTime: "09:00",
        endTime: "11:00",
        topic: "IELTS Listening strategy basics",
        homework: "Cam 7 Test 1 section 1-2",
        status: "scheduled",
      });
    }

    const sessionRows = db.prepare("SELECT id, course_id, session_date FROM sessions").all() as Array<{ id: number; course_id: number; session_date: string }>;
    const sessionIds = {
      communication: sessionRows.find((row) => row.course_id === courseIds.communication && row.session_date === "2026-04-24")?.id,
      starter: sessionRows.find((row) => row.course_id === courseIds.starter && row.session_date === "2026-04-20")?.id,
      ieltsFoundation: sessionRows.find((row) => row.course_id === courseIds.ieltsFoundation && row.session_date === "2026-04-26")?.id,
    };

    if (
      getCount("attendance_records") === 0 &&
      sessionIds.starter &&
      sessionIds.communication &&
      sessionIds.ieltsFoundation &&
      studentIds.giaHan &&
      studentIds.minhAnh &&
      studentIds.quocBao
    ) {
      insertAttendance.run({ sessionId: sessionIds.starter, studentId: studentIds.giaHan, status: "late", note: "Đến muộn 10 phút." });
      insertAttendance.run({ sessionId: sessionIds.communication, studentId: studentIds.minhAnh, status: "present", note: "" });
      insertAttendance.run({ sessionId: sessionIds.ieltsFoundation, studentId: studentIds.quocBao, status: "absent", note: "Xin phép do lịch thi." });
    }

    if (getCount("assessments") === 0 && courseIds.communication && courseIds.starter && courseIds.ieltsFoundation) {
      insertAssessment.run({
        courseId: courseIds.communication,
        title: "Mid-April Speaking Check",
        assessmentType: "speaking",
        assessmentDate: "2026-04-21",
        maxScore: 100,
        weight: 20,
      });
      insertAssessment.run({
        courseId: courseIds.starter,
        title: "Starter Quiz Unit 3",
        assessmentType: "quiz",
        assessmentDate: "2026-04-19",
        maxScore: 10,
        weight: 10,
      });
      insertAssessment.run({
        courseId: courseIds.ieltsFoundation,
        title: "Placement IELTS Foundation",
        assessmentType: "placement",
        assessmentDate: "2026-04-18",
        maxScore: 9,
        weight: 15,
      });
    }

    const assessmentRows = db.prepare("SELECT id, title FROM assessments").all() as Array<{ id: number; title: string }>;
    const assessmentIds = {
      speaking: assessmentRows.find((row) => row.title === "Mid-April Speaking Check")?.id,
      starterQuiz: assessmentRows.find((row) => row.title === "Starter Quiz Unit 3")?.id,
      placement: assessmentRows.find((row) => row.title === "Placement IELTS Foundation")?.id,
    };

    if (
      getCount("assessment_scores") === 0 &&
      assessmentIds.speaking &&
      assessmentIds.starterQuiz &&
      assessmentIds.placement &&
      studentIds.minhAnh &&
      studentIds.giaHan &&
      studentIds.quocBao
    ) {
      insertAssessmentScore.run({ assessmentId: assessmentIds.speaking, studentId: studentIds.minhAnh, score: 86, feedback: "Phản xạ tốt, cần phát âm cuối từ." });
      insertAssessmentScore.run({ assessmentId: assessmentIds.starterQuiz, studentId: studentIds.giaHan, score: 6, feedback: "Cần luyện thêm nhận diện âm." });
      insertAssessmentScore.run({ assessmentId: assessmentIds.placement, studentId: studentIds.quocBao, score: 4.5, feedback: "Nền tảng listening còn yếu." });
    }

    if (
      getCount("invoices") === 0 &&
      studentIds.minhAnh &&
      studentIds.giaHan &&
      studentIds.quocBao &&
      enrollmentIds.minhAnh &&
      enrollmentIds.giaHan &&
      enrollmentIds.quocBao
    ) {
      insertInvoice.run({
        invoiceNo: "INV-202604-001",
        studentId: studentIds.minhAnh,
        enrollmentId: enrollmentIds.minhAnh,
        issueDate: "2026-04-01",
        dueDate: "2026-04-05",
        amount: 1800000,
        discount: 0,
        status: "paid",
        description: "Học phí tháng 4 lớp Communication A2",
      });
      insertInvoice.run({
        invoiceNo: "INV-202604-002",
        studentId: studentIds.giaHan,
        enrollmentId: enrollmentIds.giaHan,
        issueDate: "2026-04-01",
        dueDate: "2026-04-05",
        amount: 1600000,
        discount: 100000,
        status: "partially_paid",
        description: "Học phí tháng 4 lớp Starter Kids A1",
      });
      insertInvoice.run({
        invoiceNo: "INV-202604-003",
        studentId: studentIds.quocBao,
        enrollmentId: enrollmentIds.quocBao,
        issueDate: "2026-04-01",
        dueDate: "2026-04-03",
        amount: 2400000,
        discount: 0,
        status: "overdue",
        description: "Học phí tháng 4 lớp IELTS Foundation B1",
      });
    }

    const invoiceRows = db.prepare("SELECT id, invoice_no FROM invoices").all() as Array<{ id: number; invoice_no: string }>;
    const invoiceIds = {
      first: invoiceRows.find((row) => row.invoice_no === "INV-202604-001")?.id,
      second: invoiceRows.find((row) => row.invoice_no === "INV-202604-002")?.id,
    };

    if (getCount("payments") === 0 && invoiceIds.first && invoiceIds.second) {
      insertPayment.run({ invoiceId: invoiceIds.first, paymentDate: "2026-04-03", amount: 1800000, method: "bank_transfer", referenceNo: "MB-0403-001", note: "Đã đối soát." });
      insertPayment.run({ invoiceId: invoiceIds.second, paymentDate: "2026-04-02", amount: 500000, method: "cash", referenceNo: "PT-0402-008", note: "Thu tại quầy." });
    }
  });

  transaction();
}

function mapStudent(row: Record<string, unknown>): Student {
  return {
    id: Number(row.id),
    fullName: String(row.full_name),
    phone: String(row.phone),
    email: String(row.email),
    dateOfBirth: String(row.date_of_birth),
    level: String(row.level),
    status: row.status as Student["status"],
    enrollmentDate: String(row.enrollment_date),
    guardianName: String(row.guardian_name ?? ""),
    guardianPhone: String(row.guardian_phone ?? ""),
    learningGoal: String(row.learning_goal ?? ""),
    notes: String(row.notes ?? ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapCourse(row: Record<string, unknown>): Course {
  return {
    id: Number(row.id),
    name: String(row.name),
    level: String(row.level),
    teacher: String(row.teacher),
    schedule: String(row.schedule),
    monthlyFee: Number(row.monthly_fee),
    capacity: Number(row.capacity),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapTeacher(row: Record<string, unknown>): Teacher {
  return {
    id: Number(row.id),
    fullName: String(row.full_name),
    email: String(row.email),
    phone: String(row.phone),
    specialization: String(row.specialization),
    status: row.status as Teacher["status"],
    hourlyRate: Number(row.hourly_rate),
    notes: String(row.notes ?? ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapEnrollment(row: Record<string, unknown>): Enrollment {
  return {
    id: Number(row.id),
    studentId: Number(row.student_id),
    courseId: Number(row.course_id),
    startDate: String(row.start_date),
    endDate: row.end_date ? String(row.end_date) : null,
    paymentStatus: row.payment_status as Enrollment["paymentStatus"],
    studentName: row.student_name ? String(row.student_name) : undefined,
    courseName: row.course_name ? String(row.course_name) : undefined,
    level: row.level ? String(row.level) : undefined,
    teacher: row.teacher ? String(row.teacher) : undefined,
    monthlyFee: row.monthly_fee !== undefined && row.monthly_fee !== null ? Number(row.monthly_fee) : undefined,
  };
}

function mapSession(row: Record<string, unknown>): Session {
  return {
    id: Number(row.id),
    courseId: Number(row.course_id),
    teacherId: Number(row.teacher_id),
    sessionDate: String(row.session_date),
    startTime: String(row.start_time),
    endTime: String(row.end_time),
    topic: String(row.topic),
    homework: String(row.homework ?? ""),
    status: row.status as Session["status"],
    courseName: row.course_name ? String(row.course_name) : undefined,
    teacherName: row.teacher_name ? String(row.teacher_name) : undefined,
    attendanceTotal: row.attendance_total !== undefined && row.attendance_total !== null ? Number(row.attendance_total) : undefined,
    absentCount: row.absent_count !== undefined && row.absent_count !== null ? Number(row.absent_count) : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapAttendance(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: Number(row.id),
    sessionId: Number(row.session_id),
    studentId: Number(row.student_id),
    status: row.status as AttendanceRecord["status"],
    note: String(row.note ?? ""),
    studentName: row.student_name ? String(row.student_name) : undefined,
  };
}

function mapAssessment(row: Record<string, unknown>): Assessment {
  return {
    id: Number(row.id),
    courseId: Number(row.course_id),
    title: String(row.title),
    assessmentType: row.assessment_type as Assessment["assessmentType"],
    assessmentDate: String(row.assessment_date),
    maxScore: Number(row.max_score),
    weight: Number(row.weight),
    courseName: row.course_name ? String(row.course_name) : undefined,
    scoreCount: row.score_count !== undefined && row.score_count !== null ? Number(row.score_count) : undefined,
    averageScore: row.average_score !== undefined && row.average_score !== null ? Number(row.average_score) : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapAssessmentScore(row: Record<string, unknown>): AssessmentScore {
  return {
    id: Number(row.id),
    assessmentId: Number(row.assessment_id),
    studentId: Number(row.student_id),
    score: Number(row.score),
    feedback: String(row.feedback ?? ""),
    studentName: row.student_name ? String(row.student_name) : undefined,
  };
}

function mapInvoice(row: Record<string, unknown>): Invoice {
  const amount = Number(row.amount);
  const discount = Number(row.discount ?? 0);
  const paidAmount = Number(row.paid_amount ?? 0);
  return {
    id: Number(row.id),
    invoiceNo: String(row.invoice_no),
    studentId: Number(row.student_id),
    enrollmentId: row.enrollment_id === null || row.enrollment_id === undefined ? null : Number(row.enrollment_id),
    issueDate: String(row.issue_date),
    dueDate: String(row.due_date),
    amount,
    discount,
    status: row.status as Invoice["status"],
    description: String(row.description ?? ""),
    studentName: row.student_name ? String(row.student_name) : undefined,
    courseName: row.course_name ? String(row.course_name) : undefined,
    paidAmount,
    outstandingAmount: Math.max(amount - discount - paidAmount, 0),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapPayment(row: Record<string, unknown>): Payment {
  return {
    id: Number(row.id),
    invoiceId: Number(row.invoice_id),
    paymentDate: String(row.payment_date),
    amount: Number(row.amount),
    method: row.method as Payment["method"],
    referenceNo: String(row.reference_no ?? ""),
    note: String(row.note ?? ""),
  };
}

function mapStudentCareItem(row: Record<string, unknown>): StudentCareItem {
  return {
    studentId: Number(row.student_id),
    studentName: String(row.student_name),
    reason: String(row.reason),
    severity: row.severity as StudentCareItem["severity"],
  };
}

function refreshInvoiceStatus(invoiceId: number) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT invoices.id, invoices.amount, invoices.discount, invoices.due_date,
              COALESCE(SUM(payments.amount), 0) AS paid_amount
       FROM invoices
       LEFT JOIN payments ON payments.invoice_id = invoices.id
       WHERE invoices.id = ?
       GROUP BY invoices.id`,
    )
    .get(invoiceId) as { id: number; amount: number; discount: number; due_date: string; paid_amount: number } | undefined;

  if (!row) return;

  const netAmount = row.amount - row.discount;
  let status = "issued";
  if (row.paid_amount <= 0) {
    status = row.due_date < todayIso() ? "overdue" : "issued";
  } else if (row.paid_amount >= netAmount) {
    status = "paid";
  } else {
    status = "partially_paid";
  }

  db.prepare("UPDATE invoices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, invoiceId);
}

function nextInvoiceNo() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) AS count FROM invoices").get() as { count: number }).count + 1;
  return `INV-${todayIso().replace(/-/g, "")}-${String(count).padStart(3, "0")}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function listStudents(query = ""): Student[] {
  const db = getDb();
  const normalizedQuery = `%${query.trim()}%`;
  const rows = db
    .prepare(
      `SELECT * FROM students
       WHERE @query = '%%'
          OR full_name LIKE @query
          OR phone LIKE @query
          OR email LIKE @query
          OR level LIKE @query
          OR guardian_name LIKE @query
       ORDER BY status = 'active' DESC, updated_at DESC, full_name ASC`,
    )
    .all({ query: normalizedQuery }) as Record<string, unknown>[];

  return rows.map(mapStudent);
}

export function createStudent(input: StudentInput): Student {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO students (
        full_name, phone, email, date_of_birth, level, status, enrollment_date,
        guardian_name, guardian_phone, learning_goal, notes
      ) VALUES (
        @fullName, @phone, @email, @dateOfBirth, @level, @status, @enrollmentDate,
        @guardianName, @guardianPhone, @learningGoal, @notes
      )`,
    )
    .run({
      ...input,
      guardianName: input.guardianName ?? "",
      guardianPhone: input.guardianPhone ?? "",
      learningGoal: input.learningGoal ?? "",
      notes: input.notes ?? "",
    });

  return getStudent(Number(result.lastInsertRowid));
}

export function getStudent(id: number): Student {
  const db = getDb();
  const row = db.prepare("SELECT * FROM students WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!row) throw new Error("Không tìm thấy học viên");
  return mapStudent(row);
}

export function listCourses(): Course[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM courses ORDER BY level ASC, name ASC").all() as Record<string, unknown>[];
  return rows.map(mapCourse);
}

export function createCourse(input: CourseInput): Course {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO courses (name, level, teacher, schedule, monthly_fee, capacity)
       VALUES (@name, @level, @teacher, @schedule, @monthlyFee, @capacity)`,
    )
    .run(input);

  const row = db.prepare("SELECT * FROM courses WHERE id = ?").get(result.lastInsertRowid) as Record<string, unknown>;
  return mapCourse(row);
}

export function listTeachers(): Teacher[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM teachers ORDER BY status = 'active' DESC, full_name ASC").all() as Record<string, unknown>[];
  return rows.map(mapTeacher);
}

export function createTeacher(input: TeacherInput): Teacher {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO teachers (full_name, email, phone, specialization, status, hourly_rate, notes)
       VALUES (@fullName, @email, @phone, @specialization, @status, @hourlyRate, @notes)`,
    )
    .run({ ...input, notes: input.notes ?? "" });

  const row = db.prepare("SELECT * FROM teachers WHERE id = ?").get(result.lastInsertRowid) as Record<string, unknown>;
  return mapTeacher(row);
}

export function listEnrollments(): Enrollment[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT enrollments.*, students.full_name AS student_name, courses.name AS course_name,
              courses.level AS level, courses.teacher AS teacher, courses.monthly_fee AS monthly_fee
       FROM enrollments
       JOIN students ON students.id = enrollments.student_id
       JOIN courses ON courses.id = enrollments.course_id
       ORDER BY enrollments.start_date DESC`,
    )
    .all() as Record<string, unknown>[];

  return rows.map(mapEnrollment);
}

export function createEnrollment(input: EnrollmentInput): Enrollment {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO enrollments (student_id, course_id, start_date, end_date, payment_status)
       VALUES (@studentId, @courseId, @startDate, @endDate, @paymentStatus)`,
    )
    .run({ ...input, endDate: input.endDate ?? null });

  const row = db
    .prepare(
      `SELECT enrollments.*, students.full_name AS student_name, courses.name AS course_name,
              courses.level AS level, courses.teacher AS teacher, courses.monthly_fee AS monthly_fee
       FROM enrollments
       JOIN students ON students.id = enrollments.student_id
       JOIN courses ON courses.id = enrollments.course_id
       WHERE enrollments.id = ?`,
    )
    .get(result.lastInsertRowid) as Record<string, unknown>;

  return mapEnrollment(row);
}

export function listSessions(): Session[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT sessions.*, courses.name AS course_name, teachers.full_name AS teacher_name,
              COUNT(attendance_records.id) AS attendance_total,
              COALESCE(SUM(CASE WHEN attendance_records.status = 'absent' THEN 1 ELSE 0 END), 0) AS absent_count
       FROM sessions
       JOIN courses ON courses.id = sessions.course_id
       JOIN teachers ON teachers.id = sessions.teacher_id
       LEFT JOIN attendance_records ON attendance_records.session_id = sessions.id
       GROUP BY sessions.id
       ORDER BY sessions.session_date ASC, sessions.start_time ASC`,
    )
    .all() as Record<string, unknown>[];
  return rows.map(mapSession);
}

export function createSession(input: SessionInput): Session {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO sessions (course_id, teacher_id, session_date, start_time, end_time, topic, homework, status)
       VALUES (@courseId, @teacherId, @sessionDate, @startTime, @endTime, @topic, @homework, @status)`,
    )
    .run({ ...input, homework: input.homework ?? "" });

  const row = db
    .prepare(
      `SELECT sessions.*, courses.name AS course_name, teachers.full_name AS teacher_name,
              0 AS attendance_total, 0 AS absent_count
       FROM sessions
       JOIN courses ON courses.id = sessions.course_id
       JOIN teachers ON teachers.id = sessions.teacher_id
       WHERE sessions.id = ?`,
    )
    .get(result.lastInsertRowid) as Record<string, unknown>;

  return mapSession(row);
}

export function listAttendanceRecords(sessionId?: number): AttendanceRecord[] {
  const db = getDb();
  const rows = (sessionId
    ? db
        .prepare(
          `SELECT attendance_records.*, students.full_name AS student_name
           FROM attendance_records
           JOIN students ON students.id = attendance_records.student_id
           WHERE attendance_records.session_id = ?
           ORDER BY students.full_name ASC`,
        )
        .all(sessionId)
    : db
        .prepare(
          `SELECT attendance_records.*, students.full_name AS student_name
           FROM attendance_records
           JOIN students ON students.id = attendance_records.student_id
           ORDER BY attendance_records.session_id DESC, students.full_name ASC`,
        )
        .all()) as Record<string, unknown>[];

  return rows.map(mapAttendance);
}

export function createAttendanceRecord(input: AttendanceInput): AttendanceRecord {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO attendance_records (session_id, student_id, status, note)
       VALUES (@sessionId, @studentId, @status, @note)`,
    )
    .run({ ...input, note: input.note ?? "" });

  const row = db
    .prepare(
      `SELECT attendance_records.*, students.full_name AS student_name
       FROM attendance_records
       JOIN students ON students.id = attendance_records.student_id
       WHERE attendance_records.id = ?`,
    )
    .get(result.lastInsertRowid) as Record<string, unknown>;

  return mapAttendance(row);
}

export function listAssessments(): Assessment[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT assessments.*, courses.name AS course_name,
              COUNT(assessment_scores.id) AS score_count,
              ROUND(AVG(assessment_scores.score), 1) AS average_score
       FROM assessments
       JOIN courses ON courses.id = assessments.course_id
       LEFT JOIN assessment_scores ON assessment_scores.assessment_id = assessments.id
       GROUP BY assessments.id
       ORDER BY assessments.assessment_date DESC, assessments.id DESC`,
    )
    .all() as Record<string, unknown>[];
  return rows.map(mapAssessment);
}

export function createAssessment(input: AssessmentInput): Assessment {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO assessments (course_id, title, assessment_type, assessment_date, max_score, weight)
       VALUES (@courseId, @title, @assessmentType, @assessmentDate, @maxScore, @weight)`,
    )
    .run(input);

  const row = db
    .prepare(
      `SELECT assessments.*, courses.name AS course_name,
              0 AS score_count, NULL AS average_score
       FROM assessments
       JOIN courses ON courses.id = assessments.course_id
       WHERE assessments.id = ?`,
    )
    .get(result.lastInsertRowid) as Record<string, unknown>;

  return mapAssessment(row);
}

export function createAssessmentScore(input: AssessmentScoreInput): AssessmentScore {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO assessment_scores (assessment_id, student_id, score, feedback)
       VALUES (@assessmentId, @studentId, @score, @feedback)`,
    )
    .run({ ...input, feedback: input.feedback ?? "" });

  const row = db
    .prepare(
      `SELECT assessment_scores.*, students.full_name AS student_name
       FROM assessment_scores
       JOIN students ON students.id = assessment_scores.student_id
       WHERE assessment_scores.id = ?`,
    )
    .get(result.lastInsertRowid) as Record<string, unknown>;

  return mapAssessmentScore(row);
}

export function listAssessmentScores(assessmentId?: number): AssessmentScore[] {
  const db = getDb();
  const rows = (assessmentId
    ? db
        .prepare(
          `SELECT assessment_scores.*, students.full_name AS student_name
           FROM assessment_scores
           JOIN students ON students.id = assessment_scores.student_id
           WHERE assessment_scores.assessment_id = ?
           ORDER BY assessment_scores.score DESC, students.full_name ASC`,
        )
        .all(assessmentId)
    : db
        .prepare(
          `SELECT assessment_scores.*, students.full_name AS student_name
           FROM assessment_scores
           JOIN students ON students.id = assessment_scores.student_id
           ORDER BY assessment_scores.assessment_id DESC, assessment_scores.score DESC`,
        )
        .all()) as Record<string, unknown>[];
  return rows.map(mapAssessmentScore);
}

export function listInvoices(): Invoice[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT invoices.*, students.full_name AS student_name, courses.name AS course_name,
              COALESCE(SUM(payments.amount), 0) AS paid_amount
       FROM invoices
       JOIN students ON students.id = invoices.student_id
       LEFT JOIN enrollments ON enrollments.id = invoices.enrollment_id
       LEFT JOIN courses ON courses.id = enrollments.course_id
       LEFT JOIN payments ON payments.invoice_id = invoices.id
       GROUP BY invoices.id
       ORDER BY invoices.due_date ASC, invoices.id DESC`,
    )
    .all() as Record<string, unknown>[];
  return rows.map(mapInvoice);
}

export function createInvoice(input: InvoiceInput): Invoice {
  const db = getDb();
  const invoiceNo = input.invoiceNo?.trim() || nextInvoiceNo();
  const result = db
    .prepare(
      `INSERT INTO invoices (invoice_no, student_id, enrollment_id, issue_date, due_date, amount, discount, status, description)
       VALUES (@invoiceNo, @studentId, @enrollmentId, @issueDate, @dueDate, @amount, @discount, @status, @description)`,
    )
    .run({
      ...input,
      invoiceNo,
      enrollmentId: input.enrollmentId ?? null,
      discount: input.discount ?? 0,
    });

  const invoiceId = Number(result.lastInsertRowid);
  const row = db
    .prepare(
      `SELECT invoices.*, students.full_name AS student_name, courses.name AS course_name, 0 AS paid_amount
       FROM invoices
       JOIN students ON students.id = invoices.student_id
       LEFT JOIN enrollments ON enrollments.id = invoices.enrollment_id
       LEFT JOIN courses ON courses.id = enrollments.course_id
       WHERE invoices.id = ?`,
    )
    .get(invoiceId) as Record<string, unknown>;

  return mapInvoice(row);
}

export function createPayment(input: PaymentInput): Payment {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO payments (invoice_id, payment_date, amount, method, reference_no, note)
       VALUES (@invoiceId, @paymentDate, @amount, @method, @referenceNo, @note)`,
    )
    .run({
      ...input,
      referenceNo: input.referenceNo ?? "",
      note: input.note ?? "",
    });

  refreshInvoiceStatus(input.invoiceId);

  const row = db.prepare("SELECT * FROM payments WHERE id = ?").get(result.lastInsertRowid) as Record<string, unknown>;
  return mapPayment(row);
}

export function listPayments(invoiceId?: number): Payment[] {
  const db = getDb();
  const rows = (invoiceId
    ? db.prepare("SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC, id DESC").all(invoiceId)
    : db.prepare("SELECT * FROM payments ORDER BY payment_date DESC, id DESC").all()) as Record<string, unknown>[];
  return rows.map(mapPayment);
}

export function getDashboardStats(): DashboardStats {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM students) AS totalStudents,
        (SELECT COUNT(*) FROM students WHERE status = 'active') AS activeStudents,
        (SELECT COUNT(*) FROM courses) AS activeCourses,
        COALESCE((SELECT SUM(courses.monthly_fee)
          FROM enrollments
          JOIN courses ON courses.id = enrollments.course_id
          WHERE enrollments.payment_status IN ('paid', 'partial')
        ), 0) AS monthlyRevenue,
        (SELECT COUNT(*) FROM enrollments WHERE payment_status = 'unpaid') AS unpaidEnrollments,
        COALESCE(ROUND(
          (SELECT COUNT(*) * 100.0 FROM enrollments) /
          NULLIF((SELECT SUM(capacity) FROM courses), 0), 1
        ), 0) AS capacityUsage,
        (SELECT COUNT(*) FROM teachers WHERE status = 'active') AS activeTeachers,
        (SELECT COUNT(*) FROM sessions WHERE status = 'scheduled') AS scheduledSessions,
        (SELECT COUNT(*) FROM sessions WHERE status = 'completed') AS completedSessions,
        COALESCE(ROUND((SELECT AVG(CASE attendance_records.status
          WHEN 'present' THEN 100
          WHEN 'late' THEN 75
          WHEN 'excused' THEN 50
          ELSE 0 END)
          FROM attendance_records), 1), 0) AS attendanceRate,
        COALESCE(ROUND((SELECT AVG(score) FROM assessment_scores), 1), 0) AS averageScore,
        (SELECT COUNT(*) FROM invoices WHERE status IN ('issued', 'partially_paid', 'paid', 'overdue')) AS issuedInvoices,
        (SELECT COUNT(*) FROM invoices WHERE status = 'overdue') AS overdueInvoices,
        COALESCE((SELECT SUM(invoices.amount - invoices.discount - COALESCE(paid.total_paid, 0))
          FROM invoices
          LEFT JOIN (
            SELECT invoice_id, SUM(amount) AS total_paid
            FROM payments
            GROUP BY invoice_id
          ) paid ON paid.invoice_id = invoices.id
          WHERE invoices.status NOT IN ('paid', 'void')
        ), 0) AS outstandingTuition,
        COALESCE((SELECT SUM(amount) FROM payments), 0) AS collectedTuition`,
    )
    .get() as DashboardStats;

  return {
    totalStudents: Number(row.totalStudents),
    activeStudents: Number(row.activeStudents),
    activeCourses: Number(row.activeCourses),
    monthlyRevenue: Number(row.monthlyRevenue),
    unpaidEnrollments: Number(row.unpaidEnrollments),
    capacityUsage: Number(row.capacityUsage),
    activeTeachers: Number(row.activeTeachers),
    scheduledSessions: Number(row.scheduledSessions),
    completedSessions: Number(row.completedSessions),
    attendanceRate: Number(row.attendanceRate),
    averageScore: Number(row.averageScore),
    issuedInvoices: Number(row.issuedInvoices),
    overdueInvoices: Number(row.overdueInvoices),
    outstandingTuition: Number(row.outstandingTuition),
    collectedTuition: Number(row.collectedTuition),
  };
}

export function getOperationalSummary(): OperationalSummary {
  const db = getDb();

  const upcomingSessions = db
    .prepare(
      `SELECT sessions.*, courses.name AS course_name, teachers.full_name AS teacher_name,
              COUNT(attendance_records.id) AS attendance_total,
              COALESCE(SUM(CASE WHEN attendance_records.status = 'absent' THEN 1 ELSE 0 END), 0) AS absent_count
       FROM sessions
       JOIN courses ON courses.id = sessions.course_id
       JOIN teachers ON teachers.id = sessions.teacher_id
       LEFT JOIN attendance_records ON attendance_records.session_id = sessions.id
       WHERE sessions.status = 'scheduled'
       GROUP BY sessions.id
       ORDER BY sessions.session_date ASC, sessions.start_time ASC
       LIMIT 5`,
    )
    .all() as Record<string, unknown>[];

  const recentAssessments = db
    .prepare(
      `SELECT assessments.*, courses.name AS course_name,
              COUNT(assessment_scores.id) AS score_count,
              ROUND(AVG(assessment_scores.score), 1) AS average_score
       FROM assessments
       JOIN courses ON courses.id = assessments.course_id
       LEFT JOIN assessment_scores ON assessment_scores.assessment_id = assessments.id
       GROUP BY assessments.id
       ORDER BY assessments.assessment_date DESC, assessments.id DESC
       LIMIT 5`,
    )
    .all() as Record<string, unknown>[];

  const openInvoices = db
    .prepare(
      `SELECT invoices.*, students.full_name AS student_name, courses.name AS course_name,
              COALESCE(SUM(payments.amount), 0) AS paid_amount
       FROM invoices
       JOIN students ON students.id = invoices.student_id
       LEFT JOIN enrollments ON enrollments.id = invoices.enrollment_id
       LEFT JOIN courses ON courses.id = enrollments.course_id
       LEFT JOIN payments ON payments.invoice_id = invoices.id
       WHERE invoices.status IN ('issued', 'partially_paid', 'overdue')
       GROUP BY invoices.id
       ORDER BY invoices.due_date ASC, invoices.id DESC
       LIMIT 5`,
    )
    .all() as Record<string, unknown>[];

  const studentCareList = db
    .prepare(
      `SELECT * FROM (
          SELECT students.id AS student_id, students.full_name AS student_name,
                 'Theo dõi học phí quá hạn' AS reason,
                 'high' AS severity,
                 1 AS priority,
                 invoices.due_date AS sort_key
          FROM invoices
          JOIN students ON students.id = invoices.student_id
          WHERE invoices.status = 'overdue'

          UNION ALL

          SELECT students.id AS student_id, students.full_name AS student_name,
                 'Điểm đánh giá dưới ngưỡng' AS reason,
                 'high' AS severity,
                 2 AS priority,
                 assessments.assessment_date AS sort_key
          FROM assessment_scores
          JOIN students ON students.id = assessment_scores.student_id
          JOIN assessments ON assessments.id = assessment_scores.assessment_id
          WHERE assessment_scores.score < 7

          UNION ALL

          SELECT students.id AS student_id, students.full_name AS student_name,
                 'Vắng học / cần liên hệ phụ huynh' AS reason,
                 'medium' AS severity,
                 3 AS priority,
                 sessions.session_date AS sort_key
          FROM attendance_records
          JOIN students ON students.id = attendance_records.student_id
          JOIN sessions ON sessions.id = attendance_records.session_id
          WHERE attendance_records.status = 'absent'
        )
       GROUP BY student_id, reason
       ORDER BY priority ASC, sort_key ASC
       LIMIT 6`,
    )
    .all() as Record<string, unknown>[];

  return {
    upcomingSessions: upcomingSessions.map(mapSession),
    recentAssessments: recentAssessments.map(mapAssessment),
    openInvoices: openInvoices.map(mapInvoice),
    studentCareList: studentCareList.map(mapStudentCareItem),
  };
}

export function resetDatabaseForTests() {
  if (process.env.NODE_ENV != "test") {
    throw new Error("resetDatabaseForTests chỉ được dùng trong môi trường test");
  }

  const db = getDb();
  db.exec(`
    DELETE FROM payments;
    DELETE FROM invoices;
    DELETE FROM assessment_scores;
    DELETE FROM assessments;
    DELETE FROM attendance_records;
    DELETE FROM sessions;
    DELETE FROM enrollments;
    DELETE FROM teachers;
    DELETE FROM students;
    DELETE FROM courses;
    DELETE FROM sqlite_sequence;
  `);
  seed(db);
}
