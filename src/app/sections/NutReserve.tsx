const CARDS = [
  {
    id: 'earn',
    num: '01',
    title: 'Earn Nutshells',
    body: 'Show up, take part, and stack Nutshells through community activity.',
  },
  {
    id: 'quests',
    num: '02',
    title: 'Complete Quests',
    body: 'Take on missions, challenges, and event tasks to earn bonus Nutshells.',
  },
  {
    id: 'redeem',
    num: '03',
    title: 'Redeem Rewards',
    body: 'Use your Nutshells for perks, entries, drops, and other community rewards.',
  },
  {
    id: 'play',
    num: '04',
    title: 'Play & Compete',
    body: 'Join games, tournaments, and leaderboards built for the OG Peanut community.',
  },
];

export default function NutReserve() {
  return (
    <section
      id="nut-reserve"
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
        .nr-btn:hover {
          background: rgba(226,201,138,0.13) !important;
          border-color: rgba(226,201,138,0.78) !important;
        }
        @media (max-width: 767px) {
          .nr-content-pad { padding: 80px 24px 40px !important; }
          .nr-left { max-width: 100% !important; }
          .nr-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 479px) {
          .nr-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Full-bleed background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/nut-reserve-command-center.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Layered dark overlay:
          left band → text readable; bottom band → card strip readable;
          right and top stay light so radio/map/lantern show through */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: [
            'linear-gradient(105deg, rgba(5,3,2,0.93) 0%, rgba(5,3,2,0.72) 32%, rgba(5,3,2,0.22) 52%, rgba(5,3,2,0.06) 68%)',
            'linear-gradient(to top, rgba(5,3,2,0.97) 0%, rgba(5,3,2,0.78) 14%, rgba(5,3,2,0.18) 28%, transparent 42%)',
          ].join(', '),
        }}
      />

      {/* Top fade — lets the section emerge from the hero's black fade above it,
          instead of starting with a hard edge. Strongest at the very top,
          fully clear by ~22% down. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          insetInline: 0,
          top: 0,
          height: '22vh',
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.12) 80%, transparent 100%)',
        }}
      />

      {/* ── Main content: eyebrow / title / intro / CTA ── */}
      <div
        className="nr-content-pad"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '100px 6vw 40px',
        }}
      >
        <div
          className="nr-left"
          style={{ maxWidth: '500px' }}
        >
          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(226,201,138,0.48)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            // REWARDS HUB
          </p>

          {/* Title */}
          <h2 className="gold-title" style={{
            fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            lineHeight: 1.08,
            marginBottom: '22px',
          }}>
            Nut Reserve
          </h2>

          {/* Decorative rule + dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <div className="gold-divider" />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(226,201,138,0.45)' }} />
          </div>

          {/* Intro */}
          <p style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '0.98rem',
            lineHeight: 1.82,
            color: 'rgba(226,201,138,0.7)',
            letterSpacing: '0.01em',
            marginBottom: '36px',
          }}>
            The Nut Reserve keeps the movement running. Complete quests, earn Nutshells, join events, and stay plugged into everything happening inside OG Peanut.
          </p>

          {/* CTA */}
          <a
            href="https://discord.com/invite/UPR3FZBCzn"
            target="_blank"
            rel="noopener noreferrer"
            className="nr-btn cta-btn"
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
            Enter the Reserve
          </a>
        </div>
      </div>

      {/* ── Mission-panel card strip (bottom) ──
          gap: 1px + grid background acts as the gold seam between panels */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="nr-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'var(--gold-border-soft)',
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              style={{
                background: 'rgba(6,3,1,0.82)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderTop: '1px solid var(--gold-border)',
                padding: '22px 24px 20px',
              }}
            >
              {/* Number */}
              <p style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '9px',
                letterSpacing: '0.22em',
                color: 'rgba(226,201,138,0.3)',
                marginBottom: '8px',
              }}>
                {card.num}
              </p>

              {/* Title */}
              <h3 style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.07em',
                color: '#e2c98a',
                marginBottom: '8px',
              }}>
                {card.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '0.76rem',
                lineHeight: 1.65,
                color: 'rgba(226,201,138,0.46)',
                letterSpacing: '0.01em',
              }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
