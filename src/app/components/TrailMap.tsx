'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const SECTIONS = [
  { id: 'nut-reserve',  label: 'Nut Reserve',  x: 78, y: 10 },
  { id: 'the-hoard',    label: 'The Hoard',     x: 18, y: 25 },
  { id: 'game-pit',     label: 'Game Pit',       x: 75, y: 40 },
  { id: 'signal-tower', label: 'Signal Tower',   x: 20, y: 56 },
  { id: 'gallery',      label: 'Gallery',         x: 72, y: 72 },
  { id: 'outpost',      label: 'Outpost',         x: 22, y: 87 },
] as const;

// viewBox 0 0 100 100, preserveAspectRatio="none".
// x coords 18–78 → 18–78 px in a 100px-wide container (60px wiggle).
// vectorEffect="non-scaling-stroke" keeps stroke visually 1px regardless of y-scaling.
const TRAIL_PATH = [
  'M 50 2',
  'C 78 2, 78 6, 78 10',
  'C 78 17, 18 18, 18 25',
  'C 18 32, 75 34, 75 40',
  'C 75 47, 20 49, 20 56',
  'C 20 63, 72 65, 72 72',
  'C 72 79, 22 81, 22 87',
  'C 22 93, 50 96, 50 98',
].join(' ');

// How far ahead of the active scroll position the highlight leads (0–1 fraction of total trail).
const LOOKAHEAD = 0.08;

// Paw prints along the fixed trail path, revealed/faded by scroll progress.
// Prints live at fixed slots (spaced by PRINT_SPACING along the path) — they
// never move. Only their opacity changes as the scroll position passes them.
const PRINT_SPACING = 0.032; // fraction of total path length between slots — steps, not a brush stroke
const PRINT_BEHIND = 3;      // slots already passed, kept visible then faded
const PRINT_AHEAD = 1;       // slots not yet reached, shown as a faint hint
const PRINT_FADE_BEHIND = PRINT_SPACING * (PRINT_BEHIND + 0.5);
const PRINT_FADE_AHEAD = PRINT_SPACING * (PRINT_AHEAD + 0.5);
const PRINT_PEAK_OPACITY = 0.6;
const PRINT_AHEAD_OPACITY = 0.14;

// How far (in px) the scroll position must move before the facing direction
// is re-evaluated. Keeps tiny scroll wobbles from flipping the prints.
const DIRECTION_THRESHOLD = 24;

function PawPrint({ rotate, flipped }: { rotate: number; flipped: boolean }) {
  // Small rodent track: an elongated bean-shaped heel pad plus four tapered,
  // unevenly sized claw marks fanned out — not round bubbles, not symmetric
  // dots. Toes lead at the bottom, pad trails at the top, so the print faces
  // the direction of travel. scaleY flips the facing direction; the flip is
  // animated so it eases rather than snaps.
  return (
    <svg
      width="11"
      height="13"
      viewBox="0 0 11 13"
      style={{
        display: 'block',
        transform: `rotate(${rotate}deg) scaleY(${flipped ? -1 : 1})`,
        transition: 'transform 0.5s ease',
      }}
    >
      <path
        d="M5.5 1.5 C3.9 1.5 2.9 3.1 2.9 5 C2.9 7 3.9 8.7 5.5 8.7 C7.1 8.7 8.1 7 8.1 5 C8.1 3.1 7.1 1.5 5.5 1.5 Z"
        fill="var(--gold-text, #e2c98a)"
      />
      <ellipse cx="1.7" cy="9.5" rx="0.62" ry="1.42" fill="var(--gold-text, #e2c98a)" fillOpacity="0.85" transform="rotate(-21 1.7 9.5)" />
      <ellipse cx="4.15" cy="11.3" rx="0.66" ry="1.6" fill="var(--gold-text, #e2c98a)" fillOpacity="0.85" transform="rotate(-6 4.15 11.3)" />
      <ellipse cx="6.85" cy="11.25" rx="0.66" ry="1.62" fill="var(--gold-text, #e2c98a)" fillOpacity="0.85" transform="rotate(7 6.85 11.25)" />
      <ellipse cx="9.25" cy="9.4" rx="0.58" ry="1.36" fill="var(--gold-text, #e2c98a)" fillOpacity="0.85" transform="rotate(22 9.25 9.4)" />
    </svg>
  );
}

