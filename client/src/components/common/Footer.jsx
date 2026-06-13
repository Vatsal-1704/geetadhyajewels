import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <h3>Geetadhya<span className="footer-brand-gold">Jewels</span></h3>
            <p className="footer-brand-tagline">ELEGANT IMITATION JEWELLERY</p>
            <p className="footer-brand-description">Premium imitation jewellery crafted for every occasion. Affordable luxury, timeless elegance.</p>
            <div className="footer-social">
              {[{ icon: FiInstagram, href: "#" }, { icon: FiFacebook, href: "#" }, { icon: FaWhatsapp, href: "#" }, { icon: FiYoutube, href: "#" }].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="footer-social-icon"><Icon size={16} /></a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {[["Home", "/"], ["About Us", "/about"], ["Collections", "/collections"], ["Offers", "/offers"], ["Track Order", "/track-order"], ["Contact Us", "/contact"]].map(([label, to]) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-section">
            <h4>Customer Care</h4>
            <ul className="footer-links">
              {[["FAQ", "/faq"], ["Shipping Policy", "/shipping-policy"], ["Return Policy", "/return-policy"], ["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms"]].map(([label, to]) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Get in Touch</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <FiMapPin className="footer-contact-icon" size={18} />
                <p className="footer-contact-text">GeetadhyaJewels Store,<br/>Your City, India</p>
              </div>
              <div className="footer-contact-item">
                <FiPhone className="footer-contact-icon" size={18} />
                <a href="tel:+91XXXXXXXXXX" className="footer-contact-link">+91 XXXXXXXXXX</a>
              </div>
              <div className="footer-contact-item">
                <FiMail className="footer-contact-icon" size={18} />
                <a href="mailto:hello@geetadhyajewels.com" className="footer-contact-link">hello@geetadhyajewels.com</a>
              </div>
            </div>
            {/* Newsletter */}
            <div className="footer-newsletter">
              <label className="footer-newsletter-label">Subscribe for exclusive deals</label>
              <form className="footer-newsletter-form" onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]')?.value;
                if (email) {
                  e.target.reset();
                  // API call would go here
                }
              }}>
                <input type="email" placeholder="Your email" className="footer-newsletter-input" required />
                <button type="submit" className="footer-newsletter-button">→</button>
              </form>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />
        <div className="footer-bottom">
          <p>© 2024 GeetadhyaJewels. All rights reserved.</p>
          <div className="footer-payments">
            <span className="footer-payments-label">Payments accepted:</span>
            {["UPI", "Visa", "Mastercard", "RuPay", "COD"].map(p => (
              <span key={p} className="footer-payment-badge">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
