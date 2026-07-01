const LINKS = [
  { label: 'Join The Discord',     href: 'https://discord.com/invite/UPR3FZBCzn' },
  { label: 'Follow on X',      href: 'https://x.com/OgPeanut_solana' }
] as const;

export default function Outpost() {
  return (
    <section
      id="outpost"
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
        .op-btn:hover {
          background: rgba(226,201,138,0.13) !important;
          border-color: rgba(226,201,138,0.78) !important;
        }
        @media (max-width: 767px) {
          .op-content { padding: 80px 24px 60px !important; }
          .op-left    { max-width: 100% !important; }
          .op-buttons { flex-direction: column !important; }
          .op-buttons a { width: 100% !important; text-align: center !important; }
        }
      `}</style>

      {/* Full-bleed background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/outpost-bg.png')",
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
            'linear-gradient(to top, rgba(5,3,2,0.6) 0%, rgba(5,3,2,0.18) 18%, transparent 36%)',
          ].join(', '),
        }}
      />

      {/* Top fade — softens the hard edge from Gallery above, letting the
          Outpost background emerge from darkness. Strongest at the very
          top, fully clear by ~22% down. */}
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

      {/* ── Content: left-anchored, gate and path stay open on right ── */}
      <div
        className="op-content"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          padding: '100px 6vw 60px',
        }}
      >
        <div className="op-left" style={{ maxWidth: '480px' }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(226,201,138,0.45)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            // FINAL CHECKPOINT
          </p>

          {/* Title */}
          <h2 className="gold-title" style={{
            fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            lineHeight: 1.08,
            marginBottom: '22px',
          }}>
            Outpost
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
            marginBottom: '36px',
          }}>
            Back above ground, the signal keeps moving. Join the Discord, follow
            OG Peanut on X, or view the collection.
          </p>

          {/* CTA buttons */}
          <div
            className="op-buttons"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="op-btn cta-btn"
                style={{
                  display: 'inline-block',
                  padding: '15px 32px',
                  border: '1px solid rgba(226,201,138,0.44)',
                  color: '#e2c98a',
                  fontSize: '0.78rem',
                  letterSpacing: '0.2em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-cinzel)',
                  fontWeight: 700,
                  background: 'rgba(226,201,138,0.05)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
