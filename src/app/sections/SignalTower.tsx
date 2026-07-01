const SCHEDULE = [
  ['Wednesday', 'Peanut’s Practice', '8pm CET / 2pm EST'],
  ['Friday', 'Peanut Pub', '10pm CET / 4pm EST'],
  ['Sunday', 'Peanut Park', '8pm CET / 2pm EST'],
] as const;

export default function SignalTower() {
  return (
    <section
      id="signal-tower"
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
        .st-btn:hover {
          background: rgba(226,201,138,0.13) !important;
          border-color: rgba(226,201,138,0.78) !important;
        }
        @media (max-width: 767px) {
          .st-content { padding: 80px 24px 60px !important; }
          .st-left    { max-width: 100% !important; }
        }
      `}</style>

      {/* Full-bleed background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/signal-tower-bg.png')",
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

      {/* ── Content: upper-left so signal desk stays visible ── */}
      <div
        className="st-content"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          padding: '100px 6vw 60px',
        }}
      >
        <div className="st-left" style={{ maxWidth: '460px' }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(226,201,138,0.45)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            // BROADCAST HUB
          </p>

          {/* Title */}
          <h2 className="gold-title" style={{
            fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            lineHeight: 1.08,
            marginBottom: '22px',
          }}>
            Signal Tower
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
            Follow the weekly Spaces schedule, catch community updates, and tune into OG Peanut Radio.
          </p>

          {/* Broadcast schedule card */}
          <div
            style={{
              marginBottom: '36px',
              background: 'linear-gradient(165deg, rgba(18,14,8,0.72) 0%, rgba(10,8,5,0.62) 100%)',
              border: '1px solid rgba(197,161,90,0.38)',
              borderRadius: '2px',
              boxShadow: '0 0 40px rgba(226,162,60,0.09), inset 0 1px 0 rgba(226,201,138,0.06)',
              padding: '22px 24px 8px',
              backdropFilter: 'blur(6px)',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '10px',
              letterSpacing: '0.28em',
              color: 'rgba(226,201,138,0.55)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Broadcast Schedule
            </p>

            {SCHEDULE.map(([day, event, time], i) => (
              <div
                key={day}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '14px 0',
                  borderBottom:
                    i < SCHEDULE.length - 1
                      ? '1px solid rgba(226,201,138,0.1)'
                      : 'none',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(226,201,138,0.4)',
                  }}>
                    {day}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    color: '#e2c98a',
                  }}>
                    {event}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.02em',
                  color: 'rgba(226,201,138,0.55)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  textAlign: 'right',
                }}>
                  {time}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://ogpeanut-radio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn cta-btn"
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
            Tune In
          </a>
        </div>
      </div>
    </section>
  );
}
