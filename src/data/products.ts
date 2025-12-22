export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Ruby Necklace with Earrings",
    category: "Necklace",
    price: 650.00,
    salePrice: 599.99,
    image: "/products/1.jpeg",
    description: "Elegant ruby neck piece with earrings",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Maroon"],
    inStock: true,
    stockQuantity: 25
  },
  {
    id: "2",
    name: "Lakshmi Necklace with Jhumkas",
    category: "Necklace",
    price: 699.00,
    salePrice: 599.99,
    image: "/products/2.jpeg",
    description: "Lakshmi neck piece with jhumkas",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink"],
    inStock: true,
    stockQuantity: 30
  },
  {
    id: "3",
    name: "White stone neck piece with floral Earrings",
    category: "Necklace",
    price: 700.00,
    salePrice: 650.00,
    image: "/products/3.jpeg",
    description: "Necklace",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Dark Blue"],
    inStock: true,
    stockQuantity: 15
  },
  {
    id: "4",
    name: "Spiral stone neck piece with earrings",
    category: "Necklace",
    price: 675.00,
    salePrice: 650.00,
    image: "/products/4.jpeg",
    description: "Spiral stone neck piece with earrings",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red"],
    inStock: true,
    stockQuantity: 20
  },
  {
    id: "5",
    name: "Lakshmi attigai with ear studs",
    category: "Necklace",
    price: 675.00,
    salePrice: 550.00,
    image: "/products/5.jpeg",
    description: "Lakshmi attigai with ear studs",
    sizes: ["24", "26", "28", "30", "32"],
    colors: ["Blue", "Black", "Light Wash"],
    inStock: true,
    stockQuantity: 40
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};