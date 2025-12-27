import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useProducts } from '@/context/ProductsContext';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { deleteProduct } = useProducts();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Free Shipping badge */}
          <div className="absolute top-2 right-2 rounded-full bg-pink-600 px-3 py-1 text-[10px] font-bold uppercase text-white z-20 animate-bounce shadow-lg tracking-wider">
            Free Shipping
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200">
              {product.category}
            </span>
          </div>

          <div className="flex items-center mb-3">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className={`${product.stockQuantity > 10 ? 'text-green-500' : 'text-orange-500'} font-medium`}>
                {product.stockQuantity} in stock
              </span>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/dashboard/products/edit?id=${product.id}`}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Link>
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteProduct(product.id)}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
      />
    </>
  );
}