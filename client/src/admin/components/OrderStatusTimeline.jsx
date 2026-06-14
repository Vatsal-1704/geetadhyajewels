import { FiCheck, FiClock } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  shipped: "bg-purple-100 text-purple-700 border-purple-300",
  delivered: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function OrderStatusTimeline({ statusHistory = [] }) {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600">
        <FiClock size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No status history yet</p>
      </div>
    );
  }

  // Sort by timestamp, newest first
  const sortedHistory = [...statusHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="space-y-3">
      {sortedHistory.map((entry, idx) => (
        <div key={idx} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
          {/* Timeline Dot */}
          <div className="flex flex-col items-center mt-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${STATUS_COLORS[entry.status] || "bg-gray-100 text-gray-600"}`}>
              <FiCheck size={14} />
            </div>
            {idx !== sortedHistory.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>}
          </div>

          {/* Timeline Content */}
          <div className="flex-1 pt-0.5">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[entry.status] || "bg-gray-100 text-gray-600"}`}>
                {entry.status}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(entry.timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(entry.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              <span className="font-medium">{entry.changedByName || "System"}</span>
            </p>
            {entry.notes && (
              <p className="text-xs text-gray-500 mt-1 italic">"{entry.notes}"</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
