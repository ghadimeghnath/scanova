
// src/app/(admin)/admin/layout.js
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "SCANOVA Admin" };

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}