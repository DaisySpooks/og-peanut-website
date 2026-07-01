const EARN_ITEMS = ['Complete quests', 'Join events', 'Play games', 'Stay active'];
const USE_ITEMS  = ['Redeem rewards', 'Enter games', 'Unlock perks', 'Compete for prizes'];

function LedgerPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      style={{
        background: 'rgba(5,3,1,0.46)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderTop: '1px solid var(--gold-border)',
        borderLeft: '1px solid var(--gold-border-faint)',
        borderRight: '1px solid var(--gold-border-faint)',
        borderBottom: '1px solid var(--gold-border-faint)',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '12px 16px 10px',
          borderBottom: '1px solid var(--gold-border-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Vertical accent bar */}
        <div
          aria-hidden="true"
          style={{
            width: '2px',
            height: '18px',
            background: 'rgba(226,201,138,0.55)',
            flexShrink: 0,
          }}
        />
        <h3
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#e2c98a',
          }}
        >
          {title}
        </h3>
      </div>

      {/* Ledger entries */}
      <div>
        {items.map((item, i) => (
          <div
            key={item}
            style={{
              padding: '9px 14px',
              borderBottom:
                i < items.length - 1 ? '1px solid var(--gold-border-faint)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '11px',
                color: 'rgba(226,201,138,0.38)',
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              —
            </span>
            <span
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '0.83rem',
                lineHeight: 1.4,
                color: 'rgba(226,201,138,0.72)',
                letterSpacing: '0.01em',
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TheHoard() {
  return (
    <section
      id="the-hoard"
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
        @media (max-width: 679px) {
          .th-content { padding: 80px 24px 40px !important; }
          .th-panels  { grid-template-columns: 1fr !important; max-width: 340px !important; }
        }
      `}</style>

      {/* Full-bleed background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/the-hoard-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Dark overlay:
          top/bottom bands → title & tagline readable
          centre stays lighter → image shows through
          radial vignette → edges darkened */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: [
            'linear-gradient(to bottom, rgba(5,3,2,0.92) 0%, rgba(5,3,2,0.52) 20%, rgba(5,3,2,0.18) 40%, rgba(5,3,2,0.18) 60%, rgba(5,3,2,0.58) 80%, rgba(5,3,2,0.96) 100%)',
            'radial-gradient(ellipse 95% 85% at 50% 50%, transparent 22%, rgba(5,3,2,0.62) 100%)',
          ].join(', '),
        }}
      />

      {/* ── Main content ── */}
      <div
        className="th-content"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '100px 6vw 48px',
        }}
      >
        {/* Title + intro */}
        <div style={{ textAlign: 'left', maxWidth: '520px' }}>
          <p
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(226,201,138,0.45)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            // NUTSHELLS
          </p>

          <h2
            className="gold-title"
            style={{
              fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              lineHeight: 1.08,
              marginBottom: '22px',
            }}
          >
            The Stash
          </h2>

          {/* Decorative rule */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '22px',
            }}
          >
            <div className="gold-divider" />
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(226,201,138,0.45)',
              }}
            />
          </div>

          <p
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '0.96rem',
              lineHeight: 1.82,
              color: 'rgba(226,201,138,0.68)',
              letterSpacing: '0.01em',
            }}
          >
           Every mission, event, and game leaves a mark. Stack Nutshells as you participate, then turn community action into perks.
          </p>
        </div>

        {/* Ledger panels — narrow, left-anchored, right side stays open */}
        <div
          className="th-panels"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 248px))',
            gap: '14px',
          }}
        >
          <LedgerPanel title="Earn Nutshells" items={EARN_ITEMS} />
          <LedgerPanel title="Use Nutshells"  items={USE_ITEMS}  />
        </div>
      </div>

      {/* ── Tagline strip ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '18px 24px',
          textAlign: 'center',
          borderTop: '1px solid var(--gold-border-soft)',
          background: 'rgba(5,3,2,0.78)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '10px',
            letterSpacing: '0.35em',
            color: 'rgba(226,201,138,0.36)',
            textTransform: 'uppercase',
          }}
        >
          Track. Stack. Spend. Repeat.
        </p>
      </div>
    </section>
  );
}
