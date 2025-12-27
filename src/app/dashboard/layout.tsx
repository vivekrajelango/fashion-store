'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';


import { supabase } from '@/utils/supabase';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const linkBase = "block py-2 px-4 rounded font-medium transition-colors flex items-center justify-between";
  const linkActive = "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300";
  const linkIdle = "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/dashboard/products' },
    { name: 'Orders', href: '/dashboard/orders', badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
  ];

  useEffect(() => {
    // Initial fetch of pending orders
    const getPendingOrders = async () => {
      const { count } = await supabase
        .from('fashionorders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setPendingOrdersCount(count || 0);
    };

    getPendingOrders();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('pending-orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fashionorders',
        },
        async (payload) => {
          // You could optimize this by manually updating state, but refetching count is safer for accuracy
          console.log('Realtime update:', payload);
          getPendingOrders();

          // Trigger Native Notification on New Order
          if (payload.eventType === 'INSERT' && (payload.new as any).status === 'pending') {
            try {
              if (Notification.permission === 'granted') {
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification('New Order Received! 🛍️', {
                  body: `Customer ${(payload.new as any).customer_name} placed an order of ₹${(payload.new as any).total_amount}`,
                  icon: '/icons/icon-192x192.png',
                  badge: '/icons/icon-192x192.png',
                  tag: 'new-order',
                  data: { url: '/dashboard/orders' }
                });
              }
            } catch (error) {
              console.error('Notification error:', error);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('Notifications Enabled! ✅', {
        body: 'You will now be notified when new orders arrive.',
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-50">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Jaanuz Collectionz"
              width={240}
              height={50}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
          <div className="mb-8 mt-24 lg:mt-0 space-y-4">
            <Link href="/" className="group block">
              <p className="text-md text-gray-500 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                ← Go to Website
              </p>
            </Link>

            <button
              onClick={requestNotificationPermission}
              className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-300 dark:hover:bg-pink-900/40 py-2 px-3 rounded-lg text-sm font-bold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Enable Notifications
            </button>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`${linkBase} ${pathname === link.href ? linkActive : linkIdle}`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-auto bg-pink-600 text-white py-0.5 px-2 rounded-full text-xs font-bold shadow-sm animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full text-left py-2 px-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Sign Out
            </button>
            <Link href="/" className="block py-2 px-4 text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
              ← Back to Store
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}