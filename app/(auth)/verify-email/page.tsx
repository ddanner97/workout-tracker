'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/src/lib/auth-client';

import { Box } from '@mui/material';
import MarkEmailUnreadOutlined from '@mui/icons-material/MarkEmailUnreadOutlined';

type Status = 'idle' | 'sending' | 'sent' | 'error';

function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleResend() {
    if (!email) {
      setStatus('error');
      setErrorMessage('No email address on file. Please register again.');
      return;
    }
    setStatus('sending');
    setErrorMessage('');
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/',
    });
    if (error) {
      setStatus('error');
      setErrorMessage(error.message ?? 'Failed to resend verification email.');
    } else {
      setStatus('sent');
    }
  }

  return (
    <Box className="flex min-h-screen items-center justify-center px-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div
          className="flex h-14 w-14 items-center justify-center self-start rounded-2xl"
          style={{
            backgroundColor: 'var(--color-badge-bg)',
            color: 'var(--color-accent)',
          }}
        >
          <MarkEmailUnreadOutlined />
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.5px]"
            style={{ color: 'var(--color-heading)' }}
          >
            Check your email
            <span style={{ color: 'var(--color-accent)' }}>.</span>
          </h1>
          <p className="text-[14px]" style={{ color: 'var(--color-muted)' }}>
            We sent a verification link to{' '}
            <span style={{ color: 'var(--color-heading)' }}>
              {email || 'your email'}
            </span>
            . Click it to finish setting up your account.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={status === 'sending' || !email}
          className="w-full rounded-2xl py-4 text-[15px] font-bold tracking-[0.3px] text-white disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          {status === 'sending'
            ? 'Sending...'
            : status === 'sent'
              ? 'Sent — check your inbox'
              : 'Resend verification email'}
        </button>

        {status === 'error' && (
          <p
            className="text-[13px]"
            style={{ color: 'var(--color-error, #e53e3e)' }}
          >
            {errorMessage}
          </p>
        )}

        <p
          className="text-center text-[13px]"
          style={{ color: 'var(--color-muted)' }}
        >
          Already verified?{' '}
          <button
            type="button"
            onClick={() => router.push('/login?view=login')}
            className="font-semibold"
            style={{ color: 'var(--color-accent)' }}
          >
            Log in
          </button>
        </p>
      </div>
    </Box>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
