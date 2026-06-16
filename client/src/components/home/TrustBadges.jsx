import "./TrustBadges.css";

const badges = [
  { icon: "🚚", title: "Free Shipping",   desc: "On orders above ₹999" },
  { icon: "↩️", title: "Easy Returns",    desc: "7-day hassle-free" },
  { icon: "🔒", title: "Secure Payment",  desc: "100% safe & encrypted" },
  { icon: "💎", title: "Premium Quality", desc: "Long-lasting & skin-friendly" },
];

export default function TrustBadges() {
  return (
    <section className="tb-strip">
      <div className="tb-strip__inner">
        {badges.map((b, i) => (
          <div key={b.title} className="tb-strip__item" style={{ "--i": i }}>
            <div className="tb-strip__icon-ring">
              <span className="tb-strip__icon">{b.icon}</span>
            </div>
            <p className="tb-strip__title">{b.title}</p>
            <p className="tb-strip__desc">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
