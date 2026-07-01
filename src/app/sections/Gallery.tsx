'use client';

import { useEffect, useState, type ReactNode } from 'react';

// To swap in real OG Peanut NFT images: set src to the image URL.
// objectFit is 'cover' by default — change to 'contain' if needed for square NFTs.
const COLLECTION_CARDS = [
  { id: '001', src: '' },
  { id: '002', src: '' },
  { id: '003', src: '' },
];

interface RecentMint {
  name: string;
  image: string;
  mintAddress: string;
  solscanUrl: string;
}

function FramedPortrait({
  label,
  src,
  href,
  loading,
}: {
  label: string;
  src: string;
  href?: string;
  loading?: boolean;
}) {
  const Frame = href ? 'a' : 'div';

  return (
    <Frame
      className={`gl-frame${loading ? ' gl-frame-loading' : ''}`}
      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'block',
        cursor: href ? 'pointer' : 'default',
        // Asymmetric drop shadow + soft warm wall-glow — anchors the frame to the wall
        boxShadow: [
          '3px 5px 22px rgba(0,0,0,0.72)',
          '-1px -2px 7px rgba(0,0,0,0.32)',
          '0 0 36px 4px rgba(226,201,138,0.10)',
        ].join(', '),
      }}
    >
      {/* Dark archival mat — sits between the gold frame and the image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 3,
          overflow: 'hidden',
          background: 'linear-gradient(150deg, rgba(14,9,5,0.97), rgba(4,2,1,0.98))',
          border: '1px solid rgba(226,201,138,0.14)',
        }}
      >
        {/* Image well — inset within the mat */}
        <div
          style={{
            position: 'absolute',
            inset: 7,
            overflow: 'hidden',
            background: src
              ? 'transparent'
              : 'radial-gradient(ellipse 80% 80% at 50% 42%, rgba(20,12,5,0.52) 0%, rgba(5,3,1,0.78) 100%)',
          }}
        >
          {src && (
            <>
              <img
                src={src}
                alt={label}
                className="gl-portrait-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.75) saturate(0.82)',
                  transition: 'filter 0.32s ease',
                }}
              />
              {/* Warm amber cast — matches the lantern-lit room lighting */}
              <div
                aria-hidden="true"
                className="gl-portrait-tint"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(160deg, rgba(140,80,25,0.28) 0%, rgba(60,30,10,0.22) 100%)',
                  mixBlendMode: 'multiply',
                  transition: 'opacity 0.32s ease',
                  pointerEvents: 'none',
                }}
              />
              {/* Inner vignette — softens the edges into the mat */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(3,2,1,0.65) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}

          {/* Placeholder when no image — shows just enough to see the frame shape */}
          {!src && (
            <>
              {/* Mat inset line */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 6,
                  border: '1px solid rgba(226,201,138,0.07)',
                }}
              />
              {/* Centre dot — minimal, almost invisible */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'rgba(226,201,138,0.11)',
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Outer frame border — thin antique-gold molding, warms on hover via CSS */}
      <div
        className="gl-frame-outer"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid var(--gold-border)',
          pointerEvents: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />

      {/* Brass tacks — pin the portrait to the wall, top corners only */}
      <div aria-hidden="true" className="gl-tack" style={{ top: 5, left: 8 }} />
      <div aria-hidden="true" className="gl-tack" style={{ top: 5, right: 8 }} />

      {/* Nameplate — hidden by default, fades in on hover */}
      <div
        className="gl-label"
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            padding: '4px 10px',
            background: 'rgba(4,2,1,0.85)',
            border: '1px solid var(--gold-border-soft)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '7px',
              letterSpacing: '0.22em',
              color: 'rgba(226,201,138,0.72)',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </p>
        </div>
      </div>
    </Frame>
  );
}

