'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import Hyperspeed from '@/components/ui/hyperspeed';

interface CareerHeroProps {
  career: {
    code: string;
    title: string;
    also_called: string[];
    bright_outlook: boolean;
    in_demand: boolean;
    outlook_category: string;
    salary?: {
      median?: number;
      hourly_median?: number;
      low?: number;
      high?: number;
    } | null;
  };
  outlookMeta: {
    label: string;
    dot: string;
    bg: string;
    border: string;
    text: string;
  };
}

export default function CareerHero({ career, outlookMeta }: CareerHeroProps) {
  const fmt = (n?: number | null) => {
    if (!n) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  };

  useEffect(() => {
    sessionStorage.setItem('exploreSkipHero', 'true');
  }, []);

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: 380,
      // Light theme base — soft lavender-white
      background: '#f5f3ff',
    }}>
      {/* Hyperspeed — light pastel version */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.35 }}>
        <Hyperspeed
          className="w-full h-full"
          speed={0.8}
          density={120}
          color1="#7c3aed"
          color2="#ec4899"
          // light mode: we override the fill color via a wrapper tint
        />
      </div>

      {/* White-to-transparent overlay to keep it light */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(245,243,255,0.82) 0%, rgba(253,242,248,0.75) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Soft orb accents */}
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 320, height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: '30%', width: 260, height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.09) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Grid overlay — very subtle */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)',
        backgroundSize: '52px 52px',
        pointerEvents: 'none',
      }} />

      {/* Fade bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 2,
        background: 'linear-gradient(to bottom, transparent, #faf9ff)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: 1100, margin: '0 auto', padding: '40px 24px 56px' }}>

        {/* Back button */}
        <Link href="/explore" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#6d28d9', fontSize: 13, fontWeight: 700, textDecoration: 'none',
          marginBottom: 28,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 100, padding: '8px 18px',
          transition: 'background 0.2s',
          boxShadow: '0 2px 8px rgba(124,58,237,0.1)',
        }}>
          <ArrowLeft size={13} /> Back to Explore
        </Link>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {career.bright_outlook && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#fef9c3', border: '1.5px solid #fde047',
              color: '#854d0e', borderRadius: 100, padding: '5px 14px',
              fontSize: 12, fontWeight: 700,
            }}>
              <Star size={10} fill="#eab308" color="#eab308" /> Bright Outlook
            </span>
          )}
          {career.in_demand && (
            <span style={{
              background: '#fce7f3', border: '1.5px solid #fbcfe8',
              color: '#9d174d', borderRadius: 100, padding: '5px 14px',
              fontSize: 12, fontWeight: 700,
            }}>🔥 In Demand</span>
          )}
          {career.outlook_category && (
            <span style={{
              background: 'rgba(255,255,255,0.85)',
              border: `1.5px solid ${outlookMeta.border}`,
              color: outlookMeta.text, borderRadius: 100, padding: '5px 14px',
              fontSize: 12, fontWeight: 700,
              backdropFilter: 'blur(8px)',
            }}>
              {outlookMeta.label}
            </span>
          )}
          <span style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            color: '#7c3aed', borderRadius: 100, padding: '5px 14px',
            fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono',monospace",
          }}>
            O*NET {career.code}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Lora',serif",
          fontWeight: 800,
          color: '#1e1b4b',
          fontSize: 'clamp(28px,5vw,52px)',
          lineHeight: 1.12,
          maxWidth: 680,
          marginBottom: 10,
        }}>
          {career.title}
        </h1>

        {career.also_called.length > 0 && (
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
            Also known as:{' '}
            <span style={{ color: '#7c3aed', fontWeight: 600 }}>
              {career.also_called.join(' · ')}
            </span>
          </p>
        )}

        {/* Salary cards — glassmorphism on light bg */}
        {career.salary && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
            gap: 12,
            marginTop: career.also_called.length > 0 ? 0 : 32,
          }}>
            {[
              { label: 'Median Annual', value: fmt(career.salary.median),        icon: '💰', big: true  },
              { label: 'Hourly Rate',   value: career.salary.hourly_median ? `$${career.salary.hourly_median}/hr` : '—', icon: '⏱' },
              { label: 'Entry Level',   value: fmt(career.salary.low),           icon: '🌱' },
              { label: 'Senior Level',  value: fmt(career.salary.high),          icon: '🏆' },
            ].map(s => (
              <div key={s.label} style={{
                background: s.big ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(12px)',
                border: s.big ? '1.5px solid rgba(124,58,237,0.25)' : '1.5px solid rgba(0,0,0,0.08)',
                borderRadius: 18, padding: '18px 14px', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
                boxShadow: s.big ? '0 4px 20px rgba(124,58,237,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                {s.big && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg,#7c3aed,#ec4899)',
                  }} />
                )}
                <div style={{
                  width: 34, height: 34, borderRadius: 10, margin: '0 auto 10px',
                  background: s.big ? 'rgba(124,58,237,0.1)' : 'rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontSize: s.big ? 20 : 17,
                  fontWeight: 900,
                  color: s.big ? '#7c3aed' : '#111827',
                  fontFamily: "'DM Mono',monospace",
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: 11, color: '#9ca3af', marginTop: 4,
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}