export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#050510]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-[0_0_20px_rgba(168,85,247,0.4)]"></div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold tracking-tight text-white animate-pulse">VIGEN</h2>
          <p className="text-sm text-zinc-400">Loading your creative engine...</p>
        </div>
      </div>
    </div>
  );
}
