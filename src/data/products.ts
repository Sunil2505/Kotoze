export type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  reviews: number;
  discount: string;
  category: string;
  brand: string;
  featured: boolean;
  trending: boolean;
  flashSale: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    oldPrice: 3199,
    image: "/images/products/headphones.jpg",
    rating: 5,
    reviews: 124,
    discount: "20% OFF",
    category: "Electronics",
    brand: "Sony",
    featured: true,
    trending: true,
    flashSale: false,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3299,
    oldPrice: 4199,
    image: "/images/products/watch.jpg",
    rating: 4,
    reviews: 89,
    discount: "15% OFF",
    category: "Electronics",
    brand: "Samsung",
    featured: true,
    trending: false,
    flashSale: true,
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 1999,
    oldPrice: 2499,
    image: "/images/products/speaker.jpg",
    rating: 5,
    reviews: 156,
    discount: "20% OFF",
    category: "Electronics",
    brand: "JBL",
    featured: false,
    trending: true,
    flashSale: true,
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    price: 2299,
    oldPrice: 2999,
    image: "/images/products/earbuds.jpg",
    rating: 4,
    reviews: 97,
    discount: "23% OFF",
    category: "Electronics",
    brand: "Boat",
    featured: true,
    trending: true,
    flashSale: false,
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 1499,
    oldPrice: 1999,
    image: "/images/products/mouse.jpg",
    rating: 5,
    reviews: 211,
    discount: "25% OFF",
    category: "Accessories",
    brand: "Logitech",
    featured: false,
    trending: true,
    flashSale: false,
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 3499,
    oldPrice: 4299,
    image: "/images/products/keyboard.jpg",
    rating: 5,
    reviews: 132,
    discount: "18% OFF",
    category: "Accessories",
    brand: "Redragon",
    featured: true,
    trending: false,
    flashSale: true,
  },
];

