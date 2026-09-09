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
  { key: "dev", label: { es: "Dev Full Stack", en: "Full-Stack Dev" } },
  { key: "formal", label: { es: "Formal", en: "Formal" } },
  { key: "extracurricular", label: { es: "Extracurricular", en: "Extracurricular" } },
];

// Two full rows on desktop (lg:grid-cols-3) before the fade + "show more"
// kicks in. Below this, every cert already fits without needing to collapse
// anything, so the fade/button never render for small categories.
const VISIBLE_CAP = 6;

export default function Certifications() {
  const content = useContent();
  const { certifications } = content;
  const [filter, setFilter] = useState<CertFilter>("dev");
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
    const withKeys = (cat: (typeof certifications)[number]) =>
      cat.items.map((item) => ({ ...item, categoryKey: cat.categoryKey }));

    if (filter !== "all") {
      return certifications.filter((cat) => cat.categoryKey === filter).flatMap(withKeys);
    }

    // "All" interleaves in chunks of 3 per category — dev, formal,
    // extracurricular, same order as the tabs — instead of listing one
    // whole category before moving to the next.
    const CHUNK = 3;
    const order: CertFilter[] = ["dev", "formal", "extracurricular"];
    const queues = order.map((key) => {
      const items = certifications.find((cat) => cat.categoryKey === key)?.items ?? [];
      return items.map((item) => ({ ...item, categoryKey: key }));
    });

    const interleaved: ReturnType<typeof withKeys> = [];
    for (let offset = 0; queues.some((q) => offset < q.length); offset += CHUNK) {
      for (const queue of queues) {
        interleaved.push(...queue.slice(offset, offset + CHUNK));
      }
    }
    return interleaved;
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
    <SectionWrapper
      id="certifications"
      // Extra bottom padding (vs. the pt-20/pt-28 top) — this section's
      // height grows past 100vh once certs are expanded, and pb equal to pt
      // left almost no buffer before the mandatory scroll-snap pulled you
      // into Contact right as you scrolled past the show-more button.
      className="min-h-screen mx-auto max-w-6xl px-4 pt-20 pb-40 md:pt-28 md:pb-56"
    >
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
