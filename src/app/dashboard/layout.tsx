'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const linkBase = "block py-2 px-4 rounded font-medium transition-colors";
  const linkActive = "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300";
  const linkIdle = "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/dashboard/products' },
    { name: 'Orders', href: '/dashboard/orders' },
  ];

  return (
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
        <div className="mb-8 mt-24 lg:mt-0">
          <Link href="/" className="group block">
            {/* <Image
              src="/logo.png"
              alt="Jaanuz Collectionz"
              width={220}
              height={60}
              className="h-12 w-auto object-contain mb-4 dark:invert1"
            /> */}
            <p className="text-md text-gray-500 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              ← Go to Website
            </p>
          </Link>
        </div>

        <nav className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`${linkBase} ${pathname === link.href ? linkActive : linkIdle}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/" className="block py-2 px-4 text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors border-t border-gray-100 dark:border-gray-800 pt-4">
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
  );
}