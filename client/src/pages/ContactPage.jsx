import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useFormValidation } from "../hooks/useFormValidation";
import "../styles/info-pages.css";
import { validators } from "../utils/validators";
import FormInput from "../components/form/FormInput";
import api from "../utils/api";

export default function ContactPage() {
  const contactRules = {
    name: (val) => validators.fullName(val),
    email: (val) => validators.email(val),
    subject: (val) => validators.subject(val),
    message: (val) => validators.message(val, 20, 1000),
  };

  const form = useFormValidation(
    { name: "", email: "", subject: "", message: "" },
    handleFormSubmit,
    contactRules
  );

  async function handleFormSubmit(values) {
    try {
      // Send to backend with validation (FormInput sanitizes user input)
      const response = await api.post("/contact", values);
      toast.success("Message sent! We'll reply within 24 hours. ✨");
      form.resetForm();
      console.log("Contact message sent successfully");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send message. Please try again.";
      form.setFormError(errorMsg);
      toast.error(errorMsg);
      console.error("Contact form error:", err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Get in Touch</p>
        <h1 className="font-serif text-4xl text-brand-black">Contact Us</h1>
        <p className="text-gray-500 mt-2">We're here to help! Reach out anytime.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          {[
            { icon: FiPhone, title: "Call Us", info: "TODO: Owner phone number", sub: "TODO: Owner working hours", isTodo: true },
            { icon: FiMail, title: "Email Us", info: "TODO: Owner email address", sub: "We reply within 24h", isTodo: true },
            { icon: FiMapPin, title: "Visit Us", info: "TODO: Store address", sub: "TODO: City, State", isTodo: true }
          ].map(({ icon: Icon, title, info, sub, isTodo }) => (
            <div key={title} className={`rounded-2xl p-5 shadow-sm flex gap-4 ${isTodo ? 'bg-yellow-50 border border-yellow-200' : 'bg-white'}`}>
              <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="text-brand-gold" size={20} /></div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className={`text-sm font-medium ${isTodo ? 'text-yellow-600' : 'text-brand-black'}`}>{info}</p>
                <p className={`text-xs ${isTodo ? 'text-yellow-500' : 'text-gray-400'}`}>{sub}</p>
              </div>
            </div>
          ))}
          <a href="https://wa.me/?text=Hi%20GeetadhyaJewels%20-%20I%20have%20a%20question" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-green-500 text-white rounded-2xl p-4 hover:bg-green-600 transition-colors">
            <FaWhatsapp size={24} /><div><p className="font-semibold">WhatsApp Us</p><p className="text-xs text-green-100">Fastest response!</p></div>
          </a>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-5">Send us a Message</h2>

          {/* Form-level error */}
          {form.errors._form && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{form.errors._form}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <FormInput
                label="Your Name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.name}
                touched={form.touched.name}
                required
              />

              {/* Email */}
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.email}
                touched={form.touched.email}
                required
              />
            </div>

            {/* Subject */}
            <FormInput
              label="Subject"
              name="subject"
              type="text"
              placeholder="How can we help?"
              value={form.values.subject}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.subject}
              touched={form.touched.subject}
              required
            />

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  value={form.values.message}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  data-error={form.errors.message && form.touched.message}
                  className={`
                    w-full px-4 py-3 text-sm rounded-xl border-2 transition-all
                    outline-none focus:outline-none resize-none
                    ${form.errors.message && form.touched.message ? "border-red-300 bg-red-50 focus:border-red-500" : ""}
                    ${!form.errors.message && form.touched.message ? "border-green-300 bg-green-50 focus:border-green-500" : ""}
                    ${!form.errors.message && !form.touched.message ? "border-gray-200 focus:border-brand-gold" : ""}
                  `}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  {form.errors.message && form.touched.message && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>•</span>
                      {form.errors.message}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {form.values.message.length}/1000
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={form.loading}
              className="flex items-center gap-2 bg-brand-gold text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend size={16} />
              {form.loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
