"use client";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase";

export default function NewProductPage() {
  const { addProduct } = useProducts();
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('fashion-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('fashion-images')
        .getPublicUrl(filePath);

      setImage(publicUrl);
    } catch (error: any) {
      console.error("Full Upload Error Context:", error);
      alert(`Upload failed: ${error.message || "Unknown error"}. 
      
Please check:
1. Bucket 'fashion-images' exists in Supabase Storage.
2. Bucket is set to 'Public'.
3. Storage Policies are applied.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || price <= 0 || !category || !image) {
      alert("Please fill in all required fields and upload an image");
      return;
    }

    setIsSaving(true);
    try {
      const newProduct = {
        name,
        category,
        price,
        salePrice,
        image,
        description,
        inStock: stockQuantity > 0,
        stockQuantity,
        sizes: [],
        colors: [],
      };

      await addProduct(newProduct as any);
      router.push("/dashboard/products");
    } catch (err) {
      alert("Failed to save product. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Product</h1>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1">Product Name</label>
          <input
            placeholder="e.g. Silk Maroon Saree"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1">Base Price (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1">Sale Price (₹)</label>
            <input
              type="number"
              placeholder="Optional"
              value={salePrice ?? ""}
              onChange={(e) => setSalePrice(e.target.value === "" ? undefined : Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none"
          >
            <option value="">Select Category</option>
            <option value="Necklace">Necklace</option>
            <option value="Dresses">Dresses</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Accessories">Accessories</option>
            <option value="Outerwear">Outerwear</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-3">Product Image</label>
          <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-pink-400 transition-colors bg-gray-50/50 dark:bg-gray-900/50 min-h-[200px]">
            {image ? (
              <div className="relative z-10 w-40 h-40 mb-4 group">
                <Image src={image} alt="Preview" fill className="object-cover rounded-xl shadow-lg" />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 font-medium tracking-tight">Tap to upload from device</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-0"
            />
            {isUploading && (
              <div className="mt-4 flex items-center gap-2 text-pink-600 font-bold text-xs uppercase animate-pulse">
                <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1">Description</label>
          <textarea
            placeholder="Tell us about this product..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1">Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <input
              type="checkbox"
              id="inStock"
              checked={stockQuantity > 0}
              onChange={(e) => setStockQuantity(e.target.checked ? Math.max(stockQuantity, 1) : 0)}
              className="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <label htmlFor="inStock" className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest cursor-pointer">In Stock</label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading || isSaving}
            className="px-8 py-3 rounded-xl bg-pink-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-pink-700 shadow-lg shadow-pink-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}