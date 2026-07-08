"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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


  const [canLeft, setCanLeft] =
    useState(false);


  const [canRight, setCanRight] =
    useState(false);



  const flashSaleProducts =
    products.filter(
      (product) => product.flashSale
    );



  const checkScroll = () => {

    const el = scrollRef.current;

    if (!el) return;


    setCanLeft(
      el.scrollLeft > 0
    );


    setCanRight(
      el.scrollLeft + el.clientWidth <
      el.scrollWidth - 5
    );

  };



  useEffect(() => {

    checkScroll();

  }, []);




  const scroll = (
    direction: "left" | "right"
  ) => {


    const el = scrollRef.current;

    if (!el) return;


    el.scrollBy({

      left:
        direction === "left"
          ? -400
          : 400,

      behavior: "smooth",

    });


    setTimeout(checkScroll, 300);

  };





  return (

    <section className="bg-orange-50 py-6">


      <div className="mx-auto max-w-7xl px-6">



        {/* Header */}

        <div className="mb-8 flex items-center justify-between">


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






        <div className="relative">



          {/* Left Arrow */}

          {canLeft && (

            <button

              onClick={() => scroll("left")}

              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-4 shadow-xl"

            >

              <ChevronLeft />

            </button>

          )}







          {/* Products */}

{/* Products */}

<div

  ref={scrollRef}

  onScroll={checkScroll}

  className="flex gap-0 overflow-hidden scroll-smooth pb-4"

>

  {flashSaleProducts.map((product) => (

    <div

      key={product.id}

      className="w-[185px] shrink-0"

    >

      <ProductCard product={product} />

    </div>

  ))}

</div>





          {/* Right Arrow */}

          {canRight && (

            <button

              onClick={() => scroll("right")}

              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-4 shadow-xl"

            >

              <ChevronRight />

            </button>

          )}


        </div>






        <div className="mt-4 text-center">


          <button className="rounded-xl bg-orange-500 px-8 py-3 font-bold text-white hover:bg-orange-600">

            View All Deals

          </button>


        </div>



      </div>


    </section>

  );

}