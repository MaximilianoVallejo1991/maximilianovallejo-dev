import { useState, useMemo } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import CertCard from "../ui/CertCard";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";
import type { CertFilter } from "../../data/content";

const FILTERS: { key: CertFilter; label: { es: string; en: string } }[] = [
  { key: "all", label: { es: "Todas", en: "All" } },
  { key: "formal", label: { es: "Formal", en: "Formal" } },
  { key: "tecnica", label: { es: "Técnica", en: "Technical" } },
  { key: "extracurricular", label: { es: "Extracurricular", en: "Extracurricular" } },
];

export default function Certifications() {
  const content = useContent();
  const { certifications } = content;
  const [filter, setFilter] = useState<CertFilter>("all");
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

  const handleFilter = (key: CertFilter) => {
    setFilter((prev) => (prev === key ? "all" : key));
  };

  // Detect language from content (use navLinks as proxy since meta doesn't have lang)
  const isEn = content.hero.greeting === "Hi, I'm";

  return (
    <SectionWrapper id="certifications" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
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

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certs.map((cert, i) => (
          <CertCard key={cert.title + cert.year} cert={cert} index={i + 2} />
        ))}
      </div>
    </SectionWrapper>
  );
}
