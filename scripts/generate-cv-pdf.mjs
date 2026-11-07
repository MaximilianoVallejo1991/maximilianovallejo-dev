// Generates public/cv.pdf and public/cv.en.pdf from their matching .html
// sources, using the system Chrome/Edge install.
// Run with: pnpm cv:pdf
// Re-run this any time public/cv.html or public/cv.en.html content changes.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import puppeteer from "puppeteer-core";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const CV_VARIANTS = [
  { html: "cv.html", pdf: "cv.pdf" },
  { html: "cv.en.html", pdf: "cv.en.pdf" },
];

function findChromeExecutable() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        ]
      : process.platform === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
          ]
        : ["/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium"];

  const found = candidates.find(existsSync);
  if (!found) {
    throw new Error(
      "No se encontró Chrome ni Edge instalado. Definí la variable de entorno CHROME_PATH con la ruta al ejecutable.",
    );
  }
  return found;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findChromeExecutable(),
    headless: true,
  });

  try {
    for (const { html, pdf } of CV_VARIANTS) {
      const sourceHtml = path.join(rootDir, "public", html);
      const outputPdf = path.join(rootDir, "public", pdf);

      if (!existsSync(sourceHtml)) {
        throw new Error(`No existe ${sourceHtml}`);
      }

      const page = await browser.newPage();
      await page.goto(`file:///${sourceHtml.replace(/\\/g, "/")}`, {
        waitUntil: "networkidle0",
      });
      await page.pdf({
        path: outputPdf,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
      });
      await page.close();

      console.log(`CV generado en ${outputPdf}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
