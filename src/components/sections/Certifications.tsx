import { useState, useMemo } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import CertCard from "../ui/CertCard";
import CertLightbox from "../ui/CertLightbox";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";
import type { CertFilter, CertItem } from "../../data/content";

const FILTERS: { key: CertFilter; label: { es: string; en: string } }[] = [
  { key: "all", label: { es: "Todas", en: "All" } },
  { key: "formal", label: { es: "Formal", en: "Formal" } },
  { key: "tecnica", label: { es: "Técnica", en: "Technical" } },
  { key: "extracurricular", label: { es: "Extracurricular", en: "Extracurricular" } },
];

// Two full rows on desktop (lg:grid-cols-3) before the fade + "show more"
// kicks in. Below this, every cert already fits without needing to collapse
// anything, so the fade/button never render for small categories.
const VISIBLE_CAP = 6;

export default function Certifications() {
  const content = useContent();
  const { certifications } = content;
  const [filter, setFilter] = useState<CertFilter>("tecnica");
  const [openCert, setOpenCert] = useState<CertItem | null>(null);
  const [expanded, setExpanded] = useState(false);
  const availableKeys = useMemo(
    () => new Set(certifications.filter((c) => c.items.length > 0).map((c) => c.categoryKey)),
    [certifications],
  );

  const visibleFilters = FILTERS.filter(
    (f) => f.key === "all" || availableKeys.has(f.key),
  );

  const certs = useMemo(() => {
    const all = certifications.flatMap((cat) =>
      cat.items.map((item) => ({ ...item, categoryKey: cat.categoryKey })),
    );
    if (filter === "all") return all;
    return all.filter((c) => c.categoryKey === filter);
  }, [certifications, filter]);

  const isCappable = certs.length > VISIBLE_CAP;
  const visibleCerts = isCappable && !expanded ? certs.slice(0, VISIBLE_CAP) : certs;

  const handleFilter = (key: CertFilter) => {
    setFilter((prev) => (prev === key ? "all" : key));
    // Switching category starts collapsed again — showing 19 formal certs
    // because the user had expanded "all" earlier would defeat the point.
    setExpanded(false);
  };

  // Detect language from content (use navLinks as proxy since meta doesn't have lang)
  const isEn = content.hero.greeting === "Hi, I'm";

  return (
    <SectionWrapper id="certifications" className="min-h-screen mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#certifications")?.label}
      </motion.h2>

      {/* Tabs */}
      <motion.div
        {...fadeInItem(1)}
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label={isEn ? "Certification categories" : "Categorías de certificaciones"}
      >
        {visibleFilters.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => handleFilter(f.key)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 font-body text-sm font-medium transition-colors duration-200 ${
              filter === f.key
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-accent/40 hover:text-primary"
            }`}
          >
            {isEn ? f.label.en : f.label.es}
          </button>
        ))}
      </motion.div>

      {/* Grid — relative wrapper so the fade overlay below can sit on top
          of the (collapsed) last row instead of pushing layout around. */}
      <div className="relative">
        <div className="group/grid mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleCerts.map((cert, i) => (
            <CertCard
              key={cert.title + cert.year}
              cert={cert}
              index={i + 2}
              onOpen={setOpenCert}
            />
          ))}
        </div>

        {/* Fade-to-background over the collapsed grid's bottom edge — same
            `bg-surface` token as both the page background (Layout.tsx) and
            the cards themselves, so it reads as the grid trailing off
            rather than a colored bar. Only rendered while capped, so it
            never lingers once everything is shown. */}
        {isCappable && !expanded && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent"
          />
        )}
      </div>

      {isCappable && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="cursor-pointer rounded-full border border-border px-5 py-2 font-body text-sm font-medium text-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent"
          >
            {expanded
              ? isEn
                ? "Show less"
                : "Ver menos"
              : isEn
                ? `Show more (${certs.length - VISIBLE_CAP})`
                : `Ver más (${certs.length - VISIBLE_CAP})`}
          </button>
        </div>
      )}

      <CertLightbox cert={openCert} onClose={() => setOpenCert(null)} />
    </SectionWrapper>
  );
}
