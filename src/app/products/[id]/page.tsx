import { products } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              <Link href="/" className="text-gray-900 no-underline hover:no-underline hover:text-gray-900">Fashion Store</Link>
            </h1>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
                <li><Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">← Back to products</Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-96 w-full">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-6 md:w-1/2">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-2 text-sm text-gray-500">{product.category}</p>
              
              <div className="mt-4">
                {product.salePrice ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">₹{product.salePrice.toFixed(2)}</span>
                    <span className="ml-2 text-lg text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                )}
              </div>
              
              <p className="mt-4 text-gray-700">{product.description}</p>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Available Sizes</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span key={size} className="rounded-md border px-3 py-1 text-sm">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span key={color} className="rounded-md border px-3 py-1 text-sm">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <button className="flex-1 rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800">
                  Add to Cart
                </button>
                <button className="rounded-md border border-gray-300 px-4 py-3 text-sm font-medium hover:bg-gray-50">
                  ♥ Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2023 Fashion Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}