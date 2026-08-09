export default function EmptyState({ title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border border-dashed border-line rounded-sm">
      <p className="font-display text-2xl">{title}</p>
      {hint && <p className="text-sm text-muted max-w-sm">{hint}</p>}
      {action}
    </div>
  )
}
