import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import "../styles/info-pages.css";

const faqs = [
  { q: "What is imitation jewellery?", a: "Imitation jewellery is crafted from non-precious metals and stones that mimic the appearance of fine jewellery. Our pieces use high-quality brass with gold/silver plating and premium stones." },
  { q: "How long does shipping take?", a: "Standard delivery: 5–7 business days. Express delivery: 2–3 business days. Free standard shipping on all orders above ₹999." },
  { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy. Products must be unused and in original packaging. Customised or sale items are non-returnable." },
  { q: "How should I care for my jewellery?", a: "Avoid contact with water, perfume, and chemicals. Store in a dry place. Polish gently with a soft cloth. Keep away from direct sunlight for prolonged periods." },
  { q: "Is the jewellery skin-safe?", a: "Yes! All our jewellery is nickel-free and hypoallergenic. We use skin-safe materials suitable for sensitive skin." },
  { q: "Do you offer COD?", a: "Yes, Cash on Delivery is available on all orders. A small COD handling fee may apply." },
  { q: "Can I track my order?", a: "Absolutely! Use the 'Track Order' page and enter your Order ID to see real-time shipping updates." },
  { q: "Do you have bulk/wholesale pricing?", a: "Yes! For bulk orders (10+ pieces), please WhatsApp us or email hello@geetadhyajewels.com for special pricing." },
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Help Centre</p>
        <h1 className="font-serif text-4xl text-brand-black">Frequently Asked Questions</h1>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
              <span className="font-medium text-sm pr-4">{faq.q}</span>
              {open === i ? <FiChevronUp className="text-brand-gold flex-shrink-0" /> : <FiChevronDown className="text-gray-400 flex-shrink-0" />}
            </button>
            {open === i && <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50">{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
