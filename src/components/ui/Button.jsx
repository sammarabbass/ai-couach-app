import clsx from 'clsx'

const variants = {
  primary: 'bg-ink text-bg hover:bg-turf-700',
  accent: 'bg-ember text-white hover:bg-ember-700',
  ghost: 'bg-transparent text-ink border border-line hover:border-ink',
  danger: 'bg-transparent text-ember-700 border border-ember/40 hover:bg-ember-50',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  className,
  loading,
  children,
  disabled,
  ...props
}) {
  return (
    <Comp
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5',
        'font-medium text-sm tracking-tightish transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Comp>
  )
}
