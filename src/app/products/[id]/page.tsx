'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/context/ProductsContext';
import { notFound, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Header } from '@/components/header';

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/" className="text-pink-600 dark:text-pink-400 hover:underline font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Collection
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-[500px] w-full bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-widest">
                    {product.category}
                  </span>
                  {product.stockQuantity > 0 ? (
                    <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      In Stock ({product.stockQuantity})
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-bold">Out of Stock</span>
                  )}
                </div>

                <h1 className="mt-4 text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                  {product.name}
                </h1>

                <div className="mt-6 flex items-baseline gap-4">
                  {product.salePrice ? (
                    <>
                      <span className="text-5xl font-black text-pink-600">₹{product.salePrice.toLocaleString()}</span>
                      <span className="text-2xl text-gray-400 line-through font-medium">₹{product.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-5xl font-black text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Description</h3>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {product.description || "No description available for this curated piece."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-10">
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Available Sizes</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <span key={size} className="rounded-xl border-2 border-gray-100 dark:border-gray-700 px-4 py-2 text-sm font-black text-gray-900 dark:text-white hover:border-pink-500 transition-colors cursor-default">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Colors</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <span key={color} className="rounded-xl border-2 border-gray-100 dark:border-gray-700 px-4 py-2 text-sm font-black text-gray-900 dark:text-white hover:border-pink-500 transition-colors cursor-default">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex space-x-4">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stockQuantity <= 0}
                  className="flex-1 rounded-2xl bg-black dark:bg-white dark:text-black py-5 text-sm font-black text-white uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {product.stockQuantity > 0 ? 'Add to Bag' : 'Sold Out'}
                </button>
                <button className="p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">FASHION STORE</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm">© 2025 Handcrafted with love.</p>
        </div>
      </footer>
    </div>
  );
}