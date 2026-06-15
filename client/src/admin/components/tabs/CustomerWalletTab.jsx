import { FiGift, FiTrendingUp, FiAward } from "react-icons/fi";

export default function CustomerWalletTab({ rewardPoints }) {
  // Calculate rewards tiers and potential
  const pointsToNextTier = Math.max(0, 500 - (rewardPoints % 500));
  const currentTier = Math.floor(rewardPoints / 500) + 1;
  const progressPercent = ((rewardPoints % 500) / 500) * 100;

  // Reward breakdown
  const rewards = [
    { name: "Bronze Tier", points: 0, benefits: "2% cashback on all purchases" },
    { name: "Silver Tier", points: 500, benefits: "3% cashback + Free shipping on orders >₹500" },
    { name: "Gold Tier", points: 1000, benefits: "5% cashback + Free shipping always + Birthday bonus" },
    { name: "Platinum Tier", points: 1500, benefits: "7% cashback + VIP support + Exclusive deals" }
  ];

  const rewardValueInRupees = Math.floor(rewardPoints / 10);

  return (
    <div className="p-6 space-y-6">
      {/* Main Rewards Card */}
      <div className="bg-gradient-to-br from-brand-gold/20 to-brand-cream rounded-2xl p-6 border border-brand-gold/30">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-gold/30 flex items-center justify-center flex-shrink-0">
            <FiGift size={32} className="text-brand-gold" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 uppercase font-semibold">Current Reward Points</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{rewardPoints.toLocaleString()}</p>
            <p className="text-xs text-gray-600 mt-2">Worth ≈ ₹{rewardValueInRupees}</p>
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiAward size={18} className="text-brand-gold" />
          Tier Progress
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900">Current Tier: {rewards[Math.min(currentTier - 1, 3)].name}</p>
              <p className="text-sm text-gray-600">{rewardPoints % 500} / 500 points</p>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-dark transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">{pointsToNextTier} points to next tier</p>
          </div>
        </div>
      </div>

      {/* Reward Tiers */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiTrendingUp size={18} className="text-brand-gold" />
          Reward Tiers
        </h3>
        <div className="space-y-3">
          {rewards.map((reward, i) => {
            const isCurrentTier = i === Math.min(currentTier - 1, 3);
            const isUnlocked = rewardPoints >= reward.points;

            return (
              <div
                key={i}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isCurrentTier
                    ? "border-brand-gold bg-brand-cream"
                    : isUnlocked
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      {isCurrentTier && "🏆"}
                      {isUnlocked && !isCurrentTier && "✅"}
                      {!isUnlocked && "🔒"}
                      {reward.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{reward.benefits}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">{reward.points}+ pts</p>
                </div>
                {!isUnlocked && (
                  <p className="text-xs text-gray-700 mt-2">
                    {reward.points - rewardPoints} points away
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* How to Earn */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">💡 How to Earn Points</h3>
        <div className="space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">🛍️</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Every Purchase:</span> 1 point per ₹10 spent</p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">⭐</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Leave a Review:</span> 10 points per approved review</p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">👥</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Refer a Friend:</span> 50 points + ₹100 credit</p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">🎂</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Birthday Bonus:</span> 100 points during birthday month</p>
          </div>
        </div>
      </div>

      {/* Redemption Guide */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">🎁 How to Redeem</h3>
        <div className="space-y-2 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">Points can be redeemed as:</p>
          <ul className="space-y-2 mt-3 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-semibold">•</span>
              <span>Discount on purchases (1 point = ₹0.10 discount)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">•</span>
              <span>Free shipping on orders</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">•</span>
              <span>Exclusive access to new collections</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">•</span>
              <span>Birthday gifts and special offers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
