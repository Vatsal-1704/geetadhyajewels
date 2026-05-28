import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-white mb-2">Geetadhya<span className="text-brand-gold">Jewels</span></h3>
            <p className="text-xs text-brand-gold tracking-widest mb-4">ELEGANT IMITATION JEWELLERY</p>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">Premium imitation jewellery crafted for every occasion. Affordable luxury, timeless elegance.</p>
            <div className="flex gap-4">
              {[{ icon: FiInstagram, href: "#" }, { icon: FiFacebook, href: "#" }, { icon: FaWhatsapp, href: "#" }, { icon: FiYoutube, href: "#" }].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all"><Icon size={16} /></a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[["Home", "/"], ["About Us", "/about"], ["Collections", "/collections"], ["Offers", "/offers"], ["Track Order", "/track-order"], ["Contact Us", "/contact"]].map(([label, to]) => (
                <li key={to}><Link to={to} className="hover:text-brand-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              {[["FAQ", "/faq"], ["Shipping Policy", "/shipping-policy"], ["Return & Exchange", "/return-policy"], ["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms"]].map(([label, to]) => (
                <li key={to}><Link to={to} className="hover:text-brand-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">Get in Touch</h4>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3"><FiMapPin className="text-brand-gold mt-0.5 flex-shrink-0" /><p className="text-gray-400">GeetadhyaJewels Store,<br/>Your City, India</p></div>
              <div className="flex gap-3"><FiPhone className="text-brand-gold flex-shrink-0" /><a href="tel:+91XXXXXXXXXX" className="hover:text-brand-gold">+91 XXXXXXXXXX</a></div>
              <div className="flex gap-3"><FiMail className="text-brand-gold flex-shrink-0" /><a href="mailto:hello@geetadhyajewels.com" className="hover:text-brand-gold">hello@geetadhyajewels.com</a></div>
            </div>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2">Subscribe for exclusive deals</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 bg-white/10 text-white text-sm px-3 py-2 rounded-l outline-none placeholder:text-gray-500 focus:bg-white/15" />
                <button className="bg-brand-gold text-white px-3 py-2 rounded-r text-sm font-medium hover:bg-brand-gold-dark transition-colors">→</button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2024 GeetadhyaJewels. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Payments accepted:</span>
            {["UPI", "Visa", "Mastercard", "RuPay", "COD"].map(p => (
              <span key={p} className="bg-white/10 px-2 py-0.5 rounded text-xs">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
