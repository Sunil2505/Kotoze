import ProductCard from "./ProductCard";

const products = [
  {
    name: "Wireless Headphones",
    price: "₹2,499",
    oldPrice: "₹3,199",
    image: "/images/products/headphones.jpg",
    rating: "★★★★★",
    reviews: 124,
    discount: "20% OFF",
  },
  {
    name: "Smart Watch",
    price: "₹3,299",
    oldPrice: "₹4,199",
    image: "/images/products/watch.jpg",
    rating: "★★★★☆",
    reviews: 89,
    discount: "15% OFF",
  },
  {
    name: "Laptop Backpack",
    price: "₹1,499",
    oldPrice: "₹1,999",
    image: "/images/products/backpack.jpg",
    rating: "★★★★★",
    reviews: 57,
    discount: "25% OFF",
  },
  {
    name: "Office Chair",
    price: "₹5,999",
    oldPrice: "₹7,499",
    image: "/images/products/chair.jpg",
    rating: "★★★★☆",
    reviews: 41,
    discount: "18% OFF",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">
          Featured Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}