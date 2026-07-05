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

    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">


      {/* Top */}

      <div className="flex items-center justify-between bg-orange-500 px-4 py-2">


        <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">

          {product.discount}

        </span>


        <button className="rounded-full bg-white p-2 text-gray-700 hover:text-red-500">

          <Heart size={16} />

        </button>


      </div>





      <Link href={`/products/${product.id}`}>


        {/* Image */}

        <div className="flex h-40 items-center justify-center bg-white p-3">


          <Image

            src={product.image}

            alt={product.name}

            width={180}

            height={180}

            className="h-32 w-auto object-contain transition group-hover:scale-110"

          />


        </div>





        {/* Details */}

        <div className="p-3">


          <h3 className="text-base font-bold text-gray-900">

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





          <div className="mt-2 flex items-center gap-2">


            <span className="text-xl font-bold text-orange-500">

              ₹{product.price.toLocaleString("en-IN")}

            </span>


            <span className="text-xs text-gray-400 line-through">

              ₹{product.oldPrice.toLocaleString("en-IN")}

            </span>


          </div>


        </div>


      </Link>





      <div className="px-3 pb-3">


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

          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"

        >

          <ShoppingCart size={18} />

          Add to Cart

        </button>


      </div>


    </div>

  );

}