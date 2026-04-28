'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { Box } from '@mui/material';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import {
  AuthOptionButton,
  Container,
} from '../../components/component-library';
import LoginDialog from '../LoginDialog';
import RegisterDialog from '../RegisterDialog';

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  return (
    <Box>
      <div className="relative">
        <Image
          src="/landing-page-mobile.png"
          alt="Workout App Hero"
          width={600}
          height={600}
          className="w-full"
        />

        {/* header overlay — top left */}
        <div className="absolute top-0 left-0 p-6">
          <h1
            className="font-serif text-[22px] leading-none font-semibold tracking-[-0.5px]"
            style={{ color: 'var(--color-heading)' }}
          >
            Workout.
          </h1>
        </div>

        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[var(--color-background)] to-transparent" />

        {/* buttons pinned to bottom */}
        <Container
          column
          gap={12}
          className="absolute inset-x-0 bottom-[-100px] items-center px-6 pb-8"
        >
          <AuthOptionButton
            icon={<LoginOutlined />}
            title="Log in"
            subtitle="Welcome back"
            onClick={() => router.push('?view=login')}
          />
          <AuthOptionButton
            icon={<PersonAddOutlined />}
            title="Create account"
            subtitle="Start your journey"
            onClick={() => router.push('?view=register')}
          />
        </Container>
      </div>

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
