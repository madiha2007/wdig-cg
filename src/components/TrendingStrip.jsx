"use client";

export default function TrendingStrip() {
  const items = [
    "🔥 AI Engineer",
    "🚀 Space Tech",
    "🌱 Green Energy",
    "🧬 Bioinformatics",
    "💻 Cybersecurity",
  ];

  return (
    <div className="overflow-hidden bg-black text-white py-3">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="text-lg font-semibold">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
