import ProductCard from "./ProductCard";
import Countdown from "./Countdown";

const flashSaleProducts = [
  {
    name: "Bluetooth Speaker",
    price: "₹1,999",
    oldPrice: "₹2,999",
    image: "/images/products/speaker.jpg",
    rating: "★★★★★",
    reviews: 86,
    discount: "33% OFF",
  },
  {
    name: "Gaming Mouse",
    price: "₹899",
    oldPrice: "₹1,299",
    image: "/images/products/mouse.jpg",
    rating: "★★★★★",
    reviews: 124,
    discount: "30% OFF",
  },
  {
    name: "Power Bank",
    price: "₹1,299",
    oldPrice: "₹1,799",
    image: "/images/products/powerbank.jpg",
    rating: "★★★★☆",
    reviews: 73,
    discount: "28% OFF",
  },
  {
    name: "Wireless Earbuds",
    price: "₹2,499",
    oldPrice: "₹3,499",
    image: "/images/products/earbuds.jpg",
    rating: "★★★★★",
    reviews: 210,
    discount: "29% OFF",
  },
];

export default function FlashSale() {
  return (
    <section className="bg-orange-50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-orange-500">
              🔥 Flash Sale
            </h2>

            <p className="mt-2 text-gray-600">
              Limited time deals. Grab them before they're gone!
            </p>
          </div>

          <Countdown />
        </div>

        {/* Products */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flashSaleProducts.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <button className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg">
            View All Deals
          </button>
        </div>
      </div>
    </section>
  );
}