"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const linkBase = "block py-2 px-4 rounded font-medium transition-colors";
  const linkActive = "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white";
  const linkIdle = "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Fashion Store</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Admin Dashboard</p>
        </div>
        
        <nav className="space-y-1">
          <Link href="/dashboard" className={`${linkBase} ${pathname === "/dashboard" ? linkActive : linkIdle}`}
            aria-current={pathname === "/dashboard" ? "page" : undefined}>
            Dashboard
          </Link>
          <Link href="/dashboard/products" className={`${linkBase} ${pathname.startsWith("/dashboard/products") ? linkActive : linkIdle}`}
            aria-current={pathname.startsWith("/dashboard/products") ? "page" : undefined}>
            Products
          </Link>
          <Link href="/dashboard/orders" className={`${linkBase} ${pathname.startsWith("/dashboard/orders") ? linkActive : linkIdle}`}
            aria-current={pathname.startsWith("/dashboard/orders") ? "page" : undefined}>
            Orders
          </Link>
          <Link href="/dashboard/customers" className={`${linkBase} ${pathname.startsWith("/dashboard/customers") ? linkActive : linkIdle}`}
            aria-current={pathname.startsWith("/dashboard/customers") ? "page" : undefined}>
            Customers
          </Link>
          <Link href="/dashboard/analytics" className={`${linkBase} ${pathname.startsWith("/dashboard/analytics") ? linkActive : linkIdle}`}
            aria-current={pathname.startsWith("/dashboard/analytics") ? "page" : undefined}>
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950">
        {children}
      </main>
    </div>
  );
}