import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  return (
    <a href="https://wa.me/91XXXXXXXXXX?text=Hi! I'm interested in your jewellery."
      target="_blank"
      rel="noreferrer"
      className="whatsapp-button"
      title="Chat on WhatsApp"
      aria-label="Contact us on WhatsApp">
      <FaWhatsapp size={28} />
    </a>
  );
}
