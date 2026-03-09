/**
 * WDIG PDF Service — Puppeteer Edition
 * Renders the actual React report page and exports it as PDF.
 * Replaces the Python ReportLab generator entirely.
 *
 * Run:  node pdf-service.js
 * Port: 8001  (update your backend route to call :8001/generate-pdf)
 *
 * Install deps once:
 *   npm install puppeteer express cors
 */

import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app  = express();
const PORT = 8001;

app.use(cors());
app.use(express.json({ limit: "4mb" }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", version: "8.0-puppeteer" }));

// ── POST /generate-pdf ────────────────────────────────────────────────────────
// Body: the full report payload (same shape as what routes/report.js sends)
// It injects the data into the page via localStorage then navigates to /report.
//
// IMPORTANT: set NEXT_PUBLIC_BASE_URL in your env so the page resolves correctly.
// Default assumes Next.js dev server on http://localhost:3000
app.post("/generate-pdf", async (req, res) => {
  const payload = req.body;

  if (!payload?.report) {
    return res.status(400).json({ error: "report text required" });
  }

  const BASE_URL  = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const uid       = payload.firebase_uid || "pdf-preview";
  // We'll pass the full payload via a temp key in localStorage,
  // and the report page will pick it up if uid === "pdf-preview"
  const storageKey = `wdig_pdf_payload_${uid}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",   // crisper fonts in PDF
      ],
    });

    const page = await browser.newPage();

    // ── 1. Inject payload into localStorage before the report page loads ──────
    //    We navigate to a blank page first, set localStorage, then go to report.
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    await page.evaluate(
      (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
      },
      storageKey,
      payload
    );

    // ── 2. Navigate to the report page ──────────────────────────────────────
    //    Pass a special query param so the page reads from localStorage
    //    instead of fetching from the API.
    await page.goto(`${BASE_URL}/report?uid=${uid}&pdf=1`, {
      waitUntil: "networkidle0",
      timeout: 60_000,
    });

    // ── 3. Wait for content to fully render ──────────────────────────────────
    //    Wait until the hero heading is visible (means data is loaded)
    await page.waitForSelector("h1", { timeout: 30_000 }).catch(() => {});

    // Wait an extra moment for CSS animations (trait bars, radar chart, etc.)
    await new Promise(r => setTimeout(r, 2800));

    // ── 4. Scroll through the entire page so IntersectionObserver reveals all
    //    sections (the Reveal components only animate when in viewport)
    await autoScroll(page);

    // Wait for any post-scroll animations to settle
    await new Promise(r => setTimeout(r, 1200));

    // ── 5. Inject print-optimisation styles ──────────────────────────────────
    await page.addStyleTag({ content: `
      /* Hide nav buttons, download button in PDF */
      button { display: none !important; }

      /* Prevent animations from freezing mid-frame */
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition: none !important;
      }

      /* Ensure all Reveal sections are visible (no opacity:0) */
      [style*="opacity: 0"] { opacity: 1 !important; }
      [style*="opacity:0"]  { opacity: 1 !important; }
      [style*="translateY(28px)"] { transform: none !important; }
      [style*="translateX(-16px)"] { transform: none !important; }

      /* Force backgrounds to print */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      /* Remove scrollbar */
      ::-webkit-scrollbar { display: none; }

      /* Avoid page breaks inside cards */
      [style*="borderRadius"] { page-break-inside: avoid; break-inside: avoid; }
    ` });

    // ── 6. Force all Reveal components to visible state ──────────────────────
    await page.evaluate(() => {
      // Find all elements that are still in the invisible translateY state
      document.querySelectorAll("*").forEach(el => {
        const s = el.style;
        if (s.opacity === "0") s.opacity = "1";
        if (s.transform && s.transform.includes("translateY")) s.transform = "none";
        if (s.transform && s.transform.includes("translateX")) s.transform = "none";
      });
    });

    // ── 7. Generate PDF ───────────────────────────────────────────────────────
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,       // CRITICAL: prints all background colours
      margin: {
        top:    "0",
        right:  "0",
        bottom: "0",
        left:   "0",
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    // ── 8. Cleanup localStorage ──────────────────────────────────────────────
    await page.evaluate((key) => localStorage.removeItem(key), storageKey);

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="wdig-report.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error("❌ PDF error:", err);
    if (browser) await browser.close().catch(() => {});
    res.status(500).json({ error: err.message });
  }
});

// ── Auto-scroll helper ─────────────────────────────────────────────────────────
// Scrolls page in increments so all IntersectionObservers fire
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 300;
      const delay    = 80;
      let totalH     = document.body.scrollHeight;
      let scrolled   = 0;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        scrolled += distance;
        totalH = document.body.scrollHeight; // may grow as content loads
        if (scrolled >= totalH) {
          clearInterval(timer);
          window.scrollTo(0, 0); // scroll back to top for PDF
          resolve();
        }
      }, delay);
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 WDIG PDF Service (Puppeteer) on port ${PORT}`);
});
