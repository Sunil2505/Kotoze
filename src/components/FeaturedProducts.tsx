"use client";

import ProductCard from "./ProductCard";
import { useEffect, useRef } from "react";
import { useSearch } from "@/context/SearchContext";

const products = [
  
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    oldPrice: "₹3,199",
    image: "/images/products/headphones.jpg",
    rating: "★★★★★",
    reviews: 124,
    discount: "20% OFF",
  },

  {
    id: 2,
    name: "Smart Watch",
    price: 3299,
    oldPrice: "₹4,199",
    image: "/images/products/watch.jpg",
    rating: "★★★★☆",
    reviews: 89,
    discount: "15% OFF",
  },

  {
    id: 3,
    name: "Laptop Backpack",
    price: 1499,
    oldPrice: "₹1,999",
    image: "/images/products/backpack.jpg",
    rating: "★★★★★",
    reviews: 57,
    discount: "25% OFF",
  },

  {
    id: 4,
    name: "Office Chair",
    price: 5999,
    oldPrice: "₹7,499",
    image: "/images/products/chair.jpg",
    rating: "★★★★☆",
    reviews: 41,
    discount: "18% OFF",
  },
];


export default function FeaturedProducts() {

  const { search } = useSearch();

const sectionRef = useRef<HTMLDivElement>(null);


useEffect(() => {

  if (search.trim() !== "") {

    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  }

}, [search]);
  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


return (
<section
  id="products"
  ref={sectionRef}
  className="pt-32 pb-16"
>

      <div className="mx-auto max-w-7xl px-6">


        <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">

          Featured Products

        </h2>


{filteredProducts.length === 0 ? (

  <div className="py-20 text-center">

    <h3 className="text-3xl font-bold text-gray-900">

      🔍 No products found

    </h3>


    <p className="mt-3 text-gray-500">

      Try searching something else

    </p>


  </div>


) : (


  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


    {filteredProducts.map((product) => (


      <ProductCard

        key={product.id}

        product={product}

      />


    ))}


  </div>


)}


      </div>

    </section>

  );

}