'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaSrc: string;
  bgImageSrc: string;
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaSrc,
  bgImageSrc,
  title,
  subtitle,
  scrollToExpand = 'Scroll to explore',
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const delta = e.deltaY * 0.0009;
        const next = Math.min(Math.max(scrollProgress + delta, 0), 1);
        setScrollProgress(next);
        if (next >= 1) { setMediaFullyExpanded(true); setShowContent(true); }
        else if (next < 0.75) setShowContent(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const factor = deltaY < 0 ? 0.008 : 0.005;
        const next = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
        setScrollProgress(next);
        if (next >= 1) { setMediaFullyExpanded(true); setShowContent(true); }
        else if (next < 0.75) setShowContent(false);
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);
    const handleScroll = () => { if (!mediaFullyExpanded) window.scrollTo(0, 0); };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const mediaW = 320 + scrollProgress * (isMobile ? 600 : 1200);
  const mediaH = 420 + scrollProgress * (isMobile ? 180 : 380);
  const textX  = scrollProgress * (isMobile ? 160 : 140);

  const firstWord = title?.split(' ')[0] ?? '';
  const rest      = title?.split(' ').slice(1).join(' ') ?? '';

  return (
    <div className="overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">

          {/* Background image */}
<motion.div
  style={{
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    opacity: 1 - scrollProgress,
  }}
>
  <img src={"/bg.jpg"} alt="Background"
    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
</motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">

              {/* Expanding image */}
              <div
                className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
                style={{
                  width: `${mediaW}px`,
                  height: `${mediaH}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0 0 80px rgba(124,58,237,0.4)',
                }}
              >
                <Image src={"/Herocareersec.jpg"} alt={title || 'Career'} fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }} />
                {/* Violet/pink overlay that fades as it expands */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'black',
                  }}
                  animate={{ opacity: 0.9 - scrollProgress * 0.6 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Title text that splits apart */}
              <div className="flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col">
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg"
                  style={{ transform: `translateX(-${textX}vw)`, fontFamily: "'Lora', serif", fontStyle: 'italic' }}
                >
                  {firstWord}
                </motion.h1>
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg"
                  style={{ transform: `translateX(${textX}vw)`, fontFamily: "'Lora', serif", fontStyle: 'italic' }}
                >
                  {rest}
                </motion.h1>
              </div>

              {/* Subtitle + scroll hint */}
              <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 z-10">
                {subtitle && (
                  <motion.p
                    className="text-white/80 text-base font-medium px-4 text-center max-w-md"
                    animate={{ opacity: 1 - scrollProgress * 2 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
                <motion.div
                  className="flex flex-col items-center gap-2"
                  animate={{ opacity: 1 - scrollProgress * 3 }}
                >
                  <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                    {scrollToExpand}
                  </p>
                  {/* Animated scroll arrow */}
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2"
                  >
                    <div className="w-1 h-2 bg-white/60 rounded-full" />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Content below hero */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
