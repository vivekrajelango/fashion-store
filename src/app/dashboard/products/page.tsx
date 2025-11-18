'use client';

import { useState } from 'react';
import Image from 'next/image';
import { products } from '@/data/products';
import GridView from './grid-view';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Women&apos;s Fashion Products</h1>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md">
          Add New Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex space-x-4">
            <select className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700">
              <option>All Categories</option>
              <option>Dresses</option>
              <option>Tops</option>
              <option>Bottoms</option>
              <option>Outerwear</option>
              <option>Accessories</option>
              <option>Footwear</option>
            </select>
            <select className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700">
              <option>All Sizes</option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            
            <div className="flex border rounded-md overflow-hidden">
              <button 
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200' : 'bg-white dark:bg-gray-800'}`}
                onClick={() => setViewMode('table')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200' : 'bg-white dark:bg-gray-800'}`}
                onClick={() => setViewMode('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative">
                          <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <Image 
                              src={product.image} 
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.salePrice && (
                        <div className="text-xs text-red-500">
                          Sale: ${product.salePrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {product.stockQuantity} units
                      </div>
                      <div className={`text-xs ${product.stockQuantity > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                        {product.stockQuantity > 10 ? 'In stock' : 'Low stock'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <GridView products={products} />
          </div>
        )}
        
        <div className="px-6 py-4 flex items-center justify-between border-t dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">1</span> to <span className="font-medium">12</span> of <span className="font-medium">12</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}