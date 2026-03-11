

import express from "express";
// import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const router = express.Router();

// Load handcrafted JSON at startup - instant, no network needed
const dataPath = path.join(process.cwd(), "data/maharashtra_institutes.json");
let institutes = [];

try {
  institutes = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`✅ Loaded ${institutes.length} Maharashtra institutes`);
} catch (err) {
  console.error("❌ Failed to load maharashtra_institutes.json:", err.message);
}

// GET all institutes
router.get("/", (req, res) => {
  res.json(institutes);
});

// GET single institute - enriched with Google Places if key is set
router.get("/:id/details", async (req, res) => {
  const { id } = req.params;

  const inst = institutes.find((i) => String(i.id) === String(id));
  if (!inst) {
    return res.status(404).json({ error: "Institute not found" });
  }

  // No Google key = return full handcrafted data as-is
  if (!process.env.GOOGLE_PLACES_KEY) {
    return res.json(inst);
  }

  // Enrich with Google Places for photo + address
  try {
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        inst.name + " " + inst.city + " Maharashtra India"
      )}&inputtype=textquery&fields=name,rating,photos,formatted_address,website&key=${process.env.GOOGLE_PLACES_KEY}`
    );
    const googleData = await googleRes.json();
    const place = googleData.candidates?.[0];

    if (!place) return res.json(inst);

    const photoRef = place.photos?.[0]?.photo_reference;
    const photoUrl = photoRef
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoRef}&key=${process.env.GOOGLE_PLACES_KEY}`
      : null;

    // Handcrafted data wins for fees/courses/placement, Google wins for photo/address
    res.json({
      ...inst,
      image: photoUrl || inst.image,
      address: place.formatted_address || null,
      rating: inst.rating || place.rating || null,
    });
  } catch (err) {
    console.error("Google Places failed:", err.message);
    res.json(inst);
  }
});

export default router;