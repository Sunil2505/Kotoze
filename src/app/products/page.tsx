"use client";

import { useState } from "react";

import ProductCard from "@/components/ProductCard";

import { products } from "@/data/products";


export default function ProductsPage() {


  const [category, setCategory] =
    useState("All");


  const [brand, setBrand] =
    useState("All");


  const [sort, setSort] =
    useState("");





  const categories = [

    "All",

    ...new Set(
      products.map(
        (p) => p.category
      )
    ),

  ];




  const brands = [

    "All",

    ...new Set(
      products.map(
        (p) => p.brand
      )
    ),

  ];







  let filteredProducts =
    products.filter((product) => {


      const categoryMatch =
        category === "All" ||
        product.category === category;


      const brandMatch =
        brand === "All" ||
        product.brand === brand;


      return (
        categoryMatch &&
        brandMatch
      );


    });








  if (sort === "low") {


    filteredProducts =
      [...filteredProducts].sort(

        (a, b) =>
          a.price - b.price

      );


  }






  if (sort === "high") {


    filteredProducts =
      [...filteredProducts].sort(

        (a, b) =>
          b.price - a.price

      );


  }










  const clearFilters = () => {


    setCategory("All");

    setBrand("All");

    setSort("");


  };










  return (

    <main className="min-h-screen bg-gray-50 py-10">


      <div className="mx-auto max-w-7xl px-6">



        <h1 className="mb-8 text-4xl font-extrabold text-gray-900">

          Products

        </h1>





        <div className="grid gap-8 lg:grid-cols-4">






          {/* Filter Sidebar */}


          <aside className="rounded-2xl bg-white p-6 shadow">


            <div className="mb-6 flex items-center justify-between">


              <h2 className="text-xl font-bold text-gray-900">

                Filters

              </h2>


              <button

                onClick={clearFilters}

                className="text-sm font-semibold text-orange-500"

              >

                Clear

              </button>


            </div>

                        {/* Category */}

            <div className="mb-8">


              <h3 className="mb-4 font-bold text-gray-800">

                Category

              </h3>


              <div className="space-y-3">


                {categories.map((item) => (


                  <label

                    key={item}

                    className="flex cursor-pointer items-center gap-3 text-gray-700"

                  >


                    <input

                      type="radio"

                      checked={
                        category === item
                      }

                      onChange={() =>
                        setCategory(item)
                      }

                      className="accent-orange-500"

                    />


                    {item}


                  </label>


                ))}


              </div>


            </div>









            {/* Brand */}

            <div>


              <h3 className="mb-4 font-bold text-gray-800">

                Brand

              </h3>


              <div className="space-y-3">


                {brands.map((item) => (


                  <label

                    key={item}

                    className="flex cursor-pointer items-center gap-3 text-gray-700"

                  >


                    <input

                      type="radio"

                      checked={
                        brand === item
                      }

                      onChange={() =>
                        setBrand(item)
                      }

                      className="accent-orange-500"

                    />


                    {item}


                  </label>


                ))}


              </div>


            </div>

<div className="mt-6 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md">


  <div className="bg-orange-500 px-4 py-3">


    <h3 className="text-base font-extrabold text-white">

      🔥 Deal Zone

    </h3>


  </div>





  <div className="p-4">


    <p className="text-sm font-medium text-gray-600">

      Limited time offers

    </p>




    <h2 className="mt-3 text-3xl font-black text-orange-500">

      50% OFF

    </h2>




    <p className="mt-1 text-xs text-gray-500">

      On top selling products

    </p>





    <button className="mt-5 w-full rounded-lg bg-orange-500 py-2 text-sm font-bold text-white transition hover:bg-orange-600">


      View Deals


    </button>



  </div>


</div>
          </aside>









          {/* Products Area */}

          <section className="lg:col-span-3">



            <div className="mb-6 flex items-center justify-between">


              <p className="text-gray-600">


                Showing {filteredProducts.length} products


              </p>





              <select

                value={sort}

                onChange={(e) =>
                  setSort(e.target.value)
                }

                className="rounded-xl border bg-white px-5 py-3 outline-none"

              >


                <option value="">

                  Sort Products

                </option>


                <option value="low">

                  Price: Low to High

                </option>


                <option value="high">

                  Price: High to Low

                </option>


              </select>


            </div>









            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">


              {filteredProducts.map(
                (product) => (


                  <ProductCard

                    key={product.id}

                    product={product}

                  />


                )
              )}


            </div>



          </section>




        </div>



      </div>


    </main>

  );

}