import React from 'react';

export default function IconDisplay({ icon }: { icon: React.ReactNode }) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
      style={{
        backgroundColor: 'var(--color-badge-bg)',
        color: 'var(--color-accent)',
      }}
    >
      {icon}
    </span>
  );
}
