export default function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`spinner text-sky-600 ${className}`}
      height="2em"
      width="2em"
    >
      <circle className="path" r="10" cx="12" cy="12" strokeWidth={4} />
    </svg>
  )
}
