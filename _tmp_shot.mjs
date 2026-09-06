import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1000 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });
await page.waitForSelector("#projects");
await page.evaluate(() => document.documentElement.classList.add("dark"));
await page.evaluate(() => {
  document.querySelector("#projects").scrollIntoView({ behavior: "instant", block: "start" });
});
await new Promise((r) => setTimeout(r, 1500));

const card = await page.$("#projects article");
const box = await card.boundingBox();
const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
console.log("box", box, "scroll", scroll);

const cx = box.x + scroll.x;
const cy = box.y + scroll.y;

await page.screenshot({
  path: "C:/Users/jmaxi/AppData/Local/Temp/claude/E--proyects-maximilianovallejo-dev/077773ca-8582-40ac-9935-232e11a400fd/scratchpad/projects-normal.png",
  clip: { x: cx - 10, y: cy - 10, width: box.width + 20, height: box.height + 20 },
});

await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await new Promise((r) => setTimeout(r, 500));

await page.screenshot({
  path: "C:/Users/jmaxi/AppData/Local/Temp/claude/E--proyects-maximilianovallejo-dev/077773ca-8582-40ac-9935-232e11a400fd/scratchpad/projects-hover.png",
  clip: { x: cx - 10, y: cy - 10, width: box.width + 20, height: box.height + 260 },
});

await browser.close();
console.log("done");
