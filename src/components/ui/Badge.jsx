import clsx from 'clsx'

const tones = {
  neutral: 'bg-line/50 text-ink',
  turf: 'bg-turf-50 text-turf-700',
  amber: 'bg-amber-50 text-amber',
  ember: 'bg-ember-50 text-ember-700',
}

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono uppercase tracking-wide',
        tones[tone]
      )}
    >
      {children}
    </span>
  )
}
