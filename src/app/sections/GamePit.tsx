const FEATURES = [
  ['01', 'Peaqualizer'],
  ['02', 'Poker'],
  ['03', 'Tournaments'],
  ['04', 'More to Come'],
] as const;

export default function GamePit() {
  return (
    <section
      id="game-pit"
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
        .gp-btn:hover {
          background: rgba(226,201,138,0.13) !important;
          border-color: rgba(226,201,138,0.78) !important;
        }
        @media (max-width: 767px) {
          .gp-content { padding: 80px 24px 60px !important; }
          .gp-left    { max-width: 100% !important; }
        }
      `}</style>

      {/* Full-bleed background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/game-pit-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Overlay: left band for text, gentle bottom anchor, right stays open */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: [
            'linear-gradient(105deg, rgba(5,3,2,0.91) 0%, rgba(5,3,2,0.68) 30%, rgba(5,3,2,0.18) 50%, transparent 64%)',
            'linear-gradient(to top, rgba(5,3,2,0.55) 0%, rgba(5,3,2,0.18) 18%, transparent 36%)',
          ].join(', '),
        }}
      />

      {/* ── Content: upper-left so game table stays visible below ── */}
      <div
        className="gp-content"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          padding: '100px 6vw 60px',
        }}
      >
        <div className="gp-left" style={{ maxWidth: '460px' }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(226,201,138,0.45)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            // THE ARCADE
          </p>

          {/* Title */}
          <h2 className="gold-title" style={{
            fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            lineHeight: 1.08,
            marginBottom: '22px',
          }}>
            Game Pit
          </h2>

          {/* Decorative rule */}
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
            marginBottom: '32px',
          }}>
            From Peaqualizer to poker nights and community competitions, the Game
            Pit is where The Reserve comes to play.
          </p>

          {/* Feature list — arcade select screen style */}
          <div style={{ marginBottom: '36px' }}>
            {FEATURES.map(([num, name], i) => (
              <div
                key={num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '9px 0',
                  borderBottom:
                    i < FEATURES.length - 1
                      ? '1px solid rgba(226,201,138,0.08)'
                      : 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  color: 'rgba(226,201,138,0.32)',
                  flexShrink: 0,
                }}>
                  {num}
                </span>
                <span style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  color: 'rgba(226,201,138,0.82)',
                }}>
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://discord.com/invite/UPR3FZBCzn"
            target="_blank"
            rel="noopener noreferrer"
            className="gp-btn cta-btn"
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
            Enter the Game Pit
          </a>
        </div>
      </div>
    </section>
  );
}
