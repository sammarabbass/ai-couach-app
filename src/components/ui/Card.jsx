import clsx from 'clsx'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx('bg-surface border border-line rounded-sm p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardEyebrow({ children }) {
  return <p className="label-eyebrow mb-1">{children}</p>
}
