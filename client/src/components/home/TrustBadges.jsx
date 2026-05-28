export default function TrustBadges() {
  const badges = [
    { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free returns" },
    { icon: "🔒", title: "Secure Payment", desc: "100% safe & encrypted" },
    { icon: "💎", title: "Premium Quality", desc: "Long-lasting & skin-friendly" },
  ];
  return (
    <section className="py-10 px-4 bg-brand-cream border-y border-brand-gold/20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map(b => (
          <div key={b.title} className="flex items-center gap-3 text-left">
            <span className="text-3xl">{b.icon}</span>
            <div>
              <p className="font-semibold text-brand-black text-sm">{b.title}</p>
              <p className="text-gray-500 text-xs">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
