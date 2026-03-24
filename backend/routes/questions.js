import express from "express";
import { aptitudeQuestions } from "../data/aptitudeQuestions.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.json(aptitudeQuestions);
  } catch (err) {
    console.error("Failed to load questions:", err);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

export default router;
