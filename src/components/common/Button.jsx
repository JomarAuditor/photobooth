/**
 * Tactile Neo-Pop button with hard border shadow system.
 * Variants: primary | secondary | ghost | danger
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-xs font-label-md text-label-md border-2 border-on-background transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none'

  const variants = {
    primary:
      'bg-primary-container text-on-primary-container neo-pop-shadow active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:shadow-[6px_6px_0px_0px_#1b1c1c] hover:-translate-x-[1px] hover:-translate-y-[1px]',
    secondary:
      'bg-surface text-on-surface neo-pop-shadow active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-surface-container-high hover:shadow-[6px_6px_0px_0px_#1b1c1c] hover:-translate-x-[1px] hover:-translate-y-[1px]',
    ghost:
      'bg-transparent text-on-surface border-transparent hover:bg-surface-container-high hover:border-on-background',
    danger:
      'bg-error text-on-error neo-pop-shadow active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    accent:
      'bg-secondary-fixed text-on-secondary-fixed neo-pop-shadow active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:shadow-[6px_6px_0px_0px_#1b1c1c]',
  }

  const sizes = {
    sm: 'px-sm py-xs text-[13px]',
    md: 'px-md py-sm',
    lg: 'px-lg py-sm text-body-md',
    xl: 'px-xl py-md text-body-lg',
    icon: 'p-xs min-w-[48px] min-h-[48px]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  )
}
