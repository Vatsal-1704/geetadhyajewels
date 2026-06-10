import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Testimonials.css";

const reviews = [
  { name: "Priya Sharma", city: "Mumbai", rating: 5, text: "Absolutely gorgeous jewellery! The quality is amazing for the price. Got so many compliments at my cousin's wedding. Will definitely order again!", avatar: "P" },
  { name: "Ananya Reddy", city: "Hyderabad", rating: 5, text: "I was skeptical about imitation jewellery but GeetadhyaJewels changed my mind. The bridal set I ordered looks exactly like real gold. Stunning!", avatar: "A" },
  { name: "Meera Patel", city: "Ahmedabad", rating: 5, text: "Fast delivery, beautiful packaging, and the earrings are even prettier in person! Great customer service too. Highly recommend!", avatar: "M" },
  { name: "Deepika Nair", city: "Kochi", rating: 5, text: "The oxidised bangles I bought are perfect for everyday wear and festive occasions. Love how they don't tarnish quickly. Great purchase!", avatar: "D" },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(p => (p - 1 + reviews.length) % reviews.length);
  const next = () => setIdx(p => (p + 1) % reviews.length);

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <p className="testimonials-label">❤️ Happy Customers</p>
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <div className="testimonials-carousel">
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {Array(reviews[idx].rating).fill("★").map((s, i) => (
                <span key={i} className="testimonial-star">{s}</span>
              ))}
            </div>
            <p className="testimonial-text">"{reviews[idx].text}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{reviews[idx].avatar}</div>
              <div className="testimonial-info">
                <p className="testimonial-name">{reviews[idx].name}</p>
                <p className="testimonial-city">{reviews[idx].city}</p>
              </div>
            </div>
          </div>
          <button onClick={prev} className="testimonial-nav-button testimonial-nav-prev">
            <FiChevronLeft size={18} />
          </button>
          <button onClick={next} className="testimonial-nav-button testimonial-nav-next">
            <FiChevronRight size={18} />
          </button>
        </div>
        <div className="testimonial-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`testimonial-dot ${i === idx ? "testimonial-dot-active" : ""}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
