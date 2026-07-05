import { LanguageProvider } from "./i18n/LanguageContext";
import { ThemeProvider } from "./theme/ThemeContext";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </LanguageProvider>
  );
}
