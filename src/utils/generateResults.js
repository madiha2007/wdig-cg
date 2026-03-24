import { clusters } from "./clusters";
import { cosineSimilarity } from "./similarity";
import { fetchMLPrediction } from "@/lib/api";

// Local fallback (your existing logic, unchanged)
function generateResultsLocal(userVector) {
  if (!Array.isArray(userVector)) return [];

  return clusters
    .map((cluster) => ({
      clusterId: cluster.id,
      clusterName: cluster.name,
      similarity: Number(
        (cosineSimilarity(userVector, cluster.vector) * 100).toFixed(1)
      ),
      careers: cluster.careers,
    }))
    .filter((r) => r.similarity >= 55)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 2);
}

// API response → same shape as local results
function normalizeAPIResponse(prediction) {
  // Python returns raw scores (e.g. 13.4 out of ~20)
  // Normalize to percentage based on max possible score
  const MAX_SCORE = 20;
  const confidencePct = Math.min(100, Math.round((prediction.confidence / MAX_SCORE) * 100));

  return [
    {
      clusterId: `cluster_${prediction.cluster_id}`,
      clusterName: prediction.thinking_style,
      similarity: confidencePct,
      careers: {
        top: prediction.top_careers ?? [],
        moderate: prediction.moderate_careers ?? [],
        least: prediction.least_careers ?? [],
      },
    },
  ];
}

// Main export — now async
export async function generateResults(userVector, confidence, rawAnswers) {
  try {
    const prediction = await fetchMLPrediction(rawAnswers); // ← rawAnswers here
    console.log("✅ Using ML API result");
    return normalizeAPIResponse(prediction);
  } catch (err) {
    console.warn("⚠️ ML API failed, falling back to local:", err.message);
    return generateResultsLocal(userVector);
  }
}