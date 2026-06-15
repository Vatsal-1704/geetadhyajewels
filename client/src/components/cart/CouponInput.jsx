import React, { useState } from 'react';
import { FiTag, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './CouponInput.css';

export default function CouponInput({ subtotal, onCouponApply, onCouponRemove, appliedCoupon }) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/coupons/validate', {
        code: couponCode.toUpperCase(),
        orderValue: subtotal,
      });

      if (data?.coupon) {
        onCouponApply({
          ...data.coupon,
          discountAmount: data.discountAmount,
        });
        toast.success(`✅ Coupon applied! You save ₹${data.discountAmount}`);
        setCouponCode('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onCouponRemove();
    toast.info('Coupon removed');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="coupon-input-success">
        <div className="coupon-success-content">
          <FiCheck className="coupon-success-icon" size={20} />
          <div className="coupon-success-text">
            <p className="coupon-success-label">Coupon Applied</p>
            <p className="coupon-success-code">{appliedCoupon.code}</p>
            <p className="coupon-success-discount">
              Save ₹{appliedCoupon.discountAmount?.toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="coupon-remove-button"
          title="Remove coupon"
          aria-label="Remove coupon"
        >
          <FiX size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="coupon-input-wrapper">
      <label className="coupon-input-label">Have a coupon code?</label>
      <div className="coupon-input-group">
        <div className="coupon-input-field">
          <FiTag className="coupon-input-icon" size={16} />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            className="coupon-input"
            disabled={loading}
            maxLength="20"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !couponCode.trim()}
          className="coupon-apply-button"
        >
          {loading ? (
            <span className="coupon-loading-spinner" />
          ) : (
            'Apply'
          )}
        </button>
      </div>
      <p className="coupon-input-hint">
        Popular codes: WELCOME10, SAVE20, LUXE50
      </p>
    </div>
  );
}
