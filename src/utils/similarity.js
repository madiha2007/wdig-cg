// export function euclideanDistance(a, b) {
//   return Math.sqrt(
//     a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
//   );
// }

// export function similarityScore(userVector, clusterVector) {
//   const distance = euclideanDistance(userVector, clusterVector);
//   return Math.max(0, 1 - distance); // normalize
// }
// src/utils/similarity.js

export function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error(
      `Vector mismatch: user=${a.length}, cluster=${b.length}`
    );
  }

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));

  return dot / (magA * magB);
}
