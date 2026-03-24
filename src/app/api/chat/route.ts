// // import { NextResponse } from "next/server";

// // export async function POST(req: Request) {
// //   try {
// //     const { message, history } = await req.json();
// //     const lowerMsg = message.toLowerCase();

// //     /* ---------- RULE BASED ---------- */

// //     if (lowerMsg.includes("career test")) {
// //       return NextResponse.json({
// //         reply:
// //           "📝 Please complete the aptitude test first so I can guide you better.",
// //       });
// //     }

// //     /* ---------- GEMINI MEMORY ---------- */

// //     const contents = [
// //       {
// //         role: "user",
// //         parts: [
// //           {
// //             text:
// //               "You are a friendly, concise career guidance chatbot for students. Give practical advice.",
// //           },
// //         ],
// //       },
// //       ...history.map((msg: any) => ({
// //         role: msg.sender === "user" ? "user" : "model",
// //         parts: [{ text: msg.text }],
// //       })),
// //       {
// //         role: "user",
// //         parts: [{ text: message }],
// //       },
// //     ];

// //     /* ---------- GEMINI API (v1) ---------- */

// //     const response = await fetch(
// // `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ contents }),
// //       }
// //     );

// //     const data = await response.json();

// //     console.log("GEMINI RESPONSE 👉", JSON.stringify(data, null, 2));

// //     const reply =
// //       data?.candidates?.[0]?.content?.parts?.[0]?.text ||
// //       "🤖 I couldn’t generate a response right now.";

// //     return NextResponse.json({ reply });
// //   } catch (err) {
// //     console.error("SERVER ERROR ❌", err);
// //     return NextResponse.json({
// //       reply: "⚠️ Server error occurred.",
// //     });
// //   }
// // }


// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { message, history } = await req.json();
//     const lowerMsg = message.toLowerCase();

//     // Rule-based check
//     if (lowerMsg.includes("career test")) {
//       return NextResponse.json({
//         reply: "📝 Please complete the aptitude test first so I can guide you better.",
//       });
//     }

//     // Build message history for Claude
//     const messages = [
//       ...history.map((msg: any) => ({
//         role: msg.sender === "user" ? "user" : "assistant",
//         content: msg.text,
//       })),
//       { role: "user", content: message },
//     ];

//     const response = await fetch("https://api.anthropic.com/v1/messages", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.ANTHROPIC_API_KEY!,
//         "anthropic-version": "2023-06-01",
//       },
//       body: JSON.stringify({
//         model: "claude-haiku-4-5-20251001",
//         max_tokens: 1024,
//         system: "You are a friendly, concise career guidance chatbot for students. Give practical advice.",
//         messages,
//       }),
//     });

//     const data = await response.json();

//     console.log("CLAUDE RESPONSE 👉", JSON.stringify(data, null, 2));

//     const reply =
//       data?.content?.[0]?.text ||
//       "🤖 I couldn't generate a response right now.";

//     return NextResponse.json({ reply });
//   } catch (err) {
//     console.error("SERVER ERROR ❌", err);
//     return NextResponse.json({
//       reply: "⚠️ Server error occurred.",
//     });
//   }
// }



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