"use client";

import ProductCard from "./ProductCard";

import { useEffect, useRef } from "react";

import { useSearch } from "@/context/SearchContext";

import { products } from "@/data/products";


export default function FeaturedProducts() {


  const { search } = useSearch();


  const sectionRef =
    useRef<HTMLDivElement>(null);



  useEffect(() => {


    if (search.trim() !== "") {


      sectionRef.current?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });


    }


  }, [search]);





  const filteredProducts =
    products.filter((product) =>

      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );





  return (

    <section

      id="products"

      ref={sectionRef}

      className="pt-32 pb-16"

    >


      <div className="mx-auto max-w-7xl px-6">


        <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">


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



          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">



            {filteredProducts.map((product) => (


              <ProductCard

                key={product.id}

                product={product}

              />


            ))}



          </div>



        )}



      </div>


    </section>

  );

}