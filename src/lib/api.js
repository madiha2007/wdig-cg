export async function fetchMLPrediction(rawAnswers) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/predict`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: rawAnswers }), // ← must be the object, not vector
    }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.prediction;
}