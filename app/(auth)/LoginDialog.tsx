'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/src/lib/auth-client';

import { Dialog } from '@mui/material';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import { TextField } from '../components/component-library';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginDialog({
  open,
  onClose,
  onSwitchToRegister,
}: LoginDialogProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      // better-auth re-sends the verification email automatically when an
      // unverified user attempts to log in, so we just send them to the
      // "check your email" screen.
      if (error.code === 'EMAIL_NOT_VERIFIED' || error.status === 403) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(error.message ?? 'Sign in failed');
      setLoading(false);
    } else {
      router.push('/');
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          backgroundColor: 'var(--color-background)',
          backgroundImage: 'none',
          m: 2,
        },
      }}
    >
      <div className="flex flex-col gap-6 p-6">
        {/* back button */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
          }}
          aria-label="Go back"
        >
          <ArrowBackOutlined sx={{ fontSize: 18 }} />
        </button>

        {/* heading */}
        <div className="flex flex-col gap-1">
          <h2
            className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.5px]"
            style={{ color: 'var(--color-heading)' }}
          >
            Welcome back
            <span style={{ color: 'var(--color-accent)' }}>.</span>
          </h2>
          <p className="text-[14px]" style={{ color: 'var(--color-muted)' }}>
            Log in to continue tracking your workouts.
          </p>
        </div>

        {/* fields */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Email"
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <TextField
            label="Password"
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* error */}
        {error && (
          <p className="text-[13px]" style={{ color: 'var(--color-error, #e53e3e)' }}>
            {error}
          </p>
        )}

        {/* submit */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-2xl py-4 text-[15px] font-bold tracking-[0.3px] text-white disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          {loading ? 'Signing in...' : 'Log in'}
        </button>

        {/* switch to register */}
        <p
          className="text-center text-[13px]"
          style={{ color: 'var(--color-muted)' }}
        >
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold"
            style={{ color: 'var(--color-accent)' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </Dialog>
  );
}
