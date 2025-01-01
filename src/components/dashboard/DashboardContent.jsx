import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Users, Package } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import StatCard from './StatCard';
import QuickActions from './QuickActions';

const DashboardContent = ({ user }) => {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [activeStaff, setActiveStaff] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get today's start and end timestamps
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch today's orders count and total sales
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('final_amount')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      if (transactionsError) throw transactionsError;

      // Calculate orders count and total sales
      const ordersCount = transactionsData?.length || 0;
      const todaySales = transactionsData?.reduce((sum, transaction) => sum + (transaction.final_amount || 0), 0) || 0;

      // Fetch active staff count
      const { data: staffData, error: staffError } = await supabase
        .from('employees')
        .select('id');

      if (staffError) throw staffError;

      // Fetch low stock items
      const { data: stockData, error: stockError } = await supabase
        .from('stock_levels')
        .select('*')
        .lt('current_stock', 10);

      if (stockError) throw stockError;

      // Fetch recent orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            products (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;

      // Update state with fetched data
      setTodayOrders(ordersCount);
      setTotalSales(todaySales);
      setActiveStaff(staffData?.length || 0);
      setLowStockCount(stockData?.length || 0);
      setRecentOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Welcome Back!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
  title="Today's Orders"
  value={loading ? "Loading..." : todayOrders.toString()}
  icon={ShoppingBag}
  change={loading ? "Loading..." : `${todayOrders} orders today`}
  changeType="neutral"
/>

          <StatCard
            title="Total Sales"
            value={loading ? "Loading..." : `$${totalSales.toFixed(2)}`}
            icon={DollarSign}
            change={loading ? "Loading..." : `Revenue today`}
            changeType="neutral"
          />
          <StatCard
            title="Active Staff"
            value={loading ? "Loading..." : activeStaff.toString()}
            icon={Users}
            change={loading ? "Loading..." : `Total employees`}
            changeType="neutral"
          />
          <StatCard
            title="Low Stock Items"
            value={loading ? "Loading..." : lowStockCount.toString()}
            icon={Package}
            change="Items below threshold"
            changeType="neutral"
            isAlert={lowStockCount > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
                  View All
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading orders...</p>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No orders available yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Order #{order.order_number}</h4>
                          <p className="text-sm text-gray-500">
                            {order.order_items?.length || 0} items • ${order.total_amount?.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;