import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPendingOrders } from '../services/orders';
import { fetchActivePromotions } from '../services/promotions';
import { processPayment } from '../utils/payment/paymentService';
import { calculateDiscount, calculateTotal, calculateChange } from '../utils/payment/paymentCalculations';

export const usePaymentProcessing = () => {
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
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [ordersData, promosData] = await Promise.all([
        fetchPendingOrders(),
        fetchActivePromotions()
      ]);
      setOrders(ordersData);
      setActivePromos(promosData);
    } catch (error) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', error);
    }
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
      navigate('/dashboard/order/queue');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculations = {
    discount: calculateDiscount(selectedOrder, discountType, manualDiscount, selectedPromo),
    total: calculateTotal(selectedOrder, calculateDiscount(selectedOrder, discountType, manualDiscount, selectedPromo)),
    change: calculateChange(amountTendered, calculateTotal(selectedOrder, calculateDiscount(selectedOrder, discountType, manualDiscount, selectedPromo)))
  };

  return {
    // State
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

    // Actions
    setSelectedOrder,
    setSelectedPromo,
    setManualDiscount,
    setDiscountType,
    setAmountTendered,
    handlePayment
  };
};