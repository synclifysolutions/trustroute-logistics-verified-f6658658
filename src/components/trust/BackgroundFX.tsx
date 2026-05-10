export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-violet-600/30 blur-3xl animate-orb" />
      <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-cyan-500/20 blur-3xl animate-orb" style={{ animationDelay: "-4s" }} />
      <div className="absolute -bottom-32 left-1/3 h-[420px] w-[420px] rounded-full bg-indigo-600/25 blur-3xl animate-orb" style={{ animationDelay: "-8s" }} />
    </div>
  );
}
