export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`}>
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
    </div>
  )
}
