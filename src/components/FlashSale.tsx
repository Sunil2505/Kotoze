"use client";

import { useRef } from "react";

import ProductCard from "./ProductCard";
import Countdown from "./Countdown";

import { products } from "@/data/products";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


export default function FlashSale() {


  const scrollRef =
    useRef<HTMLDivElement>(null);


  const flashSaleProducts =
    products.filter(
      (product) => product.flashSale
    );



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

    <section className="bg-orange-50 py-8">


      <div className="mx-auto max-w-7xl px-6">



        {/* Header */}

        <div className="mb-8 flex items-center justify-between">


          <div>


            <h2 className="text-3xl font-extrabold text-orange-500">

              🔥 Flash Sale

            </h2>


            <p className="mt-2 text-sm text-gray-600">

              Limited time deals. Grab them before they're gone!

            </p>


          </div>



          <Countdown />


        </div>








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


            {flashSaleProducts.map(
              (product) => (


                <div

                  key={product.id}

                  className="min-w-[240px] max-w-[240px]"

                >


                  <ProductCard

                    product={product}

                  />


                </div>


              )
            )}


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








        <div className="mt-6 text-center">


          <button className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600">


            View All Deals


          </button>


        </div>



      </div>


    </section>

  );

}