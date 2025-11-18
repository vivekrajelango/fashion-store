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
    name: "Women Maroon Top",
    category: "Tops",
    price: 975.00,
    salePrice: 899.99,
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Elegant maroon top with ruffle detail and embellished sleeves, perfect for both casual and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Maroon"],
    inStock: true,
    stockQuantity: 25
  },
  {
    id: "2",
    name: "Men's Pink Shirt",
    category: "Shirts",
    price: 775.00,
    salePrice: 599.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Classic pink button-down shirt for men, made from premium cotton for comfort and style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink"],
    inStock: true,
    stockQuantity: 30
  },
  {
    id: "3",
    name: "Dark Blue Top",
    category: "Tops",
    price: 675.00,
    salePrice: 799.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Stylish dark blue top with bell sleeves and keyhole neckline, perfect for evening occasions.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Dark Blue"],
    inStock: true,
    stockQuantity: 15
  },
  {
    id: "4",
    name: "Women Tunic",
    category: "Tunics",
    price: 475.00,
    salePrice: 399.99,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Long red tunic with side slits, perfect to pair with jeans or leggings for a chic look.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red"],
    inStock: true,
    stockQuantity: 20
  },
  {
    id: "5",
    name: "Classic Denim Jeans",
    category: "Bottoms",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "High-quality denim jeans with a classic fit and timeless style.",
    sizes: ["24", "26", "28", "30", "32"],
    colors: ["Blue", "Black", "Light Wash"],
    inStock: true,
    stockQuantity: 40
  },
  {
    id: "6",
    name: "Elegant Evening Gown",
    category: "Dresses",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "An elegant evening gown for special occasions and formal events.",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Red", "Navy"],
    inStock: true,
    stockQuantity: 8
  },
  {
    id: "7",
    name: "Casual White Blouse",
    category: "Tops",
    price: 39.99,
    salePrice: 29.99,
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "A versatile white blouse that pairs well with any outfit.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Off-white"],
    inStock: true,
    stockQuantity: 32
  },
  {
    id: "8",
    name: "Leather Jacket",
    category: "Outerwear",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "A stylish leather jacket to add edge to any outfit.",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Brown"],
    inStock: true,
    stockQuantity: 15
  },
  {
    id: "14",
    name: "Pleated Midi Skirt",
    category: "Bottoms",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "A versatile pleated midi skirt for both casual and formal occasions.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Beige", "Navy"],
    inStock: true,
    stockQuantity: 20
  },
  {
    id: "15",
    name: "Cozy Knit Sweater",
    category: "Tops",
    price: 69.99,
    salePrice: 59.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "A warm and cozy knit sweater for colder days.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Burgundy"],
    inStock: true,
    stockQuantity: 28
  },
  {
    id: "13",
    name: "High-Waisted Shorts",
    category: "Bottoms",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Stylish high-waisted shorts for summer days.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Denim", "Black", "White"],
    inStock: true,
    stockQuantity: 22
  },
  {
    id: "9",
    name: "Formal Blazer",
    category: "Outerwear",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "A professional blazer for formal occasions and office wear.",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Navy", "Gray"],
    inStock: true,
    stockQuantity: 18
  },
  {
    id: "10",
    name: "Summer Sandals",
    category: "Footwear",
    price: 34.99,
    salePrice: 29.99,
    image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Comfortable and stylish sandals for summer.",
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["Tan", "Black", "White"],
    inStock: true,
    stockQuantity: 30
  },
  {
    id: "11",
    name: "Silk Scarf",
    category: "Accessories",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "A luxurious silk scarf to elevate any outfit.",
    sizes: ["One Size"],
    colors: ["Multicolor", "Blue", "Red"],
    inStock: true,
    stockQuantity: 45
  },
  {
    id: "12",
    name: "Designer Handbag",
    category: "Accessories",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "A stylish designer handbag for everyday use.",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    inStock: true,
    stockQuantity: 12
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};