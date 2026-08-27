import { motion, useReducedMotion } from "motion/react";
import { fadeInItem, hoverLift } from "./SectionWrapper";
import type { CertItem } from "../../data/content";

interface CertCardProps {
  cert: CertItem;
  index: number;
}

export default function CertCard({ cert, index }: CertCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.article
      {...fadeInItem(index)}
      whileHover={prefersReduced ? undefined : hoverLift}
      className="relative flex cursor-pointer flex-col rounded-lg border border-border bg-surface p-5 transition-[border-color,opacity] duration-300 hover:z-10 hover:border-accent/40 group-hover/grid:!opacity-40 hover:!opacity-100"
    >
      <h3 className="font-heading text-base font-semibold text-primary">
        {cert.title}
      </h3>
      <p className="mt-1 font-body text-sm text-muted">
        {cert.issuer}
      </p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="font-body text-xs font-medium text-muted">
          {cert.year}
        </span>
        {cert.pdfUrl && (
          <a
            href={cert.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs font-medium text-accent no-underline transition-colors duration-200 hover:underline"
            aria-label={`Download PDF: ${cert.title}`}
          >
            PDF &darr;
          </a>
        )}
      </div>
    </motion.article>
  );
}
