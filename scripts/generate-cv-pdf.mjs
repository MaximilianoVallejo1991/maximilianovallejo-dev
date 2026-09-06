// Generates public/cv.pdf from public/cv.html using the system Chrome/Edge install.
// Run with: pnpm cv:pdf
// Re-run this any time public/cv.html content changes.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import puppeteer from "puppeteer-core";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceHtml = path.join(rootDir, "public", "cv.html");
const outputPdf = path.join(rootDir, "public", "cv.pdf");

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
  if (!existsSync(sourceHtml)) {
    throw new Error(`No existe ${sourceHtml}`);
  }

  const browser = await puppeteer.launch({
    executablePath: findChromeExecutable(),
    headless: true,
  });

  try {
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
  } finally {
    await browser.close();
  }

  console.log(`CV generado en ${outputPdf}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
