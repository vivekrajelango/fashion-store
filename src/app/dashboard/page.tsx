export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Total Products</h2>
          <p className="text-3xl font-bold">24</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Total Orders</h2>
          <p className="text-3xl font-bold">18</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">$2,450</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b dark:border-gray-700">
            <div>
              <p className="font-medium">New order #1089</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Summer Dress (M) x1</p>
            </div>
            <span className="text-sm text-gray-500">Just now</span>
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b dark:border-gray-700">
            <div>
              <p className="font-medium">New order #1088</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Floral Blouse (S) x1, Denim Jeans x1</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b dark:border-gray-700">
            <div>
              <p className="font-medium">Product update</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Evening Gown stock updated to 8 units</p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}