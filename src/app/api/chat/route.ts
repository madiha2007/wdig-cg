
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("career test")) {
      return NextResponse.json({
        reply: "📝 Please complete the aptitude test first so I can guide you better.",
      });
    }

    const messages = [
      {
        role: "system",
        content: "You are a friendly, concise career guidance chatbot for students. Give practical advice.",
      },
      ...history.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages,
      }),
    });

    const data = await response.json();
    console.log("GROQ RESPONSE 👉", JSON.stringify(data, null, 2));

    const reply =
      data?.choices?.[0]?.message?.content ||
      "🤖 I couldn't generate a response right now.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("SERVER ERROR ❌", err);
    return NextResponse.json({ reply: "⚠️ Server error occurred." });
  }
}