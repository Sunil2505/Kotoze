"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";


type ProductCardProps = {
  product: Product;
};


export default function ProductCard({
  product,
}: ProductCardProps) {


  const { addToCart } = useCart();


  return (

    <div className="group relative bg-white p-2 transition">


      {/* Wishlist */}

      <button className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow hover:text-red-500">

        <Heart size={16} />

      </button>





      <Link href={`/products/${product.id}`}>


        {/* Image */}

        <div className="flex h-32 items-center justify-center">

          <Image

            src={product.image}

            alt={product.name}

            width={150}

            height={150}

            className="h-28 w-auto object-contain transition group-hover:scale-105"

          />

        </div>





        {/* Discount */}

        <div className="mt-2 flex items-center gap-2">

          <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">

            {product.discount}

          </span>


          <span className="text-xs font-bold text-red-600">

            Deal

          </span>

        </div>





        {/* Brand */}

        <p className="mt-2 text-xs text-gray-500">

          {product.brand}

        </p>





        {/* Name */}

        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">

          {product.name}

        </h3>





        {/* Rating */}

        <div className="mt-2 flex items-center gap-1">

          {[...Array(product.rating)].map(
            (_, index) => (

              <Star

                key={index}

                size={13}

                className="fill-yellow-400 text-yellow-400"

              />

            )
          )}


          <span className="ml-1 text-xs text-gray-500">

            ({product.reviews})

          </span>


        </div>





        {/* Price */}

        <div className="mt-2">


          <span className="text-lg font-bold">

            ₹{product.price.toLocaleString("en-IN")}

          </span>


          <span className="ml-2 text-xs text-gray-400 line-through">

            ₹{product.oldPrice.toLocaleString("en-IN")}

          </span>


        </div>





        <p className="mt-1 text-xs text-green-600">

          FREE Delivery

        </p>



      </Link>





      {/* Cart */}

      <button

        onClick={() =>

          addToCart({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1,

          })

        }

        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"

      >

        <ShoppingCart size={16} />

        Add to Cart

      </button>


    </div>

  );

}