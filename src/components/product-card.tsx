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

        {/* Sale badge */}
        {/* Free Shipping badge */}
        <div className="absolute top-4 right-2 rounded-full bg-pink-600 px-3 py-2 text-[10px] font-bold uppercase text-white z-20 animate-bounce shadow-lg tracking-wider">
          Free Shipping
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.id}`} className="flex-1">
          <h3 className="font-bold text-gray-900 uppercase tracking-tight text-sm line-clamp-1">{product.name}</h3>
          <p className="mt-0.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.category}</p>
          <div className="mt-2 flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-base font-black text-pink-600">₹{product.salePrice.toFixed(0)}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.price.toFixed(0)}</span>
              </>
            ) : (
              <span className="text-base font-black text-gray-900">₹{product.price.toFixed(0)}</span>
            )}
          </div>
        </Link>

        {/* Permanent Add to Cart / Quantity controls */}
        <div className="mt-4">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-pink-600 text-white rounded-xl border border-gray-100 p-1 mx-[25%]">
              <button
                onClick={(e) => { e.preventDefault(); removeFromCart(product.id); }}
                className="w-10 h-10 flex items-center justify-center hover:bg-black rounded-lg transition-colors"
                aria-label="Remove one"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-sm font-black">{quantity}</span>
              <button
                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                className="w-10 h-10 flex items-center justify-center hover:bg-black rounded-lg transition-colors"
                aria-label="Add one"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              disabled={product.stockQuantity <= 0}
              className="w-full bg-black text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {product.stockQuantity > 0 ? 'Add to Bag' : 'Sold Out'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}