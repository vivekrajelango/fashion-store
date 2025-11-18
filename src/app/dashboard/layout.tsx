import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Fashion Store</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Admin Dashboard</p>
        </div>
        
        <nav className="space-y-1">
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-medium">
            Dashboard
          </Link>
          <Link href="/dashboard/products" className="block py-2 px-4 rounded bg-gray-200 dark:bg-gray-800 font-medium">
            Products
          </Link>
          <Link href="/dashboard/orders" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-medium">
            Orders
          </Link>
          <Link href="/dashboard/customers" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-medium">
            Customers
          </Link>
          <Link href="/dashboard/analytics" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-medium">
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white dark:bg-black">
        {children}
      </main>
    </div>
  );
}