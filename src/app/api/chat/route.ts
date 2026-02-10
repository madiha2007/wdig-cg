import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const lowerMsg = message.toLowerCase();

    /* ---------- RULE BASED ---------- */

    if (lowerMsg.includes("career test")) {
      return NextResponse.json({
        reply:
          "📝 Please complete the aptitude test first so I can guide you better.",
      });
    }

    /* ---------- GEMINI MEMORY ---------- */

    const contents = [
      {
        role: "user",
        parts: [
          {
            text:
              "You are a friendly, concise career guidance chatbot for students. Give practical advice.",
          },
        ],
      },
      ...history.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    /* ---------- GEMINI API (v1) ---------- */

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE 👉", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 I couldn’t generate a response right now.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("SERVER ERROR ❌", err);
    return NextResponse.json({
      reply: "⚠️ Server error occurred.",
    });
  }
}
