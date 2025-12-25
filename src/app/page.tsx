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
          <h2 className="text-3xl font-semibold text-gray-900">Curated Styles</h2>
          <p className="mt-2 text-gray-500">Handpicked favourites just for you</p>
        </div>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            {/* <h3 className="text-xl font-semibold text-gray-800">Filters</h3> */}
            <div className="flex items-center space-x-2">
              <div className="w-1/2">Our Products</div>
              {/* <select
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-pink-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select> */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="rounded-md border border-gray-300 pl-3 pr-8 py-1.5 text-sm w-48 outline-none focus:ring-1 focus:ring-pink-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute right-2.5 top-2 text-gray-400"
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
