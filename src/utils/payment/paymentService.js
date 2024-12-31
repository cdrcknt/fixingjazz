import { supabase } from '../supabaseClient';
import { calculateDiscount, calculateTotal, calculateChange } from './paymentCalculations';

export const processPayment = async (
  order,
  discountType,
  manualDiscount,
  selectedPromo,
  amountTendered
) => {
  const discount = calculateDiscount(order, discountType, manualDiscount, selectedPromo);
  const finalAmount = calculateTotal(order, discount);
  const changeAmount = calculateChange(amountTendered, finalAmount);

  if (amountTendered < finalAmount) {
    throw new Error('Insufficient amount tendered');
  }

  try {
    // Start a transaction
    const { data: { user } } = await supabase.auth.getUser();

    // Update order with discount information and status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        total_before_discount: order.total_amount,
        discount_amount: discount,
        applied_promotion_id: selectedPromo?.id || null,
        total_amount: finalAmount,
        status: 'pending' // Keep as pending until completed in order queue
      })
      .eq('id', order.id);

    if (orderError) throw orderError;

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        order_id: order.id,
        total_amount: order.total_amount,
        discount_amount: discount,
        discount_type: discountType,
        promotion_id: selectedPromo?.id,
        final_amount: finalAmount,
        amount_tendered: amountTendered,
        change_amount: changeAmount,
        payment_status: 'completed',
        created_by: user.id
      }]);

    if (transactionError) throw transactionError;

    // Add to order status history
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert([{
        order_id: order.id,
        previous_status: order.status,
        new_status: 'pending',
        changed_by: user.id,
        notes: 'Payment processed'
      }]);

    if (historyError) throw historyError;

    return { finalAmount, changeAmount };
  } catch (error) {
    throw new Error('Failed to process payment: ' + error.message);
  }
};