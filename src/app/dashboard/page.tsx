export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Total Products</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Total Orders</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">18</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Total Revenue</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$2,450</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New order #1089</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Summer Dress (M) x1</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Just now</span>
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New order #1088</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Floral Blouse (S) x1, Denim Jeans x1</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Product update</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Evening Gown stock updated to 8 units</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}