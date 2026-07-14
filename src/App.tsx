import { LanguageProvider } from "./i18n/LanguageContext";
import { ThemeProvider } from "./theme/ThemeContext";
import Layout from "./components/layout/Layout";
import { usePreWarmBackends } from "./hooks/usePreWarmBackends";

export default function App() {
  usePreWarmBackends();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </LanguageProvider>
  );
}
