'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useProducts } from '@/context/ProductsContext';

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
    customer_name: string;
    customer_mobile: string;
    customer_address: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { refreshProducts } = useProducts();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('fashionorders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setUpdatingId(id);

            // If approving, handle stock updates first
            if (newStatus === 'approved') {
                // 1. Fetch fresh order data to ensure we have the correct items
                const { data: orderData, error: orderError } = await supabase
                    .from('fashionorders')
                    .select('items')
                    .eq('id', id)
                    .single();

                if (orderError || !orderData) {
                    throw new Error('Failed to fetch order details for stock update');
                }

                const items = orderData.items as OrderItem[];

                // 2. Process stock updates for each item
                for (const item of items) {
                    try {
                        // Get current stock
                        const { data: product, error: fetchError } = await supabase
                            .from('fashionproducts')
                            .select('stockQuantity')
                            .eq('id', item.id)
                            .single();

                        if (fetchError) {
                            console.error(`Error fetching stock for product ${item.id}:`, fetchError);
                            // We continue to try other items, or should we abort?
                            // For now, logging error but continuing best effort
                            continue;
                        }

                        const currentStock = product?.stockQuantity ?? 0;
                        const newStock = Math.max(0, currentStock - item.quantity);

                        // Update stock
                        const { error: updateError } = await supabase
                            .from('fashionproducts')
                            .update({ stockQuantity: newStock })
                            .eq('id', item.id);

                        if (updateError) {
                            console.error(`Error updating stock for product ${item.id}:`, updateError);
                        } else {
                            console.log(`Stock updated for product ${item.id}: ${currentStock} -> ${newStock}`);
                        }
                    } catch (itemErr) {
                        console.error(`Unexpected error processing item ${item.id}:`, itemErr);
                    }
                }
            }

            // 3. Update order status
            const { error } = await supabase
                .from('fashionorders')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // 4. Update local state
            setOrders(prev => prev.map(order =>
                order.id === id ? { ...order, status: newStatus } : order
            ));

            // 5. Refresh products context to ensure stock levels are updated across the app
            if (newStatus === 'approved') {
                refreshProducts();
            }

        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. Check console for details.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
                <button
                    onClick={fetchOrders}
                    className="text-sm bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 shadow-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                </button>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-sm font-mono text-gray-900 dark:text-gray-100">#{order.id.slice(0, 8)}</div>
                                            <div className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{order.customer_name}</div>
                                            <div className="text-xs text-pink-600 font-medium mt-1">{order.customer_mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400 max-w-[200px]">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 px-2 py-1 rounded">
                                                        <span>{item.name}</span>
                                                        <span className="font-bold ml-2">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-base font-black text-gray-900 dark:text-white">₹{Number(order.total_amount).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top text-center">
                                            {order.status === 'pending' ? (
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        disabled={updatingId === order.id}
                                                        onClick={() => handleStatusUpdate(order.id, 'approved')}
                                                        className="p-2 bg-green-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-transform"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    </button>
                                                    <button
                                                        disabled={updatingId === order.id}
                                                        onClick={() => handleStatusUpdate(order.id, 'declined')}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-transform"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="lg:hidden space-y-4 px-2">
                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-400 italic">No orders found.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
                                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-tighter">#{order.id.slice(0, 8)}</span>
                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{order.customer_name}</h3>
                                        <p className="text-xs font-bold text-pink-600 mt-0.5">{order.customer_mobile}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-gray-900 dark:text-white">₹{Number(order.total_amount).toFixed(2)}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 py-3 border-y border-gray-50 dark:border-gray-700/50">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Items ordered</p>
                                    <div className="grid grid-cols-1 gap-1">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-xs text-gray-700 dark:text-gray-300">
                                                <span>{item.name}</span>
                                                <span className="font-black text-pink-500">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Delivery Address</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{order.customer_address}</p>
                                </div>

                                {order.status === 'pending' && (
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            disabled={updatingId === order.id}
                                            onClick={() => handleStatusUpdate(order.id, 'approved')}
                                            className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Approve
                                        </button>
                                        <button
                                            disabled={updatingId === order.id}
                                            onClick={() => handleStatusUpdate(order.id, 'declined')}
                                            className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                    ))}
            </div>
        </div>
    );
}
