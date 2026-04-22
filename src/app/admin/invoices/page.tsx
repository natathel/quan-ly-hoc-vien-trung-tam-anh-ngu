import { AdminInvoicesPage } from "@/components/admin/admin-invoices-page";
import { listInvoices, listPayments } from "@/lib/database";

export default function InvoicesAdminPage() {
  const invoices = listInvoices();
  const payments = listPayments();

  return <AdminInvoicesPage invoices={invoices} payments={payments} />;
}
