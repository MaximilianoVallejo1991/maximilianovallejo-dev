export default function ConvergenceGraphic() {
  return (
    <svg
      viewBox="0 0 900 180"
      aria-hidden="true"
      focusable="false"
      className="hidden md:block w-full h-auto"
      fill="none"
    >
      {/* Branch endpoints */}
      <circle cx="150" cy="16" r="7" className="fill-branch-soft" />
      <circle cx="450" cy="16" r="7" className="fill-branch-trade" />
      <circle cx="750" cy="16" r="7" className="fill-branch-study" />

      {/* Connector paths */}
      <path
        d="M150 16 C150 90 450 80 447 131"
        className="stroke-branch-soft"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M450 16 V131"
        className="stroke-branch-trade"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M750 16 C750 90 450 80 453 131"
        className="stroke-branch-study"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Terminal */}
      <circle cx="450" cy="150" r="18" className="fill-surface stroke-accent" />
      <circle cx="450" cy="150" r="8" className="fill-accent" />
    </svg>
  );
}
