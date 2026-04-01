// app/(admin)/layout.js
import AdminShell from '@/components/admin/AdminShell';
export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your SCANOVA store and AR experiences with ease.',
};

export default function MainRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>;
      </body>
    </html>
  );
}