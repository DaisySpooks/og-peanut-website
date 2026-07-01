export default function RoomTransition() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: '5vh',
        position: 'relative',
        zIndex: 5,
        overflow: 'visible',
      }}
    >
      {/* Small seam between rooms — a soft dip in brightness, not a corridor. */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: '-6vh', bottom: '-6vh',
        background: `linear-gradient(to bottom,
          transparent 0%,
          rgba(3,2,1,0.18) 22%,
          rgba(3,2,1,0.42) 38%,
          rgba(3,2,1,0.62) 50%,
          rgba(3,2,1,0.42) 62%,
          rgba(3,2,1,0.18) 78%,
          transparent 100%)`,
      }} />
    </div>
  );
}
