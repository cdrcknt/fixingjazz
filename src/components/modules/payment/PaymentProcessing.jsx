import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';
import { processPayment } from '../../../utils/payment/paymentService';
import OrderSelection from './components/OrderSelection';
import DiscountSelection from './components/DiscountSelection';
import PaymentSummary from './components/PaymentSummary';
import DenominationInput from './components/DenominationInput';

const PaymentProcessing = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activePromos, setActivePromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [manualDiscount, setManualDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('none');
  const [amountTendered, setAmountTendered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingOrders();
    fetchActivePromotions();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, price)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchActivePromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString());

      if (error) throw error;
      setActivePromos(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const calculateDiscount = () => {
    if (!selectedOrder) return 0;
    
    if (discountType === 'manual') {
      return manualDiscount;
    } else if (discountType === 'promo' && selectedPromo) {
      const amount = selectedOrder.total_amount;
      return selectedPromo.discount_type === 'percentage'
        ? (amount * selectedPromo.discount_value) / 100
        : selectedPromo.discount_value;
    }
    
    return 0;
  };

  const calculateTotal = () => {
    if (!selectedOrder) return 0;
    const discount = calculateDiscount();
    return Math.max(0, selectedOrder.total_amount - discount);
  };

  const calculateChange = () => {
    return Math.max(0, amountTendered - calculateTotal());
  };

  const handlePayment = async () => {
    if (!selectedOrder) return;
    
    setLoading(true);
    setError('');

    try {
      await processPayment(
        selectedOrder,
        discountType,
        manualDiscount,
        selectedPromo,
        amountTendered
      );

      // Navigate to order queue after successful payment
      navigate('/dashboard/order/queue');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
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
        <div className="space-y-6">
          <PaymentSummary
            order={selectedOrder}
            discount={calculateDiscount()}
            total={calculateTotal()}
            amountTendered={amountTendered}
            changeAmount={calculateChange()}
          />
          
          <DenominationInput
            onTotalChange={setAmountTendered}
            minimumAmount={calculateTotal()}
          />

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || amountTendered < calculateTotal()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading || amountTendered < calculateTotal()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;