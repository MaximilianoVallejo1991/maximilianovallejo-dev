import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeInItem, hoverLift } from "./SectionWrapper";
import type { CertItem } from "../../data/content";

interface CertCardProps {
  cert: CertItem;
  index: number;
  onOpen: (cert: CertItem) => void;
}

export default function CertCard({ cert, index, onOpen }: CertCardProps) {
  const [imgError, setImgError] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <motion.article
      {...fadeInItem(index)}
      whileHover={prefersReduced ? undefined : hoverLift}
      onClick={() => onOpen(cert)}
      className="group relative cursor-pointer rounded-xl border border-border bg-surface transition-[border-color,opacity,border-radius,box-shadow] duration-300 hover:z-10 hover:rounded-b-none hover:border-accent/40 hover:shadow-xl group-hover/grid:!opacity-40 hover:!opacity-100"
    >
      {/* Thumbnail / fallback */}
      <div className="relative z-20 aspect-video w-full overflow-hidden rounded-t-xl bg-border/30">
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-border/20 font-heading text-sm font-medium text-muted">
            {cert.title}
          </div>
        ) : (
          <img
            src={cert.thumbnailUrl}
            alt={cert.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* rounded-b-xl at rest matches the article's own rounded-xl bottom
          corners — the article has no overflow-hidden (it can't, the
          reveal below needs to escape its box), so without a matching
          radius here this flat-cornered bg-surface rectangle would paint
          straight over the article's rounded corner and square it off.
          It un-rounds together with the article on hover so the card and
          the reveal panel below read as one seamless shape, not a rounded
          box suddenly growing square corners mid-transition. */}
      <div className="relative z-20 rounded-b-xl bg-surface p-5 transition-[border-radius] duration-300 group-hover:rounded-b-none">
        <h3 className="font-heading text-base font-semibold text-primary">
          {cert.title}
        </h3>
        {cert.issuer && (
          <p className="mt-1 font-body text-sm text-muted">{cert.issuer}</p>
        )}
      </div>

      {/* Reveal — positioned absolute so it overlays on hover instead of
          growing the card's box height. Growing in-flow would grow the
          grid row and push whatever comes after the grid down the page;
          taking it out of flow keeps surrounding layout perfectly still.
          Width is deliberately 100%+2px (-left-px/-right-px) instead of
          a plain inset-x-0: a `position: absolute` box and the article's
          own normal-flow border resolve their fractional grid width
          through different rounding paths in Chromium, so even an
          identical CSS width can land the two borders 1 physical pixel
          apart — visible as a narrower reveal panel. Overshooting by a
          hair guarantees the reveal is never narrower than the card
          above it, whichever way that rounding goes.
          Sits at a lower z-index than the image/title above, and starts
          translated up underneath them — so as it slides down into view
          it reads as sliding out from behind the image, not just fading
          in below the title. Border color/width match the card's own
          border exactly (same accent tint on hover) so the outline reads
          as one continuous edge instead of two stacked pieces. */}
      <div className="pointer-events-none absolute -left-px top-full z-10 w-[calc(100%+2px)] -translate-y-28 rounded-b-xl border-x border-b border-border bg-surface p-5 pt-3 opacity-0 transition-[opacity,transform,border-color] duration-300 ease-out motion-reduce:transition-none group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:border-accent/40 group-hover:opacity-100">
        <p className="font-body text-sm leading-relaxed text-muted">
          {cert.description}
        </p>

        <div className="mt-4 flex items-center justify-between font-body text-sm">
          <span className="text-xs font-medium text-muted">{cert.year}</span>
          {cert.pdfUrl && (
            <a
              href={cert.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-accent no-underline transition-colors duration-200 hover:underline"
              aria-label={`Download PDF: ${cert.title}`}
            >
              PDF &darr;
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
