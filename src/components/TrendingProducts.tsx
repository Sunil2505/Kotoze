"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ProductCard from "./ProductCard";

import { products } from "@/data/products";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


export default function TrendingProducts() {


  const trendingProducts =
    products.filter(
      (product) => product.trending
    );


  const scrollRef =
    useRef<HTMLDivElement>(null);


  const [canLeft, setCanLeft] =
    useState(false);


  const [canRight, setCanRight] =
    useState(false);





  const checkScroll = () => {


    const el =
      scrollRef.current;


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


    const el =
      scrollRef.current;


    if (!el) return;



    el.scrollBy({

      left:
        direction === "left"
          ? -400
          : 400,


      behavior: "smooth",

    });



    setTimeout(
      checkScroll,
      300
    );


  };








  return (

    <section className="bg-white py-6">


      <div className="mx-auto max-w-7xl px-6">



        <h2 className="mb-6 text-4xl font-extrabold text-gray-900">

          🔥 Trending Products

        </h2>








        <div className="relative">






          {canLeft && (

            <button

              onClick={() =>
                scroll("left")
              }

              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-4 shadow-xl"

            >

              <ChevronLeft />

            </button>

          )}









          <div

            ref={scrollRef}

            onScroll={checkScroll}

            className="flex gap-0 overflow-hidden scroll-smooth pb-4"

          >


            {trendingProducts.map(
              (product) => (


                <div

                  key={product.id}

                  className="w-[185px] shrink-0"

                >


                  <ProductCard

                    product={product}

                  />


                </div>


              )
            )}


          </div>









          {canRight && (

            <button

              onClick={() =>
                scroll("right")
              }

              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-4 shadow-xl"

            >

              <ChevronRight />

            </button>

          )}





        </div>


      </div>


    </section>

  );

}