import { useContent } from "../../hooks/useContent";

export default function SkipLink() {
  const content = useContent();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:no-underline focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      {content.skipLink}
    </a>
  );
}
