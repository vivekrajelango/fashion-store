'use client';

import { Header } from "@/components/header";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, addToCart, removeFromCart, clearCart, getCartTotal } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = () => {
    // In a real app, this would process payment
    clearCart();
    setCheckoutComplete(true);
  };

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Order Successful!</h2>
            <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
            <Link href="/" className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Your Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-lg text-gray-600">Your cart is empty</p>
            <Link href="/" className="mt-4 inline-block rounded-md bg-pink-600 px-6 py-3 text-white hover:bg-pink-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {items.map((item) => (
                <div key={item.product.id} className="mb-4 flex rounded-lg bg-white p-4 shadow">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-lg font-medium text-gray-900">
                        ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          // Remove all quantities of this item
                          for (let i = 0; i < item.quantity; i++) {
                            removeFromCart(item.product.id);
                          }
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-white p-6 shadow h-fit">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Order Summary</h2>
              <div className="mb-4 flex justify-between border-b border-gray-200 pb-4">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900">${getCartTotal().toFixed(2)}</p>
              </div>
              <div className="mb-4 flex justify-between border-b border-gray-200 pb-4">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900">$0.00</p>
              </div>
              <div className="mb-4 flex justify-between">
                <p className="text-lg font-medium text-gray-900">Total</p>
                <p className="text-lg font-medium text-gray-900">${getCartTotal().toFixed(2)}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full rounded-md bg-pink-600 px-6 py-3 text-white hover:bg-pink-700"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="mt-4 w-full rounded-md border border-gray-300 px-6 py-3 text-gray-600 hover:bg-gray-50"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}