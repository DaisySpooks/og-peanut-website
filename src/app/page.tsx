'use client';

import { useEffect, useRef, useState } from 'react';

const VIDEO_W = 1920;
const VIDEO_H = 1080;

// Permanent desktop design reference: all desktop overlay pixel offsets
// (sign positions, text positions) were authored against this composition.
const REFERENCE_W = 1470;
const REFERENCE_H = 756;
const DESKTOP_BREAKPOINT = 768;

function ocTransform(vw: number, vh: number) {
  const scale = Math.min(vw / VIDEO_W, vh / VIDEO_H);
  return { scale, tx: (vw - VIDEO_W * scale) / 2, ty: (vh - VIDEO_H * scale) / 2 };
}

const shadowLayers = [
  '0 1px 0 rgba(12, 6, 1, 0.95)',
  '0 2px 4px rgba(8, 4, 0, 0.7)',
  '1px 0 1px rgba(10, 5, 1, 0.6)',
  '-1px 0 1px rgba(10, 5, 1, 0.6)',
  '0 -1px 0 rgba(10, 5, 1, 0.5)',
  '0 0 8px rgba(6, 3, 0, 0.25)',
].join(', ');

const textStyle = (rotate: string): React.CSSProperties => ({
  color: '#e2c98a',
  opacity: 0.88,
  transform: rotate,
  textShadow: shadowLayers,
});

// Sign boards in DOM/paint order (bottom to top). A single hit-test pass
// walks this list in reverse so the topmost board wins ties over overlap.
const SIGNS = [
  { id: 'discord', src: '/signs/signpost-discord.png' },
  { id: 'mint', src: '/signs/signpost-mint.png' },
  { id: 'radio', src: '/signs/signpost-radio.png' },
  { id: 'poker', src: '/signs/signpost-poker.png' },
  { id: 'pq', src: '/signs/signpost-pq.png' },
  { id: 'nutaverse', src: '/signs/signpost-nutaverse.png' },
] as const;

const SIGNS_TOPMOST_FIRST = [...SIGNS].reverse();
const SIGN_SRCS = SIGNS.map((s) => s.src);

const SIGN_URLS: Record<string, string> = {
  discord: 'https://discord.com/invite/UPR3FZBCzn',
  mint: 'https://www.launchmynft.io/mint/peanutprotocol',
  radio: 'https://ogpeanut-radio.com/',
  poker: 'https://poker.peanut-hub.com/',
  pq: 'https://plz.veraity.com/',
  nutaverse: 'https://oncyber.io/spaces/yK3f3sBsCUw0d6iys8z2',
};

// Loads each sign's alpha channel once, then exposes a hit test that checks
// a single sign's visible (non-transparent) pixels at a given client point —
// independent of any other sign's box, so overlap doesn't matter.
function useAlphaHitTesters() {
  const canvasesRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

  useEffect(() => {
    SIGN_SRCS.forEach((src) => {
      const img = new Image();
      const load = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        canvasesRef.current.set(src, canvas);
      };
      img.onload = load;
      img.src = src;
      if (img.complete) load();
    });
  }, []);

  return (src: string, el: HTMLElement, clientX: number, clientY: number) => {
    const canvas = canvasesRef.current.get(src);
    if (!canvas) return false;
    const rect = el.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;
    const alpha = canvas.getContext('2d')?.getImageData(x, y, 1, 1).data[3] ?? 0;
    return alpha > 10;
  };
}

export default function Home() {
  // null until mounted — avoids reading window during render, which causes
  // a server/client mismatch and hydration errors.
  const [artboard, setArtboard] = useState<{
    w: number; h: number; scale: number; tx: number; ty: number;
  } | null>(null);

  const [hoveredSign, setHoveredSign] = useState<string | null>(null);

  const SUBTITLE = 'Choose your destination...';
  const [subtitleChars, setSubtitleChars] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(1);
  const [subtitleFade, setSubtitleFade] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const introCompleteRef = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function clear() {
      if (interval) { clearInterval(interval); interval = null; }
      timers.splice(0).forEach(clearTimeout);
    }

    function t(ms: number, fn: () => void) {
      const id = setTimeout(fn, ms);
      timers.push(id);
    }

    function startCycle() {
      if (introCompleteRef.current && window.innerWidth < DESKTOP_BREAKPOINT) return;
      clear();
      setSubtitleFade(false);
      setSubtitleOpacity(1);
      setSubtitleChars(0);
      setCursorVisible(true);
      setVisibleCount(0);

      const charDelay = 180 / 1;
      let count = 0;
      interval = setInterval(() => {
        count++;
        setSubtitleChars(count);
        if (count >= SUBTITLE.length) {
          clearInterval(interval!);
          interval = null;
          // Hold 1s, then blink 3× (sharp, 150ms off / 150ms on each)
          t(1000, () => {
            setCursorVisible(false);
            setSubtitleOpacity(0);
            t(150, () => {
              setSubtitleOpacity(1);
              t(150, () => {
                setSubtitleOpacity(0);
                t(150, () => {
                  setSubtitleOpacity(1);
                  t(150, () => {
                    setSubtitleOpacity(0);
                    t(150, () => {
                      setSubtitleOpacity(1);
                      // Enable CSS transition, then fade out
                      t(150, () => {
                        setSubtitleFade(true);
                        setSubtitleOpacity(0);
                        // Reveal menu after 400ms (overlay peak window) at same 200ms cascade speed
                        SIGNS.forEach((_, i) => t(400 + i * 200, () => {
                          setVisibleCount(i + 1);
                          if (i === 0) { setIntroComplete(true); introCompleteRef.current = true; }
                        }));
                        // 0.5s fade + ~4.5s hidden, then restart
                        t(5000, startCycle);
                      });
                    });
                  });
                });
              });
            });
          });
        }
      }, charDelay);
    }

    startCycle();
    return clear;
  }, []);

  const isOpaqueAt = useAlphaHitTesters();
  const signElsRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const handleSignsMouseMove = (e: React.MouseEvent) => {
    for (const sign of SIGNS_TOPMOST_FIRST) {
      const el = signElsRef.current.get(sign.id);
      if (el && isOpaqueAt(sign.src, el, e.clientX, e.clientY)) {
        setHoveredSign(sign.id);
        return;
      }
    }
    setHoveredSign(null);
  };

  const handleSignsMouseLeave = () => setHoveredSign(null);

  const handleSignsClick = () => {
    if (hoveredSign) {
      if (hoveredSign === 'discord') {
        window.open(SIGN_URLS[hoveredSign], '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = SIGN_URLS[hoveredSign];
      }
    }
  };

  useEffect(() => {
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    const w = isDesktop ? REFERENCE_W : window.innerWidth;
    const h = isDesktop ? REFERENCE_H : window.innerHeight;
    const ref = ocTransform(w, h);

    function compute() {
      const cur = ocTransform(window.innerWidth, window.innerHeight);
      const s = cur.scale / ref.scale;
      setArtboard({ w, h, scale: s, tx: cur.tx - ref.tx * s, ty: cur.ty - ref.ty * s });
    }

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  const overlayOpacity = introComplete ? 0 : subtitleFade ? 0 : 1;
  const overlayTransition = !subtitleFade && visibleCount === 0
    ? 'none'
    : visibleCount > 0
      ? 'opacity 1000ms ease'
      : 'opacity 400ms ease';

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <style>{`
        @keyframes blockCursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover block md:hidden" style={{ objectPosition: '25% center' }}
      >
        <source src="/video/hero-mobile.mp4" type="video/mp4" />
      </video>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-contain hidden md:block"
      >
        <source src="/video/hero-desktop.mp4" type="video/mp4" />
      </video>

      {/* Black transition overlay — driven by subtitle lifecycle, never blocks interaction */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-30 bg-black pointer-events-none"
        style={{ opacity: overlayOpacity, transition: overlayTransition }}
      />

      {/* Atmospheric edge gradients — desktop only. Cover letterbox/pillarbox bars
          and softly vignette into the scene regardless of viewport aspect ratio. */}
      <div className="absolute inset-x-0 top-0 h-48 z-20 pointer-events-none hidden md:block"
        style={{ background: 'linear-gradient(to bottom, #000 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-48 z-20 pointer-events-none hidden md:block"
        style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} />
      <div className="absolute inset-y-0 left-0 w-48 z-20 pointer-events-none hidden md:block"
        style={{ background: 'linear-gradient(to right, #000 0%, transparent 100%)' }} />
      <div className="absolute inset-y-0 right-0 w-48 z-20 pointer-events-none hidden md:block"
        style={{ background: 'linear-gradient(to left, #000 0%, transparent 100%)' }} />

      {/* Desktop logo */}
      <div className="hidden md:block absolute top-10 left-12 z-20">
        <img
          src="/images/og-peanut-title.png"
          alt="OG Peanut"
          className="h-[80px] w-auto"
          style={{
            opacity: 0.7,
          }}
        />
      </div>

      {/* Mobile header group: logo + subtitle + destination dropdown */}
      <div className="block md:hidden absolute top-8 inset-x-0 z-40">
        <img
          src="/images/og-peanut-title.png"
          alt="OG Peanut"
          className="h-[72px] w-auto ml-[6px]"
          style={{
            opacity: introComplete ? 1 : 0,
          }}
        />
        <p
          className="mt-2 pl-20 text-right text-base font-bold whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-cinzel)',
            color: '#e6d3a0',
            textShadow: '0 1px 0 rgba(255,220,160,0.15), 0 2px 4px rgba(0,0,0,0.8)',
            opacity: introComplete ? 1 : subtitleOpacity,
            transition: introComplete ? 'none' : subtitleFade ? 'opacity 0.5s ease' : 'none',
          }}
        >
          <span style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.32)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '2px',
            paddingBottom: '2px',
            borderRadius: '3px',
          }}>
            {introComplete ? SUBTITLE : SUBTITLE.slice(0, subtitleChars)}
            {!introComplete && cursorVisible && (
              <span aria-hidden="true" style={{ animation: 'blockCursorBlink 0.9s steps(1, end) infinite' }}>▋</span>
            )}
          </span>
        </p>
        <div className="mt-2 pl-20 pr-[14px]" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', textAlign: 'right' }}>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-2px -14px',
                background: 'rgba(0,0,0,0.32)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                borderRadius: '3px',
                transform: `scaleY(${visibleCount / SIGNS.length})`,
                transformOrigin: 'top',
                transition: 'transform 0.25s ease',
                pointerEvents: 'none',
              }}
            />
            {(() => {
              const labels: Record<string, string> = {
                discord: 'Discord',
                mint: 'Mint',
                radio: 'Radio',
                poker: 'Poker',
                pq: 'Peaquilizer',
                nutaverse: 'Nutaverse',
              };
              return SIGNS.map((sign, i) => {
                const visible = i < visibleCount;
                return (
                  <a
                    key={sign.id}
                    href={SIGN_URLS[sign.id]}
                    target={sign.id === 'discord' ? '_blank' : undefined}
                    rel={sign.id === 'discord' ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-cinzel)',
                      fontWeight: 700,
                      color: '#e2c98a',
                      fontSize: '0.85rem',
                      letterSpacing: '0.05em',
                      textShadow: shadowLayers,
                      textDecoration: 'none',
                      padding: '4px 0',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(-4px)',
                      transition: 'opacity 0.25s ease, transform 0.25s ease',
                      pointerEvents: visible ? 'auto' : 'none',
                    }}
                  >
                    {labels[sign.id]}
                  </a>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {artboard && <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: artboard.w,
          height: artboard.h,
          transformOrigin: '0 0',
          transform: `translate(${artboard.tx}px, ${artboard.ty}px) scale(${artboard.scale})`,
          pointerEvents: 'none',
        }}
      >
        {/* All sign boards. One shared listener owns pointer events for the
            whole stack; alpha hit testing in JS (topmost sign first) decides
            which single sign, if any, is hovered. */}
        <div
          className="absolute right-[30px] top-[75px] z-50 w-[375px]"
          style={{ pointerEvents: 'auto' }}
          onMouseMove={handleSignsMouseMove}
          onMouseLeave={handleSignsMouseLeave}
          onClick={handleSignsClick}
        >

          {/* Discord: board + text lift together on hover */}
          <div
            className={`absolute top-0 left-0 w-[370px] cursor-pointer transition-all duration-200 ${hoveredSign === 'discord' ? 'scale-[1.02] brightness-105' : ''
              }`}
            style={{ transformOrigin: '40% 17%' }}
          >
            <img
              ref={(el) => { if (el) signElsRef.current.set('discord', el); }}
              src="/signs/signpost-discord.png"
              alt="Discord"
              className="w-[370px]"
            />
          </div>

          <div
            className={`absolute top-0 left-0 w-[365px] cursor-pointer transition-all duration-200 ${hoveredSign === 'mint' ? 'scale-[1.02] brightness-105' : ''
              }`}
            style={{ transformOrigin: '40% 32%' }}
          >
            <img
              ref={(el) => { if (el) signElsRef.current.set('mint', el); }}
              src="/signs/signpost-mint.png"
              alt="Mint"
              className="w-[365px]"
            />
          </div>

          <div
            className={`absolute top-0 left-0 w-[360px] cursor-pointer transition-all duration-200 ${hoveredSign === 'radio' ? 'scale-[1.02] brightness-105' : ''
              }`}
            style={{ transformOrigin: '39% 45%' }}
          >
            <img
              ref={(el) => { if (el) signElsRef.current.set('radio', el); }}
              src="/signs/signpost-radio.png"
              alt="Radio"
              className="w-[360px]"
            />
          </div>

          <div
            className={`absolute top-[-3px] left-0 w-[355px] cursor-pointer transition-all duration-200 ${hoveredSign === 'poker' ? 'scale-[1.02] brightness-105' : ''
              }`}
            style={{ transformOrigin: '39% 60%' }}
          >
            <img
              ref={(el) => { if (el) signElsRef.current.set('poker', el); }}
              src="/signs/signpost-poker.png"
              alt="Poker"
              className="w-[355px]"
            />
          </div>

          <div
            className={`absolute top-[-3px] left-0 w-[350px] cursor-pointer transition-all duration-200 ${hoveredSign === 'pq' ? 'scale-[1.02] brightness-105' : ''
              }`}
            style={{ transformOrigin: '38% 74%' }}
          >
            <img
              ref={(el) => { if (el) signElsRef.current.set('pq', el); }}
              src="/signs/signpost-pq.png"
              alt="Peaquilizer"
              className="w-[350px]"
            />
          </div>

          <div
            className={`absolute top-[-1px] left-0 w-[345px] cursor-pointer transition-all duration-200 ${hoveredSign === 'nutaverse' ? 'scale-[1.02] brightness-105' : ''
              }`}
            style={{ transformOrigin: '38% 89%' }}
          >
            <img
              ref={(el) => { if (el) signElsRef.current.set('nutaverse', el); }}
              src="/signs/signpost-nutaverse.png"
              alt="Nutaverse"
              className="w-[345px]"
            />
          </div>
        </div>

        {/* Subtitle — anchored via the same ocTransform artboard as the sign boards.
            Artboard coords (678, 340) = parent top-10/left-12 (40+300, 48+630) at reference viewport. */}
        <p
          className="absolute left-[660px] top-[340px] z-10 font-bold text-[#e6d3a0]/60 whitespace-nowrap"
          style={{
            fontSize: '1.5rem',
            fontFamily: "var(--font-cinzel)",
            textShadow: `
      0 1px 0 rgba(255,220,160,0.15),
      0 2px 4px rgba(0,0,0,0.8)
    `,
            opacity: subtitleOpacity,
            transition: subtitleFade ? 'opacity 0.5s ease' : 'none',
          }}
        >
          <span style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.32)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '2px',
            paddingBottom: '2px',
            borderRadius: '3px',
          }}>
            {SUBTITLE.slice(0, subtitleChars)}
            <span
              aria-hidden="true"
              style={{
                animation: 'blockCursorBlink 0.9s steps(1, end) infinite',
              }}
            >▋</span>
          </span>
        </p>

        {/* All text overlays */}
        <div className="absolute right-0 top-0 z-[60]">

          <div className="absolute right-[185px] top-[150px]">
            <span
              className={`inline-block text-4xl font-bold transition-all duration-200 ${hoveredSign === 'discord' ? 'scale-[1.02] brightness-105' : ''
                }`}
              style={{
                ...textStyle('rotate(-7deg)'),
                fontFamily: 'var(--font-cinzel)',
                opacity: 0.7,
              }}
            >
              DISCORD
            </span>
          </div>

          <div className="absolute right-[235px] top-[225px]">
            <span
              className={`inline-block text-4xl font-bold transition-all duration-200 ${hoveredSign === 'mint' ? 'scale-[1.02] brightness-105' : ''
                }`}
              style={{
                ...textStyle('rotate(-3deg)'),
                fontFamily: 'var(--font-cinzel)',
                opacity: 0.7,
              }}
            >
              MINT
            </span>
          </div>

          <div className="absolute right-[220px] top-[295px]">
            <span
              className={`inline-block text-4xl font-bold transition-all duration-200 ${hoveredSign === 'radio' ? 'scale-[1.02] brightness-105' : ''
                }`}
              style={{
                ...textStyle('rotate(-1deg)'),
                fontFamily: 'var(--font-cinzel)',
                opacity: 0.7,
              }}
            >
              RADIO
            </span>
          </div>

          <div className="absolute right-[215px] top-[360px]">
            <span
              className={`inline-block text-4xl font-bold transition-all duration-200 ${hoveredSign === 'poker' ? 'scale-[1.02] brightness-105' : ''
                }`}
              style={{
                ...textStyle('rotate(2deg)'),
                fontFamily: 'var(--font-cinzel)',
                opacity: 0.7,
              }}
            >
              POKER
            </span>
          </div>

          <div className="absolute right-[185px] top-[432px]">
            <span
              className={`inline-block text-[1.75rem] font-bold transition-all duration-200 ${hoveredSign === 'pq' ? 'scale-[1.02] brightness-105' : ''
                }`}
              style={{
                ...textStyle('rotate(5deg)'),
                fontFamily: 'var(--font-cinzel)',
                opacity: 0.7,
              }}
            >
              PEAQUILIZER
            </span>
          </div>

          <div className="absolute right-[190px] top-[503px]">
            <span
              className={`inline-block text-3xl font-bold transition-all duration-200 ${hoveredSign === 'nutaverse' ? 'scale-[1.02] brightness-105' : ''
                }`}
              style={{
                ...textStyle('rotate(8deg)'),
                fontFamily: 'var(--font-cinzel)',
                opacity: 0.7,
              }}
            >
              NUTAVERSE
            </span>
          </div>
        </div>
      </div>}
    </main>
  );
}