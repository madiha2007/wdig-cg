"use client";

import { LucideIcon } from 'lucide-react';

interface HelpCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export default function HelpCard({ icon: Icon, title, description, color }: HelpCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-transparent overflow-hidden cursor-pointer">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Icon container */}
      <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Arrow indicator */}
      <div className="relative mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Learn more</span>
        <svg 
          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
