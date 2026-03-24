export function calculateConfidence({
  avgTimePerQuestion,
  hesitationRate,
  consistencyScore
}) {
  // normalize everything to 0–1
  const timeScore = 1 - Math.min(avgTimePerQuestion / 60, 1);
  const hesitationScore = 1 - hesitationRate;
  const confidence =
    (timeScore * 0.4) +
    (hesitationScore * 0.3) +
    (consistencyScore * 0.3);

  return Number(confidence.toFixed(2));
}