export default function TrailMap() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [containerOpacity, setContainerOpacity] = useState(0);
  const [trailProgress, setTrailProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down');

  // Invisible path used only to measure total length in SVG user-space.
  // Must be rendered unconditionally so the ref is available after first mount.
  const measureRef = useRef<SVGPathElement | null>(null);

  // Last scrollY the direction was evaluated at — only updated once the
  // threshold is crossed, so direction doesn't get re-checked every pixel.
  const lastDirYRef = useRef(0);

  // Measure path length synchronously before first paint so highlight paths
  // start fully offset (hidden) with no unwanted transition flash.
  useLayoutEffect(() => {
    if (measureRef.current) {
      setPathLength(measureRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    lastDirYRef.current = window.scrollY;

    const update = () => {
      const hero = document.getElementById('campfire');
      const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
      const vh = window.innerHeight;

      // Only re-evaluate facing direction once the scroll position has moved
      // past the threshold, so small wobbles don't flip the prints back and forth.
      const dy = window.scrollY - lastDirYRef.current;
      if (Math.abs(dy) > DIRECTION_THRESHOLD) {
        setScrollDir(dy > 0 ? 'down' : 'up');
        lastDirYRef.current = window.scrollY;
      }

      // Fade the whole trail in as the hero scrolls off-screen.
      const newOpacity = Math.min(1, Math.max(0, (vh - heroBottom) / (vh * 0.4)));
      setContainerOpacity(newOpacity);

      if (newOpacity === 0) {
        setActiveSection(null);
        setTrailProgress(0);
        return;
      }

      // Trail progress: fraction of the 6-section span the user has scrolled through,
      // extended slightly ahead by LOOKAHEAD so the lit path leads the way.
      const firstEl = document.getElementById('nut-reserve');
      const lastEl  = document.getElementById('outpost');
      if (firstEl && lastEl) {
        const rangeStart = firstEl.offsetTop;
        const rangeEnd   = lastEl.offsetTop + lastEl.offsetHeight;
        const viewCenter = window.scrollY + vh / 2;
        const raw = (viewCenter - rangeStart) / (rangeEnd - rangeStart);
        setTrailProgress(Math.max(0, Math.min(1, raw + LOOKAHEAD)));
      }

      // Active marker: section whose centre is closest to the viewport midpoint.
      const mid = vh / 2;
      let closest: string | null = null;
      let closestDist = Infinity;

      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, height } = el.getBoundingClientRect();
        const dist = Math.abs(top + height / 2 - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = id;
        }
      }
      setActiveSection(closest);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Paw prints sit at fixed slots along the path. Only reveal the slots near
  // the current scroll position — passed ones fading out, upcoming ones a
  // faint hint — so nothing appears to walk or travel between checkpoints.
  const pawPrints: { key: number; left: number; top: number; opacity: number; rotate: number }[] = [];
  if (pathLength > 0 && measureRef.current) {
    const centerSlot = Math.round(trailProgress / PRINT_SPACING);
    for (let k = -PRINT_BEHIND; k <= PRINT_AHEAD; k++) {
      const slot = centerSlot + k;
      const slotProgress = slot * PRINT_SPACING;
      if (slotProgress < 0 || slotProgress > 1) continue;

      const delta = slotProgress - trailProgress;
      let opacity: number;
      if (delta <= 0) {
        opacity = PRINT_PEAK_OPACITY * Math.max(0, Math.min(1, 1 + delta / PRINT_FADE_BEHIND));
      } else {
        opacity = PRINT_AHEAD_OPACITY * Math.max(0, Math.min(1, 1 - delta / PRINT_FADE_AHEAD));
      }
      if (opacity <= 0.005) continue;

      const point = measureRef.current.getPointAtLength(slotProgress * pathLength);
      pawPrints.push({
        key: slot,
        left: point.x,
        top: point.y,
        opacity,
        rotate: slot % 2 === 0 ? -14 : 14,
      });
    }
  }

  return (
    <div
      className="hidden md:block"
      style={{
        position: 'fixed',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100px',
        height: '70vh',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: containerOpacity,
        transition: 'opacity 0.4s ease',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      >
        {/* Invisible measure path — always rendered, never painted. */}
        <path
          ref={measureRef}
          d={TRAIL_PATH}
          fill="none"
          stroke="none"
        />

      </svg>

      {/* Paw prints — fixed points along the trail, revealed by scroll progress. */}
      {pawPrints.map((p) => (
        <div
          key={p.key}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            transform: 'translate(-50%, -50%)',
            opacity: p.opacity,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <PawPrint rotate={p.rotate} flipped={scrollDir === 'up'} />
        </div>
      ))}

      {/* Markers — absolute-positioned so they stay circular (no SVG distortion). */}
      {SECTIONS.map(({ id, label, x, y }) => {
        const isRight = x > 50;
        const isActive = activeSection === id;
        const isHovered = hoveredSection === id;
        const lit = isActive || isHovered;

        return (
          <div
            key={id}
            role="button"
            tabIndex={0}
            aria-label={`Scroll to ${label}`}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.1 : 1})`,
              transition: 'transform 0.25s ease',
              pointerEvents: 'auto',
              cursor: 'pointer',
              padding: '8px',
              margin: '-8px',
            }}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onMouseEnter={() => setHoveredSection(id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Lantern halo — soft warm bloom behind the active checkpoint only. */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 34,
                height: 34,
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(255,208,130,0.4) 0%, rgba(224,180,100,0.14) 48%, transparent 74%)',
                opacity: lit ? 1 : 0,
                transition: 'opacity 0.35s ease',
                pointerEvents: 'none',
              }}
            />

            {/* Thin gold ring — checkpoint-lit marker */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 17,
                height: 17,
                border: '1px solid rgba(246,224,160,0.85)',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: lit ? '0 0 7px rgba(224,180,100,0.55)' : 'none',
                opacity: lit ? 1 : 0,
                transition: 'opacity 0.25s ease, box-shadow 0.25s ease',
                pointerEvents: 'none',
              }}
            />

            {/* Dot — antique brass pin when inactive, warm lit glass when active */}
            <div
              aria-hidden="true"
              style={{
                width: lit ? 8 : 6,
                height: lit ? 8 : 6,
                borderRadius: '50%',
                background: lit
                  ? 'radial-gradient(circle at 35% 30%, #fff6df 0%, #e9cd88 45%, #a9772f 100%)'
                  : 'radial-gradient(circle at 35% 30%, rgba(224,203,157,0.9) 0%, rgba(163,124,58,0.85) 55%, rgba(80,56,22,0.9) 100%)',
                border: lit ? 'none' : '1px solid rgba(80,56,22,0.55)',
                boxShadow: lit
                  ? '0 0 9px 2px rgba(224,180,100,0.55)'
                  : '0 1px 2px rgba(0,0,0,0.55)',
                transition: 'width 0.2s ease, height 0.2s ease, background 0.25s ease, box-shadow 0.25s ease',
                pointerEvents: 'none',
              }}
            />

            {/* Label */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                ...(isRight
                  ? { right: 'calc(100% + 6px)', textAlign: 'right' as const }
                  : { left: 'calc(100% + 6px)', textAlign: 'left' as const }),
                fontSize: '9px',
                fontFamily: 'var(--font-cinzel)',
                color: lit ? '#f3dfa0' : 'rgba(201,175,128,0.5)',
                textShadow: lit
                  ? '0 1px 3px rgba(0,0,0,0.65), 0 0 8px rgba(224,180,100,0.35)'
                  : '0 1px 2px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.08em',
                transition: 'color 0.25s ease, text-shadow 0.25s ease',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
