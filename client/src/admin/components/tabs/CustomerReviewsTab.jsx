import { FiStar } from "react-icons/fi";

export default function CustomerReviewsTab({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-6 text-center py-12">
        <div className="text-4xl mb-3">⭐</div>
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">{review.productName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </p>
            </div>
            <div className="flex text-yellow-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  fill={i < review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            {review.isApproved ? (
              <span className="inline-block text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                ✅ Approved
              </span>
            ) : (
              <span className="inline-block text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                ⏳ Pending Approval
              </span>
            )}
          </div>

          {/* Review Text */}
          {review.comment && (
            <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
          )}

          {/* Admin Reply */}
          {review.adminReply && (
            <div className="bg-brand-cream rounded-lg p-3 mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">💬 Admin Reply:</p>
              <p className="text-sm text-gray-700">{review.adminReply}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
