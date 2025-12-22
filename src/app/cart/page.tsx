'use client';

import { Header } from "@/components/header";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function CartPage() {
  const { items, addToCart, removeFromCart, clearCart, getCartTotal } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for customer details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile || !formData.address) {
      setError('Please fill in all shipping details');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare order data with customer details
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_mobile: formData.mobile,
        customer_address: formData.address,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.price
        })),
        total_amount: getCartTotal(),
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { data, error: sbError } = await supabase
        .from('fashionorders')
        .insert([orderData])
        .select();

      if (sbError) throw sbError;

      clearCart();
      setCheckoutComplete(true);
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
            <Link href="/" className="mt-6 inline-block rounded-md bg-pink-600 px-6 py-3 text-white hover:bg-pink-700 transition-colors">
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
            <Link href="/" className="mt-4 inline-block rounded-md bg-pink-600 px-6 py-3 text-white hover:bg-pink-700 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex rounded-lg bg-white p-4 shadow-sm border border-gray-100">
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
                        ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-gray-900 font-medium bg-gray-50 border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          for (let i = 0; i < item.quantity; i++) {
                            removeFromCart(item.product.id);
                          }
                        }}
                        className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Shipping Details Form */}
              <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                      placeholder="Flat No, Apartment, Area, City, Pin Code"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 h-fit sticky top-8">
              <h2 className="mb-4 text-lg font-bold text-gray-900 uppercase tracking-wider">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <p>Subtotal</p>
                  <p>₹{getCartTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>Shipping</p>
                  <p>FREE</p>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                  <p className="text-lg font-bold text-gray-900">Total</p>
                  <p className="text-lg font-bold text-pink-600">₹{getCartTotal().toFixed(2)}</p>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-sm text-red-600 border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                  className="w-full rounded-md bg-pink-600 px-6 py-4 text-white font-bold uppercase tracking-widest hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full rounded-md border border-gray-300 px-6 py-2 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}