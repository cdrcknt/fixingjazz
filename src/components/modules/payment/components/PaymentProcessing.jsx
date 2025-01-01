import React from 'react';
import { usePaymentProcessing } from '../../../../hooks/usePaymentProcessing';
import OrderSelection from './OrderSelection';
import DiscountSelection from './DiscountSelection';
import PaymentSummary from './PaymentSummary';
import PaymentForm from './PaymentForm';

const PaymentProcessing = () => {
  const {
    orders,
    selectedOrder,
    activePromos,
    selectedPromo,
    manualDiscount,
    discountType,
    amountTendered,
    loading,
    error,
    calculations,
    setSelectedOrder,
    setSelectedPromo,
    setManualDiscount,
    setDiscountType,
    setAmountTendered,
    handlePayment
  } = usePaymentProcessing();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <OrderSelection
          orders={orders}
          selectedOrder={selectedOrder}
          onSelectOrder={setSelectedOrder}
        />

        {selectedOrder && (
          <DiscountSelection
            activePromos={activePromos}
            selectedPromo={selectedPromo}
            discountType={discountType}
            manualDiscount={manualDiscount}
            onSelectPromo={setSelectedPromo}
            onChangeDiscountType={setDiscountType}
            onChangeManualDiscount={setManualDiscount}
          />
        )}
      </div>

      {selectedOrder && (
        <div>
          <PaymentSummary
            order={selectedOrder}
            discount={calculations.discount}
            total={calculations.total}
            amountTendered={amountTendered}
            changeAmount={calculations.change}
          />
          
          <PaymentForm
            amountTendered={amountTendered}
            onAmountTenderedChange={setAmountTendered}
            onSubmit={handlePayment}
            loading={loading}
            error={error}
            minimumAmount={calculations.total}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;