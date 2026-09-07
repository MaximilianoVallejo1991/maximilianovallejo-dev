import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CertItem } from "../../data/content";

interface CertLightboxProps {
  cert: CertItem | null;
  onClose: () => void;
}

export default function CertLightbox({ cert, onClose }: CertLightboxProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!cert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cert, onClose]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={cert.title}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 p-6 backdrop-blur-sm motion-reduce:transition-none"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-surface"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-surface font-body text-sm text-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent"
            >
              &#10005;
            </button>

            <div className="flex items-center justify-center overflow-auto p-6 pt-12">
              <img
                src={cert.imageUrl}
                alt={cert.title}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>

            <div className="border-t border-border p-4 text-center">
              <h3 className="font-heading text-base font-semibold text-primary">
                {cert.title}
              </h3>
              <p className="mt-1 font-body text-sm text-muted">
                {cert.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
