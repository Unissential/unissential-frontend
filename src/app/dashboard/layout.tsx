import { DashboardLayout } from '@/components/dashboard';

export const metadata = {
  title: 'Dashboard - Unissential',
  description: 'Manage your student living experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
