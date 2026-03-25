"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Card = {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
  title: string;
  subtitle: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className={card.className}
            onClick={() => setSelected(card)}
          >
            <div className="relative h-full w-full rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <img
                src={card.thumbnail}
                className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
                alt={card.title}
              />
              {/* Always-on gradient + text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <p className="text-white font-bold text-lg md:text-xl leading-tight drop-shadow">
                  {card.title}
                </p>
                <p className="text-white/75 text-sm mt-1 drop-shadow">
                  {card.subtitle}
                </p>
              </div>
              {/* Hover hint */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Tap to learn more
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal overlay — rendered outside the grid so no z-index clashes */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setSelected(null)}
            />

            {/* Modal card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <div
                className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <img
                  src={selected.thumbnail}
                  className="w-full h-56 object-cover object-center"
                  alt={selected.title}
                />
                {/* Gradient over image */}
                <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Close button */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="bg-white p-6">
                  {selected.content}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};