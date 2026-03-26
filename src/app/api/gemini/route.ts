export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return Response.json({ error: "No prompt" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ error: "Missing API key" }, { status: 500 });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildInsightPrompt(prompt) }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[Gemini API error]", err);
      return Response.json({ error: "Gemini request failed" }, { status: 500 });
    }

    const data = await response.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return Response.json({ output });

  } catch (error) {
    console.error("[Gemini route]", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function buildInsightPrompt(rawPrompt: string): string {
  return `${rawPrompt}

Respond ONLY with a valid JSON object. No markdown, no backticks, no explanation.
The format must be exactly:
{
  "Skill Name": {
    "why": "Why this skill matters for their specific profile",
    "impact": "What career doors or opportunities it unlocks",
    "timeframe": "Realistic time to gain this skill",
    "actionStep": "One concrete first step to start learning"
  }
}`;
}