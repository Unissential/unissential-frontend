import { AuthLayout } from '@/components/features/auth';
import { SignupForm } from '@/components/features/auth/SignupForm';

export const metadata = {
  title: 'Sign Up - Unissential',
  description: 'Create your Unissential account and start finding your perfect student housing.',
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
