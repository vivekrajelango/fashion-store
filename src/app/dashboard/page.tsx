'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 15,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Fetch products count
        const { count: productCount, error: productsError } = await supabase
          .from('fashionproducts')
          .select('*', { count: 'exact', head: true });

        if (productsError) throw productsError;

        // Fetch orders and revenue
        const { data: orders, error: ordersError } = await supabase
          .from('fashionorders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        if (orders) {
          const totalOrders = orders.length;
          const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

          setStats({
            totalProducts: productCount || 0,
            totalOrders,
            totalRevenue
          });
          setRecentOrders(orders.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <div className="flex gap-2 text-sm text-gray-500 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800 w-fit shadow-sm">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Status
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Link href="/dashboard/products" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <h2 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Products</h2>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">{stats.totalProducts}</p>
          <div className="mt-2 text-xs text-green-500 font-medium">In Inventory</div>
        </Link>

        <Link href="/dashboard/orders" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <h2 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Orders</h2>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">{stats.totalOrders}</p>
          <div className="mt-2 text-xs text-blue-500 font-medium">Placed so far</div>
        </Link>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group sm:col-span-2 lg:col-span-1">
          <h2 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Revenue</h2>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">₹{stats.totalRevenue.toLocaleString()}</p>
          <div className="mt-2 text-xs text-pink-500 font-medium font-mono">Gross Earnings</div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs font-bold text-pink-600 hover:text-pink-700 uppercase tracking-widest">View All</Link>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 dark:text-gray-500 italic">No orders recorded yet.</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-50 dark:border-gray-700/50 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                      {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                    <p className="text-lg font-black text-gray-900 dark:text-white">₹{Number(order.total_amount).toFixed(2)}</p>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}