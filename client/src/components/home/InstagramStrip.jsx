import { FiInstagram } from "react-icons/fi";
import { placeholderImages } from "../../utils/placeholderImages";
import "./InstagramStrip.css";

const imgs = [
  placeholderImages.instagram.post1,
  placeholderImages.instagram.post2,
  placeholderImages.instagram.post3,
  placeholderImages.instagram.post4,
  placeholderImages.instagram.post5,
  placeholderImages.instagram.post6,
];

export default function InstagramStrip() {
  return (
    <section className="instagram-strip">
      <div className="instagram-strip-container">
        <div className="instagram-strip-header">
          <p className="instagram-strip-label">Follow Us</p>
          <h2 className="instagram-strip-title">@GeetadhyaJewels</h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="instagram-strip-link"
          >
            <FiInstagram /> Follow on Instagram
          </a>
        </div>
        <div className="instagram-strip-grid">
          {imgs.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="instagram-image"
            >
              <img
                src={src}
                alt={`Instagram ${i + 1}`}
                onError={e => { e.target.src = `https://via.placeholder.com/300x300/0a0a0a/d4af37?text=✨`; }}
              />
              <div className="instagram-overlay">
                <FiInstagram size={24} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
