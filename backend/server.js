import express from "express";
import cors from "cors";
import "dotenv/config";
import institutesRouter from "./routes/institutes.js";
import questionsRouter from "./routes/questions.js";
import predictRouter from "./routes/predict.js";
import userRouter     from "./routes/user.js";
import feedbackRouter from "./routes/feedback.js";
import historyRouter  from "./routes/history.js";
import reportRouter from "./routes/report.js";
import puppeteer from "puppeteer";
import profileRoutes from "./routes/profile.js";


const app = express();
app.use(cors()); // allow requests from Next.js
app.use(express.json()); 

// ← ADD THIS
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.path}`);
  next();
});


app.use("/institutes", institutesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/predict", predictRouter);
app.use("/api/user",     userRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/history",  historyRouter);
app.use("/api/report", reportRouter);
app.use("/api/profile", profileRoutes);

app.post("/api/pdf/generate", async (req, res) => {
  const payload = req.body;
  if (!payload?.report) {
    return res.status(400).json({ error: "report text required" });
  }

  const BASE_URL  = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const uid       = payload.firebase_uid || "pdf-preview";
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
      ],
    });

    const page = await browser.newPage();

    // Inject payload into localStorage before navigating
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(
      (key, data) => localStorage.setItem(key, JSON.stringify(data)),
      storageKey,
      payload
    );

    // Navigate to report page in PDF mode
await page.goto(`${BASE_URL}/report?uid=${uid}&pdf=1`, {
  waitUntil: "domcontentloaded",
  timeout: 60_000,
});

// Then wait for the actual report content to appear (not just h1)
await page.waitForSelector("[data-pdf-ready]", { timeout: 45_000 }).catch(() => {});
// Fallback: if selector not found, just wait 8 seconds
await new Promise(r => setTimeout(r, 8000));

    // Scroll entire page so all IntersectionObserver Reveals fire
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const distance = 300, delay = 80;
        let scrolled = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolled += distance;
          if (scrolled >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, delay);
      });
    });

    // Wait for post-scroll animations
    await new Promise(r => setTimeout(r, 1200));

    // Force all Reveal components to visible
    await page.addStyleTag({ content: `
      button { display: none !important; }
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
      [style*="opacity: 0"] { opacity: 1 !important; }
      [style*="opacity:0"]  { opacity: 1 !important; }
      [style*="translateY(28px)"] { transform: none !important; }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      ::-webkit-scrollbar { display: none; }
    ` });

    await page.evaluate(() => {
      document.querySelectorAll("*").forEach(el => {
        if (el.style.opacity === "0") el.style.opacity = "1";
        if (el.style.transform?.includes("translateY")) el.style.transform = "none";
        if (el.style.transform?.includes("translateX")) el.style.transform = "none";
      });
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    // Cleanup
    await page.evaluate((key) => localStorage.removeItem(key), storageKey);
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="wdig-report.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error("❌ PDF error:", err.message);
    console.error("❌ PDF detail:", err.cause);   // ← add this line
    console.error("❌ BASE_URL was:", BASE_URL);  
    if (browser) await browser.close().catch(() => {});
    res.status(500).json({ error: err.message });
  }
});

// ── Also update your existing PDF route in routes/report.js ──────────────────
// Change the fetch URL from:
//   http://localhost:8001/generate-pdf
// To:
//   http://localhost:5000/api/pdf/generate
//
// That's it — no separate process, no port 8001 needed.

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
