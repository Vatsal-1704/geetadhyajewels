import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center bg-brand-cream">
      <div>
        <div className="text-8xl mb-6">💎</div>
        <h1 className="font-serif text-6xl text-brand-gold mb-4">404</h1>
        <h2 className="font-serif text-2xl text-brand-black mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">Looks like this page wandered off like a lost earring! Let's get you back home.</p>
        <Link to="/" className="inline-block bg-brand-gold text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-gold-dark transition-all">← Back to Home</Link>
      </div>
    </div>
  );
}
