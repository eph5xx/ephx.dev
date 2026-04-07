export function GradientMesh() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Blob 1: deep blue, upper-left quadrant */}
      <div className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
      {/* Blob 2: purple, right side vertically centered */}
      <div className="absolute -right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-purple-500/15 blur-[100px]" />
      {/* Blob 3: indigo, bottom-center offset left */}
      <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[140px]" />
    </div>
  );
}
