import React from 'react';
import IconDisplay from './IconDisplay';

type AuthOptionButtonProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  className?: string;
};

const AuthOptionButton = ({
  icon,
  title,
  subtitle,
  onClick,
  className,
}: AuthOptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <IconDisplay icon={icon} />
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[17px] font-semibold tracking-[-0.2px]"
          style={{ color: 'var(--color-heading)' }}
        >
          {title}
        </span>
        <span className="text-[13px]" style={{ color: 'var(--color-muted)' }}>
          {subtitle}
        </span>
      </div>
    </button>
  );
};

export default AuthOptionButton;
