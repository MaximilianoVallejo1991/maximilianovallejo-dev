import { useContent } from "../../hooks/useContent";

export default function Footer() {
  const content = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm text-muted md:flex-row md:justify-between">
        <p>
          &copy; {year} {content.meta.author}
        </p>
        <p>
          Construido con React, TypeScript, Tailwind CSS &mdash;{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline underline-offset-2 transition-colors duration-200 hover:text-accent"
          >
            Vercel
          </a>
        </p>
        <a
          href="#hero"
          className="text-muted underline underline-offset-2 transition-colors duration-200 hover:text-accent"
        >
          &uarr; Volver arriba
        </a>
      </div>
    </footer>
  );
}
