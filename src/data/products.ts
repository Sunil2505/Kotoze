export type Product = {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
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

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "₹2,499",
    oldPrice: "₹3,199",
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
    price: "₹3,299",
    oldPrice: "₹4,199",
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
];
export default products;