"use client";

import Link from "next/link";
import { Linkedin, Github, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold mb-3">CareerPath AI</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            AI-powered career guidance to help you navigate your professional journey with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/aptitude-test" className="hover:text-white">Aptitude Test</Link></li>
            <li><Link href="/chatbot" className="hover:text-white">AI Chatbot</Link></li>
            <li><Link href="/roadmap" className="hover:text-white">Career Roadmap</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Resources</h4>
          <ul className="space-y-2 text-white/80">
            <li><a href="#" className="hover:text-white">Careers in India</a></li>
            <li><a href="#" className="hover:text-white">Top Exams</a></li>
            <li><a href="#" className="hover:text-white">Best Colleges</a></li>
            <li><a href="#" className="hover:text-white">Mentorship</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:scale-110 transition"><Linkedin size={22} /></a>
            <a href="#" className="hover:scale-110 transition"><Github size={22} /></a>
            <a href="#" className="hover:scale-110 transition"><Instagram size={22} /></a>
            <a href="#" className="hover:scale-110 transition"><Facebook size={22} /></a>
            <a href="#" className="hover:scale-110 transition"><Twitter size={22} /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 text-center py-4 text-sm text-white/70">
        © {new Date().getFullYear()} CareerPath AI. All rights reserved.
      </div>
    </footer>
  );
}
