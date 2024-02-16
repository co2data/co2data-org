export default function Spinner({
  className,
  strokeWidth = 4,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`spinner text-sky-600 ${className}`}
      height="2em"
      width="2em"
    >
      <title>Spinner indicating a loading state</title>
      <circle
        className="path"
        r="10"
        cx="12"
        cy="12"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}
