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

    <div className="group relative w-full bg-white p-2 transition">


      {/* Wishlist */}

      <button className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow hover:text-red-500">

        <Heart size={17} />

      </button>





      <Link href={`/products/${product.id}`}>


        {/* Image */}

        <div className="flex h-52 items-center justify-center bg-gray-50">


          <Image

            src={product.image}

            alt={product.name}

            width={220}

            height={220}

            className="max-h-44 w-auto object-contain transition duration-300 group-hover:scale-105"

          />


        </div>






        {/* Details */}

        <div className="pt-3">


          <div className="flex items-center gap-2">


            <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">

              {product.discount}

            </span>


            <span className="text-xs font-semibold text-red-600">

              Deal

            </span>


          </div>





          <p className="mt-3 text-xs text-gray-500">

            {product.brand}

          </p>




          <h3 className="line-clamp-2 text-sm text-gray-900">

            {product.name}

          </h3>





          <div className="mt-2 flex items-center gap-1">


            {[...Array(product.rating)].map(
              (_, index) => (

                <Star

                  key={index}

                  size={14}

                  className="fill-yellow-400 text-yellow-400"

                />

              )
            )}



            <span className="ml-1 text-xs text-gray-500">

              ({product.reviews})

            </span>


          </div>





          <div className="mt-3 flex items-center gap-2">


            <span className="text-xl font-bold">

              ₹{product.price.toLocaleString("en-IN")}

            </span>



            <span className="text-xs text-gray-400 line-through">

              ₹{product.oldPrice.toLocaleString("en-IN")}

            </span>


          </div>




          <p className="mt-2 text-xs text-green-600">

            FREE Delivery

          </p>


        </div>


      </Link>







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


        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"

      >


        <ShoppingCart size={17} />

        Add to Cart


      </button>



    </div>

  );

}