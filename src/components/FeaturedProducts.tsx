"use client";

import ProductCard from "./ProductCard";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useSearch } from "@/context/SearchContext";

import { products } from "@/data/products";


export default function FeaturedProducts() {


  const { search } = useSearch();


  const sectionRef =
    useRef<HTMLDivElement>(null);


  const scrollRef =
    useRef<HTMLDivElement>(null);



  const [canLeft, setCanLeft] =
    useState(false);

  const [canRight, setCanRight] =
    useState(false);




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





  useEffect(() => {

    if (search.trim() !== "") {

      sectionRef.current?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }


    setTimeout(checkScroll, 100);


  }, [search]);







  const filteredProducts =
  products.filter((product) => {


    if (search.trim() === "") {

      return product.featured;

    }


    const keyword =
      search.toLowerCase();


    return (

      product.name
        .toLowerCase()
        .includes(keyword) ||


      product.brand
        .toLowerCase()
        .includes(keyword) ||


      product.category
        .toLowerCase()
        .includes(keyword)

    );


  });






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


  setTimeout(checkScroll, 400);

};








  return (

    <section

      id="products"

      ref={sectionRef}

      className="scroll-mt-32 py-4"

    >


      <div className="mx-auto max-w-7xl px-6">


        <h2 className="mb-8 text-3xl font-extrabold text-gray-900">

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



          <div className="relative">





            {canLeft && (

              <button

                onClick={() =>
                  scroll("left")
                }

                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-orange-500 hover:text-white"

              >

                <ChevronLeft />

              </button>

            )}







            <div

              ref={scrollRef}

              onScroll={checkScroll}

             className="flex gap-0 overflow-hidden scroll-smooth px-0 pb-4"

            >


              {filteredProducts.map((product) => (


                <div

                  key={product.id}

                  className="w-[185px] shrink-0"

                >


                  <ProductCard

                    product={product}

                  />


                </div>


              ))}


            </div>







            {canRight && (

              <button

                onClick={() =>
                  scroll("right")
                }

                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-orange-500 hover:text-white"

              >

                <ChevronRight />

              </button>

            )}




          </div>

        )}


      </div>


    </section>

  );

}