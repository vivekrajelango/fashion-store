import { Product } from '@/data/products';
import ProductCard from './product-card';

interface GridViewProps {
  products: Product[];
}

export default function GridView({ products }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}