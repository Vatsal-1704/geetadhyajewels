import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a href="https://wa.me/91XXXXXXXXXX?text=Hi! I'm interested in your jewellery." target="_blank" rel="noreferrer"
      className="fixed bottom-20 right-4 z-40 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      title="Chat on WhatsApp">
      <FaWhatsapp size={28} />
    </a>
  );
}
