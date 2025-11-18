'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, items } = useCart();
  
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Dim overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Quick actions (eye and bag) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition">
          <Link
            href={`/products/${product.id}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-800 shadow hover:bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
            </svg>
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-800 shadow hover:bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>

        {/* Bottom add-to-cart bar */}
        <button
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 bg-gray-900/90 text-white py-3 text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </button>

        {/* Sale badge */}
        {product.salePrice && product.salePrice < product.price && (
          <div className="absolute top-2 right-2 rounded-full bg-pink-600 px-2 py-1 text-xs font-medium text-white">Sale</div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          <div className="mt-2 flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-lg font-medium text-gray-900">${product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
        </Link>

        {/* Inline cart controls when already in cart */}
        {quantity > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={(e) => { e.preventDefault(); removeFromCart(product.id); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-l-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-4 py-2 border-x border-gray-200">{quantity}</span>
              <button
                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-r-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <span className="text-sm font-medium text-pink-600">In Cart</span>
          </div>
        )}
      </div>
    </div>
  );
}