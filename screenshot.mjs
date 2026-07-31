import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";
const mobile = process.argv[4] === "mobile";

const dir = "./temporary screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter((f) => f.startsWith("screenshot-"));
const nums = existing.map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] || "0", 10));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = path.join(dir, filename);

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setViewport(mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(outPath);
