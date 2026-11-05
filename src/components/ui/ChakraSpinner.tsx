import { cn } from "@/lib/utils";

export function ChakraSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin-slow opacity-10", className)}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      {Array.from({ length: 24 }).map((_, i) => (
        <path
          key={i}
          d="M50 50 L 50 5"
          stroke="currentColor"
          strokeWidth="1.5"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={`dot-${i}`}
          cx="50"
          cy="7"
          r="1.5"
          fill="currentColor"
          transform={`rotate(${i * 15 + 7.5} 50 50)`}
        />
      ))}
    </svg>
  );
}
