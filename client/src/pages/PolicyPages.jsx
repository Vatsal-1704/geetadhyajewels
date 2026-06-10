import "../styles/info-pages.css";

export function ShippingPolicy() {
  return (
    <div className="info-page">
      <h1 className="font-serif text-3xl text-brand-black mb-8">Shipping Policy</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Delivery Timelines</h2><p>Standard Delivery: 5–7 business days. Express Delivery: 2–3 business days. Orders placed before 2 PM IST are processed the same day.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Shipping Charges</h2><p>Free standard shipping on all orders above ₹999. Orders below ₹999 carry a flat ₹99 shipping charge. Express delivery is charged at ₹199 regardless of order value.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Tracking</h2><p>A tracking number will be shared via SMS/email once your order is dispatched. You can also track via our Order Tracking page.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Delivery Locations</h2><p>We deliver pan-India. For remote locations, delivery may take 1–2 additional days.</p></section>
      </div>
    </div>
  );
}

export function ReturnPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-brand-black mb-8">Return & Exchange Policy</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Return Window</h2><p>We accept returns within 7 days of delivery. Items must be unused, undamaged, and in original packaging with all tags intact.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Non-Returnable Items</h2><p>Customised orders, sale/offer items, and items showing signs of wear are not eligible for return.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Refund Process</h2><p>Once the returned item is received and inspected, refunds are processed within 5–7 business days to the original payment method.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">How to Initiate</h2><p>WhatsApp us at +91 XXXXXXXXXX or email hello@geetadhyajewels.com with your Order ID and reason for return.</p></section>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-brand-black mb-8">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p>Last updated: January 2024</p>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Information We Collect</h2><p>We collect your name, email, phone number, and delivery address to process your orders. Payment details are handled securely by Razorpay and are never stored on our servers.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">How We Use Your Data</h2><p>Your information is used solely for processing orders, sending delivery updates, and improving your experience. We do not sell your data to third parties.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Cookies</h2><p>We use cookies to enhance your browsing experience, remember cart items, and analyse website traffic. You can disable cookies in your browser settings.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Contact</h2><p>For privacy concerns, contact us at hello@geetadhyajewels.com</p></section>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-brand-black mb-8">Terms & Conditions</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p>By using GeetadhyaJewels, you agree to these terms.</p>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Use of Website</h2><p>This website is intended for personal, non-commercial use. You may not reproduce, distribute, or exploit any content without written permission.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Product Accuracy</h2><p>We strive to display product colours accurately, but slight variations may occur due to monitor settings. Product weights and dimensions are approximate.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Pricing</h2><p>All prices are in Indian Rupees (₹) inclusive of applicable taxes. We reserve the right to modify prices without prior notice.</p></section>
        <section><h2 className="font-serif text-xl text-brand-black mb-3">Governing Law</h2><p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in [Your City].</p></section>
      </div>
    </div>
  );
}
