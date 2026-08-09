import clsx from 'clsx'

// The app's signature element: a training-log tally count, the way an
// athlete marks off days on a chalkboard. `days` is an array of booleans,
// oldest first (true = logged that day). Rendered in groups of 5 — four
// verticals plus a diagonal strike, same as a real tally count.
export default function StreakTicks({ days = [], label }) {
  const groups = []
  for (let i = 0; i < days.length; i += 5) groups.push(days.slice(i, i + 5))
  const streakCount = days.filter(Boolean).length

  return (
    <div className="flex items-end gap-4">
      <div className="flex gap-3">
        {groups.map((group, gi) => (
          <svg key={gi} width={group.length === 5 ? 30 : group.length * 6} height="28" className="shrink-0">
            {group.map((filled, i) => (
              <line
                key={i}
                x1={4 + i * 6}
                y1="2"
                x2={4 + i * 6}
                y2="26"
                strokeWidth="2"
                className={clsx(filled ? 'stroke-ember' : 'stroke-line')}
              />
            ))}
            {group.length === 5 && (
              <line
                x1="2"
                y1="26"
                x2="26"
                y2="2"
                strokeWidth="2"
                className={clsx(group.every(Boolean) ? 'stroke-ember' : 'stroke-line')}
              />
            )}
          </svg>
        ))}
      </div>
      <div>
        <p className="font-display text-3xl leading-none">{streakCount}</p>
        {label && <p className="label-eyebrow">{label}</p>}
      </div>
    </div>
  )
}
