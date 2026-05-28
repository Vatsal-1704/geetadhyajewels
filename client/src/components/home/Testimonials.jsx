import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
    <section className="py-16 px-4 bg-brand-black">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">❤️ Happy Customers</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-white mb-12">What Our Customers Say</h2>
        <div className="relative">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12">
            <div className="flex justify-center mb-4">{"★".repeat(reviews[idx].rating).split("").map((s, i) => <span key={i} className="text-brand-gold text-2xl">{s}</span>)}</div>
            <p className="text-gray-300 text-lg italic mb-8 leading-relaxed">"{reviews[idx].text}"</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-white text-xl font-bold">{reviews[idx].avatar}</div>
              <div className="text-left">
                <p className="text-white font-semibold">{reviews[idx].name}</p>
                <p className="text-gray-400 text-sm">{reviews[idx].city}</p>
              </div>
            </div>
          </div>
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-brand-gold text-white rounded-full p-2 hover:bg-brand-gold-dark"><FiChevronLeft size={18} /></button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-brand-gold text-white rounded-full p-2 hover:bg-brand-gold-dark"><FiChevronRight size={18} /></button>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all ${i === idx ? "w-8 h-2 bg-brand-gold" : "w-2 h-2 bg-white/30"}`} />)}
        </div>
      </div>
    </section>
  );
}
