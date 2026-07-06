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

    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">



      {/* Offer Bar */}

      <div className="flex items-center justify-between bg-orange-500 px-3 py-2">


        <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white">

          {product.discount}

        </span>


        <button className="rounded-full bg-white p-1.5 text-gray-700 hover:text-red-500">

          <Heart size={15} />

        </button>


      </div>









      <Link href={`/products/${product.id}`}>


        {/* Image */}


        <div className="flex h-28 items-center justify-center bg-white p-2 sm:h-40">


          <Image

            src={product.image}

            alt={product.name}

            width={160}

            height={160}

            className="h-20 w-auto object-contain transition duration-300 group-hover:scale-110 sm:h-32"

          />


        </div>








        {/* Details */}

        <div className="p-3">


          <h3 className="line-clamp-2 text-sm font-bold text-gray-900 sm:text-base">

            {product.name}

          </h3>







          {/* Rating */}

          <div className="mt-2 flex items-center gap-0.5">


            {[...Array(product.rating)].map(
              (_, index) => (

                <Star

                  key={index}

                  size={13}

                  className="fill-yellow-400 text-yellow-400"

                />

              )
            )}



            <span className="ml-1 text-[11px] text-gray-500">

              ({product.reviews})

            </span>


          </div>









          {/* Price */}

          <div className="mt-2 flex flex-wrap items-center gap-1">


            <span className="text-lg font-extrabold text-orange-500 sm:text-xl">

              ₹{product.price.toLocaleString("en-IN")}

            </span>



            <span className="text-xs text-gray-400 line-through">

              ₹{product.oldPrice.toLocaleString("en-IN")}

            </span>


          </div>



        </div>


      </Link>










      {/* Button */}

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


          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-xs font-bold text-white hover:bg-orange-600 sm:text-sm"

        >


          <ShoppingCart size={16} />


          Add to Cart


        </button>


      </div>



    </div>

  );

}