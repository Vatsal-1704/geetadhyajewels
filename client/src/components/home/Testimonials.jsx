import { useState, useRef } from "react";
import { placeholderImages } from "../../utils/placeholderImages";
import "./Testimonials.css";

const reviews = [
  { name: "Priya Sharma", city: "Mumbai", rating: 5, text: "Absolutely gorgeous jewellery! The quality is amazing for the price. Got so many compliments at my cousin's wedding. Will definitely order again!", avatar: "P", avatarImage: placeholderImages.avatar.woman1 },
  { name: "Ananya Reddy", city: "Hyderabad", rating: 5, text: "I was skeptical about imitation jewellery but GeetadhyaJewels changed my mind. The bridal set I ordered looks exactly like real gold. Stunning!", avatar: "A", avatarImage: placeholderImages.avatar.woman2 },
  { name: "Meera Patel", city: "Ahmedabad", rating: 5, text: "Fast delivery, beautiful packaging, and the earrings are even prettier in person! Great customer service too. Highly recommend!", avatar: "M", avatarImage: placeholderImages.avatar.woman3 },
  { name: "Deepika Nair", city: "Kochi", rating: 5, text: "The oxidised bangles I bought are perfect for everyday wear and festive occasions. Love how they don't tarnish quickly. Great purchase!", avatar: "D", avatarImage: placeholderImages.avatar.woman1 },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const touchStart = useRef(null);

  const goTo = (i) => setIdx(i);
  const goNext = () => setIdx((p) => (p + 1) % reviews.length);
  const goPrev = () => setIdx((p) => (p - 1 + reviews.length) % reviews.length);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    touchStart.current = null;
  };

  const r = reviews[idx];

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <p className="testimonials-label">Happy Customers</p>
        <h2 className="testimonials-title">What Our Customers Say</h2>

        <div
          className="testimonial-slider"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="testimonial-card" key={idx}>
            <div className="testimonial-rating">
              {Array(r.rating).fill("★").map((s, i) => (
                <span key={i} className="testimonial-star">{s}</span>
              ))}
            </div>
            <p className="testimonial-text">"{r.text}"</p>
            <div className="testimonial-author">
              <img
                src={r.avatarImage}
                alt={r.name}
                className="testimonial-avatar-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="testimonial-avatar">{r.avatar}</div>
              <div className="testimonial-info">
                <p className="testimonial-name">{r.name}</p>
                <p className="testimonial-city">{r.city}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`testimonial-dot ${i === idx ? "testimonial-dot-active" : ""}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
