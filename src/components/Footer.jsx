"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Github, Instagram, Facebook, Twitter } from "lucide-react";

const QUICK_LINKS = [
  { href: "/",         label: "Home"            },
  { href: "/aptitude", label: "Aptitude Test"   },
  { href: "/chatbot",  label: "AI Chatbot"      },
  { href: "/explore",  label: "Explore Careers" },
];

const RESOURCES = ["Careers in India", "Top Exams", "Best Colleges", "Mentorship"];
const SOCIAL_ICONS = [Linkedin, Github, Instagram, Facebook, Twitter];

export default function Footer() {
  return (
    <footer style={{ background: "#1e2a3a", color: "#fff", fontFamily: "'Nunito', sans-serif" }}>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 28px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 40 }}>

        {/* Brand */}
        <div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
            <Image src="/assets/icons/logo.svg" alt="Logo" width={28} height={28} style={{ display: "inline-block", marginRight: 8, verticalAlign: "middle",  filter: "brightness(0) invert(1)" }} />
             Where Do I Go?
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 220 }}>
            AI-powered career guidance to help students navigate from school to their dream career — one clear step at a time.
          </p>
          {/* Blue→teal accent rule */}
          <div style={{ height: 3, width: 52, borderRadius: 999, background: "linear-gradient(90deg,#3b82f6,#06b6d4)", marginTop: 22 }} />
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7dd3fc", marginBottom: 18 }}>
            Quick Links
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {QUICK_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 600, transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#7dd3fc"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a5f3fc", marginBottom: 18 }}>
            Resources
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {RESOURCES.map(label => (
              <a key={label} href="#"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 600, transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#a5f3fc"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7dd3fc", marginBottom: 18 }}>
            Connect With Us
          </h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
            {SOCIAL_ICONS.map((Icon, i) => (
              <a key={i} href="#"
                style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "all .2s" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg,#3b82f6,#06b6d4)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.border = "1px solid transparent";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(6,182,212,0.35)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", lineHeight: 1.7 }}>
            Helping students find their direction since 2024.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", fontWeight: 600 }}>
          © {new Date().getFullYear()} Where Do I Go? All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Use"].map(label => (
            <a key={label} href="#"
              style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", textDecoration: "none", fontWeight: 600, transition: "color .15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}