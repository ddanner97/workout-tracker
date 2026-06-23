interface RoundedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  color: string;
}
export default function RoundedButton({
  children,
  onClick,
  disabled,
  ariaLabel,
  color,
}: RoundedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-full text-[18px] font-bold disabled:opacity-30"
      aria-label={ariaLabel}
      style={{
        color: color,
        backgroundColor: 'var(--color-surface-alt)',
      }}
    >
      {children}
    </button>
  );
}
