"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I’m your career assistant! Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { sender: "user", text: input };

  setMessages(prev => [...prev, userMsg]);
  setInput("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        history: messages, // 👈 MEMORY
      }),
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { sender: "bot", text: data.reply },
    ]);
  } catch (err) {
    setMessages(prev => [
      ...prev,
      { sender: "bot", text: "Something went wrong 😕 Please try again." },
    ]);
  }
};


  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-300 to-fuchsia-300">
            <Image src="/bot.png" alt="Bot" width={36} height={36} />
            <h3 className="font-semibold text-lg text-white">Career Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-xl font-bold text-white hover:text-gray-200 transition"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-3 py-3 space-y-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm
                  ${msg.sender === "user"
                    ? "ml-auto bg-sky-100 rounded-br-none"
                    : "mr-auto bg-fuchsia-100 rounded-bl-none"
                  }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about careers..."
              className="flex-1 px-3 py-2 rounded-xl border focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white hover:scale-105 transition-transform"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-sky-300 to-fuchsia-300 shadow-xl z-50 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Image src="/bot.png" alt="Bot" width={48} height={48} />
      </button>
    </>
  );
}
