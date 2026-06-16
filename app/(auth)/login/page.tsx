'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Box } from '@mui/material';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import {
  AuthOptionButton,
  Container,
} from '../../components/component-library';
import LoginContent from '../LoginContent';
import LoginDialog from '../LoginDialog';
import RegisterDialog from '../RegisterDialog';

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  return (
    <Box className="h-screen">
      <div>
        <h1
          className="font-serif text-[22px] leading-none font-semibold tracking-[-0.5px]"
          style={{ color: 'var(--color-heading)' }}
        >
          Workout.
        </h1>
      </div>

      <Container column gap={18} className="m-10 h-full md:m-18 lg:m-24">
        <LoginContent />

        <Container column gap={12} className="grow flex-col justify-center">
          <AuthOptionButton
            icon={<LoginOutlined />}
            title="Log in"
            subtitle="Welcome back"
            onClick={() => router.push('?view=login')}
            className="w-[100%] max-w-[400px] lg:max-w-[500px]"
          />
          <AuthOptionButton
            icon={<PersonAddOutlined />}
            title="Create account"
            subtitle="Start your journey"
            onClick={() => router.push('?view=register')}
            className="w-[100%] max-w-[400px] lg:max-w-[500px]"
          />
        </Container>

        <LoginDialog
          open={view === 'login'}
          onClose={() => router.back()}
          onSwitchToRegister={() => router.push('?view=register')}
        />

        <RegisterDialog
          open={view === 'register'}
          onClose={() => router.back()}
          onSwitchToLogin={() => router.push('?view=login')}
        />
      </Container>
    </Box>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
