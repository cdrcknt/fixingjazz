import React from 'react';

const PaymentSummary = ({
  order,
  discount,
  total,
  amountTendered,
  changeAmount
}) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    <h4 className="text-xl font-semibold text-gray-900 mb-6">
      Payment Details
    </h4>

    <div className="space-y-6">
      {/* Order Summary */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>${order.total_amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Discount:</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-semibold text-gray-900 pt-3 border-t">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Amount and Change */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount Tendered:</span>
          <span className="font-medium text-gray-900">
            ${amountTendered.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Change:</span>
          <span className="font-medium text-gray-900">
            ${changeAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentSummary;