import clsx from 'clsx'

export default function Input({ label, error, className, id, ...props }) {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-ink',
          'placeholder:text-muted focus-visible:border-turf',
          error && 'border-ember-600',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-ember-700">{error}</p>}
    </div>
  )
}
