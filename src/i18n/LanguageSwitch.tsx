import { useLanguage } from "./LanguageContext";

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const toggle = () => setLanguage(language === "es" ? "en" : "es");
  const nextLabel = language === "es" ? "Switch to English" : "Cambiar a español";

  return (
    <button
      onClick={toggle}
      aria-label={nextLabel}
      className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted transition-colors duration-200 hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <span aria-hidden="true" className={language === "es" ? "text-accent" : ""}>
        ES
      </span>
      <span aria-hidden="true" className="mx-0.5 text-border">
        /
      </span>
      <span aria-hidden="true" className={language === "en" ? "text-accent" : ""}>
        EN
      </span>
    </button>
  );
}
