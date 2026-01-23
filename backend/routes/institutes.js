import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Correct path to JSON
const dataPath = path.join(process.cwd(), "data/institutes.sample.json");

// Read JSON once
let institutes = [];
try {
  const raw = fs.readFileSync(dataPath, "utf-8");
  institutes = JSON.parse(raw);
  console.log("Loaded institutes:", institutes);
} catch (err) {
  console.error("Failed to load institutes JSON:", err);
}

router.get("/", (req, res) => {
  res.json(institutes);
});

export default router;  
