"use client";

import { useRef } from "react";

import ProductCard from "@/components/ProductCard";

import { products } from "@/data/products";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


export default function RelatedProducts() {


  const scrollRef =
    useRef<HTMLDivElement>(null);



  const scroll = (
    direction: "left" | "right"
  ) => {


    scrollRef.current?.scrollBy({

      left:
        direction === "left"
          ? -320
          : 320,

      behavior: "smooth",

    });


  };





  return (

    <section className="mt-10">


      <h2 className="mb-8 text-3xl font-extrabold text-gray-900">

        You May Also Like

      </h2>





      <div className="relative">



        {/* Left */}

        <button

          onClick={() =>
            scroll("left")
          }

          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-orange-500 hover:text-white"

        >

          <ChevronLeft />

        </button>






        {/* Products */}

        <div

          ref={scrollRef}

          className="flex gap-6 overflow-x-auto scroll-smooth px-12 pb-4 [scrollbar-width:none]"

        >


          {products.map((product) => (


            <div

              key={product.id}

              className="min-w-[240px] max-w-[240px]"

            >


              <ProductCard

                product={product}

              />


            </div>


          ))}


        </div>








        {/* Right */}

        <button

          onClick={() =>
            scroll("right")
          }

          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-orange-500 hover:text-white"

        >

          <ChevronRight />

        </button>



      </div>


    </section>

  );

}