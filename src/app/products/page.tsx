"use client";

import { useState } from "react";

import ProductCard from "@/components/ProductCard";

import { products } from "@/data/products";

import {
  SlidersHorizontal,
  X,
} from "lucide-react";


export default function ProductsPage() {


  const [category, setCategory] =
    useState("All");


  const [brand, setBrand] =
    useState("All");


  const [sort, setSort] =
    useState("");


  const [filterOpen, setFilterOpen] =
    useState(false);





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








  const FilterContent = () => (

    <>


      <div className="mb-6 flex items-center justify-between">


        <h2 className="text-xl font-bold">

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


    </>

  );









  return (

    <main className="min-h-screen bg-gray-50 py-10">


      <div className="mx-auto max-w-7xl px-6">


        <h1 className="mb-8 text-4xl font-extrabold">

          Products

        </h1>






        {/* Mobile Controls */}

        <div className="mb-6 flex items-center justify-between lg:hidden">


          <button

            onClick={() =>
              setFilterOpen(true)
            }

            className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold shadow"

          >


            <SlidersHorizontal size={18} />

            Filters


          </button>





          <select

            value={sort}

            onChange={(e) =>
              setSort(e.target.value)
            }

            className="rounded-xl border bg-white px-4 py-3"

          >


            <option value="">
              Sort
            </option>


            <option value="low">
              Low to High
            </option>


            <option value="high">
              High to Low
            </option>


          </select>


        </div>









        <div className="grid gap-8 lg:grid-cols-4">






          {/* Desktop Filter */}

          <aside className="hidden rounded-2xl bg-white p-6 shadow lg:block">


            <FilterContent />


            {/* Deal Zone */}

            <div className="mt-8 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-lg">


              <div className="bg-orange-500 px-5 py-4">

                <h3 className="text-lg font-extrabold text-white">

                  🔥 Deal Zone

                </h3>

              </div>



              <div className="p-5">


                <p className="text-sm text-gray-600">

                  Limited time offers

                </p>


                <h2 className="mt-4 text-4xl font-extrabold text-orange-500">

                  50% OFF

                </h2>


                <p className="mt-2 text-xs text-gray-500">

                  On top selling products

                </p>



                <button className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white">

                  View Deals

                </button>


              </div>


            </div>



          </aside>










          {/* Products */}

          <section className="lg:col-span-3">


            <div className="mb-6 hidden items-center justify-between lg:flex">


              <p className="text-gray-600">

                Showing {filteredProducts.length} products

              </p>





              <select

                value={sort}

                onChange={(e) =>
                  setSort(e.target.value)
                }

                className="rounded-xl border bg-white px-5 py-3"

              >


                <option value="">
                  Sort Products
                </option>


                <option value="low">
                  Price Low to High
                </option>


                <option value="high">
                  Price High to Low
                </option>


              </select>


            </div>







            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">


              {filteredProducts.map((product) => (


                <ProductCard

                  key={product.id}

                  product={product}

                />


              ))}


            </div>


          </section>


        </div>


      </div>










      {/* Mobile Filter Drawer */}

      {filterOpen && (


        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">


          <div className="h-full w-80 bg-white p-6 shadow-xl">


            <button

              onClick={() =>
                setFilterOpen(false)
              }

              className="mb-6"

            >


              <X />


            </button>



            <FilterContent />


          </div>


        </div>


      )}


    </main>

  );

}