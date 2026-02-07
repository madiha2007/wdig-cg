import { CLUSTERS } from "./clusters";
import { cosineSimilarity } from "./similarity";

export function generateResults(userVector, confidence) {
  return CLUSTERS.map(cluster => {
    const similarity = cosineSimilarity(userVector, cluster.vector);

    const confidenceBoost = 1 + confidence * 0.1; // mild influence
    const finalScore = similarity * confidenceBoost;

    return {
      ...cluster,
      score: finalScore
    };
  }).sort((a, b) => b.score - a.score);
}
