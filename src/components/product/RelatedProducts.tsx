"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ProductCard from "@/components/ProductCard";

import { products } from "@/data/products";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


export default function RelatedProducts() {


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
          ? -el.clientWidth
          : el.clientWidth,


      behavior: "smooth",

    });



    setTimeout(
      checkScroll,
      400
    );


  };









  return (

    <section className="mt-10">


      <h2 className="mb-8 text-3xl font-extrabold text-gray-900">

        You May Also Like

      </h2>








      <div className="relative">







        {/* Left */}

        {canLeft && (

          <button

            onClick={() =>
              scroll("left")
            }

            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-orange-500 hover:text-white"

          >

            <ChevronLeft />

          </button>

        )}











        {/* Products */}

        <div

          ref={scrollRef}

          onScroll={checkScroll}

          className="flex gap-6 overflow-hidden scroll-smooth pb-4"

        >


          {products.map((product) => (


            <div

              key={product.id}

              className="basis-[calc((100%-72px)/4)] shrink-0"

            >


              <ProductCard

                product={product}

              />


            </div>


          ))}


        </div>












        {/* Right */}

        {canRight && (

          <button

            onClick={() =>
              scroll("right")
            }

            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-orange-500 hover:text-white"

          >

            <ChevronRight />

          </button>

        )}







      </div>


    </section>

  );

}