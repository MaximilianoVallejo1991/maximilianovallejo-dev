import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import Footer from "../layout/Footer";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function Contact() {
  const content = useContent();
  const { contact } = content;

  return (
    // No max-w-6xl/px-4 here (unlike every other section) — Footer needs to
    // render full-bleed (its own bg-surface/border-t spans the whole
    // viewport width, same as it always has), so the max-width constraint
    // moves to an inner wrapper below instead of living on the section
    // itself. flex + justify-between pins Footer to the section's bottom
    // edge instead of floating right under the buttons.
    //
    // Fixed height (not min-h-screen — see below for why not plain
    // h-screen either): with min-h-screen the section can grow TALLER than
    // one viewport (content + Footer combined), pushing Footer below the
    // fold on landing. overflow-y-auto is the safety valve for the rare
    // case content+Footer still don't fit (e.g. a very short landscape
    // viewport) — same internally-scrolling pattern Experience.tsx uses.
    //
    // h-[calc(100vh-5rem)], not h-screen: every section carries
    // scroll-mt-14 (56px, from SectionWrapper) so the sticky Nav doesn't
    // cover it on snap — that shifts this section's visual top 56px down
    // from the real viewport top. A plain h-screen (100vh) box anchored
    // there ends 56px BELOW the real viewport bottom, and Footer sits
    // pinned to that box's bottom edge (justify-between) — so with
    // h-screen only the very top sliver of Footer (its border-t) was ever
    // in view, never the actual text. Shrinking the box by more than that
    // 56px (5rem, with a small safety margin) keeps the whole box —
    // Footer included — inside the visible viewport.
    <SectionWrapper
      id="contact"
      className="h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hidden flex flex-col justify-between"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-16 md:pt-28">
        <motion.h2
          {...fadeInItem(0)}
          className="font-heading text-3xl font-bold text-primary md:text-4xl"
        >
          {content.navLinks.find((l) => l.href === "#contact")?.label}
        </motion.h2>

        <motion.p
          {...fadeInItem(1)}
          className="mt-4 font-body text-lg text-muted md:text-xl"
        >
          {contact.cta}
        </motion.p>

        <motion.div
          {...fadeInItem(2)}
          className="mt-8 flex flex-wrap gap-6"
        >
          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            aria-label={`Send email to ${contact.email}`}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-5 py-3 font-body text-base font-medium text-primary no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {contact.linkLabels.email}
          </a>

          {/* LinkedIn */}
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-5 py-3 font-body text-base font-medium text-primary no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            {contact.linkLabels.linkedin}
          </a>

          {/* GitHub */}
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-5 py-3 font-body text-base font-medium text-primary no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            {contact.linkLabels.github}
          </a>
        </motion.div>
      </div>

      <Footer />
    </SectionWrapper>
  );
}
