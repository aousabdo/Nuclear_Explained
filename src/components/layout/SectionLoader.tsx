export function SectionLoader() {
  return (
    <div className="relative w-full py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-white/5 rounded-lg" />
        <div className="h-4 w-96 bg-white/3 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-40 rounded-2xl bg-white/3 border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}
