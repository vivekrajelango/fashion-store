'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export function FloatingCart() {
    const pathname = usePathname();
    const { getItemCount, getCartTotal } = useCart();
    const itemCount = getItemCount();
    const cartTotal = getCartTotal();

    // Don't show on dashboard or cart page
    if (itemCount === 0 || pathname?.startsWith('/dashboard') || pathname === '/cart') return null;

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 md:hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <Link
                href="/cart"
                className="flex flex-col items-center gap-2 bg-pink-600 text-white px-3 py-5 rounded-l-2xl shadow-2xl shadow-pink-200 ring-2 ring-white/20 active:scale-95 transition-all no-underline hover:no-underline hover:text-white"
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-pink-600 shadow-sm">
                        {itemCount}
                    </span>
                </div>
                <div className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-widest font-bold opacity-90 rotate-180">
                    View Bag
                </div>
                <div className="text-xs font-bold mt-1">
                    ₹{cartTotal.toLocaleString()}
                </div>
            </Link>
        </div>
    );
}
