"use client";

const categories = ["All", "Tech", "Healthcare", "Green", "Creative"];
const tags = ["High Salary", "Remote", "Future Proof"];

export default function FilterBar({
  activeCategory,
  setCategory,
  activeTag,
  setTag,
}) {
  return (
    <div className="sticky top-0 bg-white z-10 py-4 shadow">
      <div className="flex flex-wrap justify-between gap-4 px-6">

        {/* Categories */}
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border transition
                ${
                  activeCategory === cat
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-3 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTag(tag)}
              className={`px-4 py-2 rounded-full border transition
                ${
                  activeTag === tag
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
