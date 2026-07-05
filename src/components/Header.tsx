"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useState,
  KeyboardEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  Heart,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";


import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";

import { products } from "@/data/products";


export default function Header() {


  const router = useRouter();


  const { cartCount } =
    useCart();

  const { wishlistCount } =
    useWishlist();

  const { isLoggedIn } =
    useAuth();


  const {
    search,
    setSearch,
  } = useSearch();


  const [selectedIndex, setSelectedIndex] =
    useState(-1);


  const [searchOpen, setSearchOpen] =
    useState(false);





  const suggestions =
    search.trim() === ""

      ? products.slice(0, 6)

      : products
          .filter((product) => {


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


          })
          .slice(0, 6);






  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {


    if (e.key === "ArrowDown") {

      e.preventDefault();

      setSelectedIndex((prev) =>

        prev < suggestions.length - 1
          ? prev + 1
          : 0

      );

    }




    if (e.key === "ArrowUp") {

      e.preventDefault();

      setSelectedIndex((prev) =>

        prev > 0
          ? prev - 1
          : suggestions.length - 1

      );

    }





    if (
      e.key === "Enter" &&
      selectedIndex >= 0
    ) {


      const product =
        suggestions[selectedIndex];


      router.push(
        `/products/${product.id}`
      );


      setSearch("");

      setSearchOpen(false);

      setSelectedIndex(-1);


    }






    if (e.key === "Escape") {


      setSearchOpen(false);

      setSelectedIndex(-1);


    }


  };








  return (

    <header className="sticky top-0 z-50 bg-white shadow-sm">


      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1">



        {/* Logo */}

        <Link href="/">

          <Image

            src="/images/logo/kotoze-logo.png"

            alt="Kotoze Logo"

            width={90}

            height={35}

            priority

            className="object-contain"

          />

        </Link>







        {/* Search */}

        <div className="relative mx-8 max-w-4xl flex-1">


          <div className="relative rounded-full border border-gray-300 bg-white shadow-sm">


            <Search

              size={20}

              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"

            />



            <input

              type="text"

              value={search}

              onFocus={() =>
                setSearchOpen(true)
              }

              onChange={(e) => {

                setSearch(e.target.value);

                setSelectedIndex(-1);

              }}

              onKeyDown={handleKeyDown}

              placeholder="Search products..."

              className="w-full rounded-full bg-transparent py-2 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none"

            />


          </div>
                    {/* Suggestions */}

          {searchOpen && (

            <div className="absolute left-0 top-14 z-50 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">


              {search.trim() === "" && (

                <p className="px-4 py-2 text-xs font-semibold text-gray-500">

                  Popular Searches

                </p>

              )}




              {suggestions.length > 0 ? (


                suggestions.map((product, index) => (


                  <div

                    key={product.id}

                    onClick={() => {

                      router.push(
                        `/products/${product.id}`
                      );

                      setSearch("");

                      setSearchOpen(false);

                      setSelectedIndex(-1);

                    }}


                    className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2 transition-all duration-200
                    ${
                      selectedIndex === index
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}

                  >


                  {search.trim() === "" ? (

                    <Search

                      size={18}

                      className="text-gray-400"

                    />

                  ) : (


                    <Image

                      src={product.image}

                      alt={product.name}

                      width={40}

                      height={40}

                      className="h-10 w-10 rounded-lg bg-gray-50 object-contain p-1"

                    />


                  )}


                    <div>


                      <h3 className="text-sm font-semibold text-gray-900">

                        {product.name}

                      </h3>



                      <p className="text-xs text-gray-500">

                        {product.brand}

                      </p>


                    </div>



                  </div>


                ))


              ) : (


                <p className="p-4 text-center text-gray-500">

                  No products found

                </p>


              )}


            </div>


          )}


        </div>









        {/* Icons */}

        <div className="flex items-center gap-6 text-gray-700">


          <Link

            href="/wishlist"

            className="relative hover:text-orange-500"

          >


            <Heart size={24} />


            {wishlistCount > 0 && (

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">

                {wishlistCount}

              </span>

            )}


          </Link>








          <Link

            href="/cart"

            className="relative hover:text-orange-500"

          >


            <ShoppingCart size={24} />


            {cartCount > 0 && (

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">

                {cartCount}

              </span>

            )}


          </Link>








          <Link

            href={
              isLoggedIn
                ? "/account"
                : "/login"
            }

            className="hover:text-orange-500"

          >


            <User size={24} />


          </Link>


        </div>


      </div>









      {/* Navigation */}

      <div className="border-t border-gray-200">


        <nav className="mx-auto flex max-w-7xl gap-10 px-6 py-2 text-sm font-medium text-gray-700">


          <Link href="/">
            Home
          </Link>


          <Link href="/products">
            Products
          </Link>


          <Link href="/categories">
            Categories
          </Link>


          <Link href="/offers">
            Offers
          </Link>


          <Link href="/contact">
            Contact
          </Link>


        </nav>


      </div>



    </header>

  );

}