// Soft warm glow beneath the frame cluster — grounds the portraits on the
// wall without adding any visible object. Glow only, no geometry.
function WallGlow() {
  return (
    <div className="gl-glow" aria-hidden="true" style={{
      position: 'absolute',
      left: '-34%',
      width: '62%',
      bottom: 'clamp(-30px, -5vw, -18px)',
      height: 'clamp(130px, 26vw, 210px)',
      background: 'radial-gradient(ellipse 68% 72% at 50% 100%, rgba(226,162,60,0.09) 0%, rgba(226,162,60,0.04) 42%, rgba(226,162,60,0.015) 65%, transparent 82%)',
      filter: 'blur(8px)',
      pointerEvents: 'none',
    }} />
  );
}

// Staggered salon-wall placement — deliberately uneven heights/sizes so the
// three frames read as hung on a wall, not laid out in a straight row.
const WALL_SLOTS = [
  { className: 'gl-wall-frame-a', top: '5%', left: '-30%', height: '40%', rotate: '-2deg' },
  { className: 'gl-wall-frame-b', top: '7%', left: '2%', height: '46%', rotate: '1.5deg' },
  { className: 'gl-wall-frame-c', top: '50%', left: '-23%', height: '38%', rotate: '-1deg' },
] as const;

function WallSlot({
  slot,
  children,
}: {
  slot: (typeof WALL_SLOTS)[number];
  children: ReactNode;
}) {
  return (
    <div
      className={`gl-wall-frame ${slot.className}`}
      style={{
        position: 'absolute',
        top: slot.top,
        left: slot.left,
        height: slot.height,
        width: 'auto',
        aspectRatio: '3 / 4',
        transform: `rotate(${slot.rotate})`,
      }}
    >
      {children}
    </div>
  );
}

