'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import DeliveryTruck from './DeliveryTruck';
import { ImagePreviewModal } from './image-preview-modal';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, items } = useCart();
  const [showPreview, setShowPreview] = useState(false);

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
        <div className="absolute top-4 right-2 rounded-full bg-pink-600 px-3 py-1 text-[10px] font-bold uppercase text-white z-20 animate-bounce tracking-wider bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_auto] text-white py-2 px-4 rounded-xl shadow-lg">
          Free Shipping
        </div>

        {/* Preview Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPreview(true);
          }}
          className="absolute bottom-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 shadow-lg translate-y-0 opacity-100 md:opacity-0 md:translate-y-2 md:transition-all md:duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:bg-black hover:text-white"
          title="Preview Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.id}`} className="flex-1">
          <h3 className="font-bold text-gray-900 uppercase tracking-tight text-lg line-clamp-1">{product.name}</h3>
          <section className='flex flex-row justify-between items-center gap-2'>
            <section className='flex flex-row items-center gap-2'>
              <DeliveryTruck size={40} />
              <p className="mt-0.5 text-[12px] text-gray-500 font-bold uppercase tracking-widest">{product.description}</p>
            </section>
            <div className="mt-2 flex items-center gap-1">
              {product.salePrice ? (
                <>
                  <span className="text-xl font-black text-pink-600">₹{product.salePrice.toFixed(0)}</span>
                  <span className="text-sm text-gray-400 line-through">₹{product.price.toFixed(0)}</span>
                </>
              ) : (
                <span className="text-xl font-black text-gray-900">₹{product.price.toFixed(0)}</span>
              )}
            </div>
          </section>
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
      <ImagePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        imageUrl={product.image}
        altText={product.name}
      />
    </div>
  );
}