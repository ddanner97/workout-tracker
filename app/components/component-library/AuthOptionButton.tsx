import React from 'react';

type AuthOptionButtonProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
};

const AuthOptionButton = ({
  icon,
  title,
  subtitle,
  onClick,
}: AuthOptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: 'var(--color-badge-bg)',
          color: 'var(--color-accent)',
        }}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[17px] font-semibold tracking-[-0.2px]"
          style={{ color: 'var(--color-heading)' }}
        >
          {title}
        </span>
        <span
          className="text-[13px]"
          style={{ color: 'var(--color-muted)' }}
        >
          {subtitle}
        </span>
      </div>
    </button>
  );
};

export default AuthOptionButton;