export default function Gallery() {
  // null = still loading, [] = fetched but empty/failed (fallback to placeholders)
  const [mints, setMints] = useState<RecentMint[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/recent-mints')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setMints(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setMints([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = mints === null;
  const hasMints = Array.isArray(mints) && mints.length > 0;

  const wallItems = isLoading
    ? COLLECTION_CARDS.map(({ id }) => ({
      key: id,
      label: `OG Peanut #${id}`,
      src: '',
      href: undefined as string | undefined,
      loading: true,
    }))
    : hasMints
      ? mints!.map((mint) => ({
        key: mint.mintAddress,
        label: mint.name,
        src: mint.image,
        href: 'https://www.launchmynft.io/mint/peanutprotocol',
        loading: false,
      }))
      : COLLECTION_CARDS.map(({ id, src }) => ({
        key: id,
        label: `OG Peanut #${id}`,
        src,
        href: undefined as string | undefined,
        loading: false,
      }));

  return (
    <section
      id="gallery"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        color: '#e2c98a',
        fontFamily: 'var(--font-cinzel)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Wall-mounted frame: the wrapper (.gl-wall-frame) holds position/rotation,
           the frame itself only scales — so hover doesn't fight the salon tilt */
        .gl-wall-frame {
          transition: transform 0.32s ease, z-index 0s;
        }
        .gl-wall-frame:hover {
          z-index: 3;
        }
        .gl-frame {
          transition: transform 0.32s ease, box-shadow 0.32s ease;
          cursor: default;
        }
        .gl-frame:hover {
          transform: scale(1.06);
          box-shadow:
            5px 10px 40px rgba(0,0,0,0.82),
            -2px -3px 12px rgba(0,0,0,0.42),
            0 0 30px 6px rgba(226,201,138,0.16) !important;
        }
        .gl-frame:hover .gl-frame-outer {
          border-color: var(--gold-border-strong) !important;
          box-shadow: 0 0 6px 1px rgba(226,201,138,0.35);
        }
        /* Portrait brightens slightly on hover — stays dim/warm, never full-color */
        .gl-frame:hover .gl-portrait-img {
          filter: brightness(0.88) saturate(0.9);
        }
        .gl-frame:hover .gl-portrait-tint {
          opacity: 0.7;
        }
        /* Brass tacks — small, dulled gold, pinning the frame to the wall */
        .gl-tack {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #e9d29a 0%, #b3873f 55%, #5e3f18 100%);
          box-shadow: 0 1px 1.5px rgba(0,0,0,0.65), inset 0 0 1px rgba(255,255,255,0.35);
          pointer-events: none;
        }
        /* Nameplate fade-in */
        .gl-label {
          opacity: 0;
          transition: opacity 0.26s ease;
        }
        .gl-frame:hover .gl-label {
          opacity: 1;
        }
        /* Loading state: gentle breathing glow, no spinner */
        .gl-frame-loading {
          animation: gl-pulse 1.8s ease-in-out infinite;
        }
        @keyframes gl-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        /* Recent-mint wall cluster (desktop): fixed-height stage the three
           absolutely-positioned frames hang inside */
        .gl-wall {
          position: relative;
          width: 100%;
          height: clamp(300px, 30vw, 440px);
        }
        /* CTA button */
        .gl-btn:hover {
          background: rgba(226,201,138,0.13) !important;
          border-color: rgba(226,201,138,0.78) !important;
        }
        /* Responsive */
        @media (max-width: 767px) {
          .gl-grid    { grid-template-columns: 1fr !important; gap: 40px !important; }
          .gl-content { padding: 80px 24px 60px !important; }
          /* Wall cluster collapses to a simple stacked row below the text —
             no absolute positioning, no rotation, no crowding on small screens */
          .gl-wall {
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 22px !important;
          }
          .gl-wall-frame {
            position: static !important;
            top: auto !important;
            left: auto !important;
            width: 58% !important;
            height: auto !important;
            transform: none !important;
          }
          /* Frames are centered in a static column here, so the glow re-centers
             under the stack instead of using the desktop cluster offset. */
          .gl-glow {
            left: 50% !important;
            width: 78% !important;
            transform: translateX(-50%) !important;
          }
        }
        @media (max-width: 479px) {
          .gl-wall-frame { width: 68% !important; }
        }
      `}</style>

      {/* Full-bleed background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/gallery-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Overlay: left band for text, gentle vignette, centre stays open */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: [
            'linear-gradient(100deg, rgba(5,3,2,0.9) 0%, rgba(5,3,2,0.6) 28%, rgba(5,3,2,0.18) 48%, rgba(5,3,2,0.28) 72%, rgba(5,3,2,0.5) 100%)',
            'linear-gradient(to top, rgba(5,3,2,0.65) 0%, rgba(5,3,2,0.12) 22%, transparent 38%)',
          ].join(', '),
        }}
      />

      {/* ── Main content ── */}
      <div
        className="gl-content"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          padding: '90px 6vw 60px',
        }}
      >
        <div
          className="gl-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '56px',
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {/* ── Left: text content, pulled up toward the top of the wall ── */}
          <div style={{ paddingTop: '2vh' }}>
            <p style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(226,201,138,0.45)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              // THE COLLECTION
            </p>

            <h2 className="gold-title" style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              lineHeight: 1.08,
              marginBottom: '22px',
            }}>
              Gallery
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
              <div className="gold-divider" />
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(226,201,138,0.45)' }} />
            </div>

            <p style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '0.98rem',
              lineHeight: 1.82,
              color: 'rgba(226,201,138,0.7)',
              letterSpacing: '0.01em',
              marginBottom: '36px',
              maxWidth: '360px',
            }}>
              Peanut Protocol is a crew of survivors, raiders, rebels, and misfits built for a world after everything cracked.
            </p>

            <a
              href="https://www.launchmynft.io/mint/peanutprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="gl-btn cta-btn"
              style={{
                display: 'inline-block',
                padding: '15px 40px',
                border: '1px solid rgba(226,201,138,0.44)',
                color: '#e2c98a',
                fontSize: '0.78rem',
                letterSpacing: '0.2em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 700,
                background: 'rgba(226,201,138,0.05)',
              }}
            >
              View Collection
            </a>
          </div>

          {/* ── Right: recent mints, staggered on the back-right wall ── */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="gl-wall">
              <WallGlow />
              {wallItems.map((item, i) => (
                <WallSlot key={item.key} slot={WALL_SLOTS[i]}>
                  <FramedPortrait
                    label={item.label}
                    src={item.src}
                    href={item.href}
                    loading={item.loading}
                  />
                </WallSlot>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
