'use client';

import { ProductCard } from "@/components/product-card";
import { Header } from "@/components/header";
import Image from "next/image";
import { useState } from "react";
import { useProducts } from "@/context/ProductsContext";

export default function Home() {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    const categoryMatch = category === "All Categories" || product.category === category;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const categories = ["All Categories", ...new Set(products.map(product => product.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          {/* <h2 className="text-3xl font-semibold text-gray-900">Curated Styles</h2>
          <p className="mt-2 text-gray-500">Handpicked favourites just for you</p> */}
        </div>
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_auto] text-white py-3 px-6 rounded-xl shadow-lg animate-gradient flex items-center justify-center">
            <p className="text-lg font-bold tracking-wider uppercase animate-bounce-slow flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>✨ Enjoy free shipping on all your orders ✨</span>
            </p>
          </div>

          <a
            href="https://wa.me/+918489984495?text=Hi"
            target="_blank"
            rel="noopener noreferrer"
            className="md:w-auto bg-[#25D366] text-white py-3 px-6 rounded-xl shadow-lg hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 font-bold tracking-wide"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.54 18.82L4.43 19.63L5.26 16.61L5.06 16.29C4.22 14.95 3.79 13.45 3.79 11.91C3.79 7.37 7.5 3.67 12.05 3.67C14.26 3.67 16.33 4.53 17.89 6.09C19.45 7.65 20.32 9.72 20.32 11.92C20.32 16.46 16.61 20.16 12.05 20.16ZM16.61 14.39C16.36 14.27 15.14 13.67 14.91 13.59C14.68 13.51 14.51 13.47 14.34 13.72C14.17 13.97 13.69 14.53 13.54 14.7C13.39 14.87 13.24 14.89 12.99 14.76C12.74 14.64 11.94 14.38 10.99 13.53C10.25 12.87 9.75 12.06 9.5 11.63C9.25 11.2 9.47 11.18 9.6 11.06C9.7 10.96 9.83 10.8 9.96 10.65C10.09 10.5 10.13 10.39 10.21 10.23C10.3 10.07 10.26 9.93 10.19 9.79C10.13 9.65 9.71 8.61 9.54 8.19C9.37 7.79 9.2 7.84 9.04 7.84L8.58 7.84C8.42 7.84 8.15 7.9 7.92 8.15C7.69 8.4 7.04 9.01 7.04 10.25C7.04 11.49 7.95 12.69 8.08 12.86C8.21 13.03 9.92 15.68 12.55 16.81C14.34 17.58 15.04 17.43 15.68 17.34C16.39 17.24 17.87 16.45 18.18 15.58C18.49 14.71 18.49 13.97 18.39 13.8C18.29 13.64 18.16 13.59 17.91 13.47H17.91V13.47L16.61 14.39Z" />
            </svg>
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-800">Our Collections</h3>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative min-w-[140px]">
                <select
                  className="w-full appearance-none rounded-full border border-gray-300 bg-white pl-4 pr-8 py-2 text-sm font-medium text-gray-700 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 cursor-pointer hover:border-pink-400 transition-colors"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-full border border-gray-300 pl-4 pr-10 py-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium font-mono uppercase tracking-widest text-xs">Fetching Styles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">

          <p className="text-gray-500">© 2026 Jaanuz Collectionz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
