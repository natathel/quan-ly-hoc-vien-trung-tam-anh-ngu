import * as fs from "node:fs";
import * as path from "node:path";
import Database from "better-sqlite3";
import type {
  Course,
  CourseInput,
  DashboardStats,
  Enrollment,
  EnrollmentInput,
  Student,
  StudentInput,
} from "./types";

const databasePath = process.env.SQLITE_PATH ?? path.join(process.cwd(), "data", "english-center.db");

let dbInstance: Database.Database | null = null;

function getDb() {
  if (!dbInstance) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    dbInstance = new Database(databasePath);
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
    migrate(dbInstance);
    seed(dbInstance);
  }

  return dbInstance;
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

    CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
    CREATE INDEX IF NOT EXISTS idx_students_level ON students(level);
    CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
  `);
}

function seed(db: Database.Database) {
  const studentCount = db.prepare("SELECT COUNT(*) AS count FROM students").get() as { count: number };
  if (studentCount.count > 0) return;

  const insertStudent = db.prepare(`
    INSERT INTO students (full_name, phone, email, date_of_birth, level, status, enrollment_date, notes)
    VALUES (@fullName, @phone, @email, @dateOfBirth, @level, @status, @enrollmentDate, @notes)
  `);

  const insertCourse = db.prepare(`
    INSERT INTO courses (name, level, teacher, schedule, monthly_fee, capacity)
    VALUES (@name, @level, @teacher, @schedule, @monthlyFee, @capacity)
  `);

  const insertEnrollment = db.prepare(`
    INSERT INTO enrollments (student_id, course_id, start_date, payment_status)
    VALUES (@studentId, @courseId, @startDate, @paymentStatus)
  `);

  const transaction = db.transaction(() => {
    const students = [
      {
        fullName: "Nguyễn Minh Anh",
        phone: "0901234567",
        email: "minhanh@example.com",
        dateOfBirth: "2011-05-12",
        level: "A2",
        status: "active",
        enrollmentDate: "2026-01-05",
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
        notes: "Tạm nghỉ 2 tuần vì lịch thi ở trường.",
      },
    ];

    const studentIds = students.map((student) => Number(insertStudent.run(student).lastInsertRowid));

    const courses = [
      {
        name: "Starter Kids A1",
        level: "A1",
        teacher: "Ms. Linh",
        schedule: "Thứ 2-4, 18:00-19:30",
        monthlyFee: 1600000,
        capacity: 12,
      },
      {
        name: "Communication A2",
        level: "A2",
        teacher: "Mr. David",
        schedule: "Thứ 3-5, 19:00-20:30",
        monthlyFee: 1800000,
        capacity: 10,
      },
      {
        name: "IELTS Foundation B1",
        level: "B1",
        teacher: "Ms. Trang",
        schedule: "Thứ 7-CN, 09:00-11:00",
        monthlyFee: 2400000,
        capacity: 14,
      },
    ];

    const courseIds = courses.map((course) => Number(insertCourse.run(course).lastInsertRowid));

    insertEnrollment.run({ studentId: studentIds[0], courseId: courseIds[1], startDate: "2026-01-05", paymentStatus: "paid" });
    insertEnrollment.run({ studentId: studentIds[1], courseId: courseIds[0], startDate: "2026-02-10", paymentStatus: "partial" });
    insertEnrollment.run({ studentId: studentIds[2], courseId: courseIds[2], startDate: "2025-11-15", paymentStatus: "unpaid" });
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
    monthlyFee: row.monthly_fee ? Number(row.monthly_fee) : undefined,
  };
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
       ORDER BY status = 'active' DESC, updated_at DESC, full_name ASC`,
    )
    .all({ query: normalizedQuery }) as Record<string, unknown>[];

  return rows.map(mapStudent);
}

export function createStudent(input: StudentInput): Student {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO students (full_name, phone, email, date_of_birth, level, status, enrollment_date, notes)
       VALUES (@fullName, @phone, @email, @dateOfBirth, @level, @status, @enrollmentDate, @notes)`,
    )
    .run(input);

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
        ), 0) AS capacityUsage`,
    )
    .get() as DashboardStats;

  return {
    totalStudents: Number(row.totalStudents),
    activeStudents: Number(row.activeStudents),
    activeCourses: Number(row.activeCourses),
    monthlyRevenue: Number(row.monthlyRevenue),
    unpaidEnrollments: Number(row.unpaidEnrollments),
    capacityUsage: Number(row.capacityUsage),
  };
}

export function resetDatabaseForTests() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("resetDatabaseForTests chỉ được dùng trong môi trường test");
  }

  const db = getDb();
  db.exec("DELETE FROM enrollments; DELETE FROM students; DELETE FROM courses;");
  seed(db);
}
