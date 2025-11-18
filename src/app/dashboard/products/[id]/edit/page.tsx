"use client";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useEffect, useMemo, useState } from "react";

export default function EditProductPage() {
  const { products, updateProduct } = useProducts();
  const router = useRouter();
  const routeParams = useParams();
  const id = Array.isArray(routeParams?.id) ? routeParams.id[0] : (routeParams?.id as string);
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setSalePrice(product.salePrice);
      setCategory(product.category);
      setImage(product.image);
      setDescription(product.description);
      setStockQuantity(product.stockQuantity);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300">Product not found.</p>
      </div>
    );
  }

  const handleSave = () => {
    updateProduct(product.id, {
      name,
      price,
      salePrice,
      category,
      image,
      description,
      stockQuantity,
    });
    router.push("/dashboard/products");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Product</h1>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sale Price</label>
            <input type="number" value={salePrice ?? ""} onChange={(e) => setSalePrice(e.target.value === "" ? undefined : Number(e.target.value))} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
          <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => router.push("/dashboard/products")} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}