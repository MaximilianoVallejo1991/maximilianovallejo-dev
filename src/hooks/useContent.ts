import { useLanguage } from "../i18n/LanguageContext";
import { es } from "../data/content.es";
import { en } from "../data/content.en";
import type { PortfolioContent } from "../data/content";

export function useContent(): PortfolioContent {
  const { language } = useLanguage();
  return language === "en" ? en : es;
}
