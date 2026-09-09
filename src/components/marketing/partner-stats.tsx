export function PartnerStatsBar() {
  return (
    <div className="border-t border-b border-indigo/10 bg-paper py-8">
      <div className="container-shell">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-indigo/10">
          <div className="flex flex-col">
            <span className="text-4xl font-display font-bold text-indigo">1,200+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink/80 mt-2">Verified Saathis</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-display font-bold text-coral-text">15,000+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink/80 mt-2">Happy Pets</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-display font-bold text-leaf">45+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink/80 mt-2">Cities in India</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-display font-bold text-[#8C6212]">4.9/5</span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink/80 mt-2">Average Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
