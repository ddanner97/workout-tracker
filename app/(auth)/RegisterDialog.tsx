'use client';
import { useState } from 'react';
import { authClient } from '@/src/lib/auth-client';

import { Dialog } from '@mui/material';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import { TextField } from '../components/component-library';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterDialog({
  open,
  onClose,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: '/',
    });
    if (error) {
      setError(error.message ?? 'Sign up failed');
      setLoading(false);
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
            Create account
            <span style={{ color: 'var(--color-accent)' }}>.</span>
          </h2>
          <p className="text-[14px]" style={{ color: 'var(--color-muted)' }}>
            Start your fitness journey and build better habits.
          </p>
        </div>

        {/* fields */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Full name"
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
          <TextField
            label="Email"
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <TextField
            label="Password"
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
          <TextField
            label="Confirm password"
            id="reg-confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm your password"
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
          onClick={handleRegister}
          disabled={loading}
          className="w-full rounded-2xl py-4 text-[15px] font-bold tracking-[0.3px] text-white disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        {/* switch to login */}
        <p
          className="text-center text-[13px]"
          style={{ color: 'var(--color-muted)' }}
        >
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold"
            style={{ color: 'var(--color-accent)' }}
          >
            Log in
          </button>
        </p>
      </div>
    </Dialog>
  );
}
