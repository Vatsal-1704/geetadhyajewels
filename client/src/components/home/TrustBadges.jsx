import "./TrustBadges.css";

export default function TrustBadges() {
  const badges = [
    { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free returns" },
    { icon: "🔒", title: "Secure Payment", desc: "100% safe & encrypted" },
    { icon: "💎", title: "Premium Quality", desc: "Long-lasting & skin-friendly" },
  ];

  return (
    <section className="trust-badges">
      <div className="trust-badges-container">
        {badges.map((b) => (
          <div key={b.title} className="trust-badge">
            <span className="trust-badge-icon">{b.icon}</span>
            <div className="trust-badge-content">
              <p className="trust-badge-title">{b.title}</p>
              <p className="trust-badge-desc">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
