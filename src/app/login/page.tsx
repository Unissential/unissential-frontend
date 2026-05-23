import { AuthLayout } from '@/components/features/auth';
import { LoginForm } from '@/components/features/auth/LoginForm';

export const metadata = {
  title: 'Sign In - Unissential',
  description: 'Sign in to your Unissential account to access premium student housing.',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
