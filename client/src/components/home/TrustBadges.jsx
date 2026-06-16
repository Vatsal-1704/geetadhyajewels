import "./TrustBadges.css";

const badges = [
  { icon: "🚚", title: "Free Shipping",    desc: "On orders above ₹999" },
  { icon: "↩️", title: "Easy Returns",     desc: "7-day hassle-free" },
  { icon: "🔒", title: "Secure Payment",   desc: "100% safe & encrypted" },
  { icon: "💎", title: "Premium Quality",  desc: "Long-lasting & skin-friendly" },
];

export default function TrustBadges() {
  return (
    <section className="trust-badges">
      <div className="trust-badges-container">
        {badges.map((b, i) => (
          <div key={b.title} className="trust-badge" style={{ "--i": i }}>
            <div className="trust-badge-icon-wrap">
              <span className="trust-badge-icon">{b.icon}</span>
            </div>
            <p className="trust-badge-title">{b.title}</p>
            <p className="trust-badge-desc">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
