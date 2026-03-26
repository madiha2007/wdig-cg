
export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error(
      `Invalid vectors: user=${a}, cluster=${b}`
    );
  }

  if (a.length !== b.length) {
    throw new Error(
      `Vector mismatch: user=${a.length}, cluster=${b.length}`
    );
  }

  let dot = 0,
    normA = 0,
    normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
