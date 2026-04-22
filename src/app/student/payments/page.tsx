import { StudentPaymentsPage } from "@/components/student/student-payments-page";
import { listEnrollments, listInvoices, listPayments, listStudents } from "@/lib/database";

export default function StudentPaymentsRoute() {
  return (
    <StudentPaymentsPage
      students={listStudents()}
      enrollments={listEnrollments()}
      invoices={listInvoices()}
      payments={listPayments()}
    />
  );
}
