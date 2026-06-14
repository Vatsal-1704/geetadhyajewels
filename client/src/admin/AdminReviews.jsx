import { useState, useEffect } from "react";
import { FiCheck, FiX, FiMessageSquare } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";

const MOCK = [
  { _id: "r1", productId: "p1", productName: "Kundan Necklace", name: "Priya S.", rating: 5, comment: "Absolutely beautiful!", createdAt: new Date().toISOString(), isApproved: false },
  { _id: "r2", productId: "p2", productName: "Pearl Earrings", name: "Ananya R.", rating: 4, comment: "Good quality, fast delivery!", createdAt: new Date().toISOString(), isApproved: false },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(MOCK);
  const [replyModal, setReplyModal] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => { api.get("/admin/reviews/pending").then(r => { if (r.data.length) setReviews(r.data); }).catch(() => {}); }, []);

  const action = async (productId, reviewId, act, replyText = "") => {
    try {
      await api.post("/admin/reviews/action", { productId, reviewId, action: act, reply: replyText });
      if (act === "delete" || act === "approve") setReviews(r => r.filter(x => x._id !== reviewId));
      if (act === "reply") setReplyModal(null);
      toast.success(act === "approve" ? "Review approved!" : act === "delete" ? "Review deleted" : "Reply sent!");
    } catch { toast.error("Action failed"); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">{reviews.length} review{reviews.length !== 1 ? "s" : ""} pending approval</p>
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm"><div className="text-4xl mb-3">✅</div><p className="text-gray-700">No pending reviews</p></div>
      ) : reviews.map(r => (
        <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-medium text-gray-900">{r.name}</p>
              <p className="text-xs text-brand-gold">{r.productName}</p>
              <div className="flex text-amber-400 text-sm mt-1">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
            </div>
            <span className="text-xs text-gray-600">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
          </div>
          <p className="text-gray-700 text-sm mb-4 italic">"{r.comment}"</p>
          <div className="flex gap-2">
            <button onClick={() => action(r.productId, r._id, "approve")} className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-100"><FiCheck size={12} />Approve</button>
            <button onClick={() => { setReplyModal(r); setReply(""); }} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-100"><FiMessageSquare size={12} />Reply</button>
            <button onClick={() => action(r.productId, r._id, "delete")} className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100"><FiX size={12} />Delete</button>
          </div>
        </div>
      ))}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-semibold mb-3">Reply to {replyModal.name}</h3>
            <p className="text-sm text-gray-700 italic mb-3">"{replyModal.comment}"</p>
            <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Your reply as GeetadhyaJewels..." rows={4} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setReplyModal(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm">Cancel</button>
              <button onClick={() => action(replyModal.productId, replyModal._id, "reply", reply)} className="flex-1 bg-brand-gold text-white rounded-xl py-2.5 text-sm font-medium">Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
