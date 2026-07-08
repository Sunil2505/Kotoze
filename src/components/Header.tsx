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
  Menu,
  X,
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


  const [mobileMenu, setMobileMenu] =
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


      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1 md:px-6 md:py-2">


        {/* Logo */}

        <Link href="/">

        <Image
          src="/images/logo/kotoze-logo.png"
          alt="Kotoze Logo"
          width={70}
          height={28}
          className="md:h-auto md:w-[90px]"
        />

        </Link>







{/* Search */}

<div className="relative hidden flex-1 md:block">


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

      className="w-full rounded-full bg-transparent py-3 pl-12 pr-5 text-gray-900 placeholder:text-gray-400 outline-none"

    />


  </div>






          {/* Suggestions */}

          {searchOpen && (

            <div className="absolute top-14 z-50 w-full rounded-2xl bg-white shadow-2xl">


              {suggestions.map((product,index)=>(


                <div

                  key={product.id}

                  onClick={()=>{
                    router.push(`/products/${product.id}`);
                    setSearch("");
                    setSearchOpen(false);
                  }}

                  className={`flex cursor-pointer items-center gap-3 border-b px-4 py-2
                  ${
                    selectedIndex===index
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                  }`}

                >


                  {search.trim()==="" ? (

                    <Search
                      size={18}
                      className="text-gray-400"
                    />

                  ):(

                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />

                  )}


                  <div>

                    <p className="text-sm font-semibold">
                      {product.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {product.brand}
                    </p>

                  </div>


                </div>


              ))}


            </div>


          )}


        </div>










        {/* Icons */}

        <div className="flex items-center gap-5 text-gray-700">


          <Link href="/wishlist" className="relative">

            <Heart size={23}/>

            {wishlistCount > 0 && (

              <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-1 text-xs text-white">
                {wishlistCount}
              </span>

            )}

          </Link>






          <Link href="/cart" className="relative">

            <ShoppingCart size={23}/>

            {cartCount > 0 && (

              <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-1 text-xs text-white">
                {cartCount}
              </span>

            )}

          </Link>







          <Link href={isLoggedIn ? "/account" : "/login"}>

            <User size={23}/>

          </Link>








          {/* Mobile Button */}

          <button

            className="md:hidden"

            onClick={() =>
              setMobileMenu(!mobileMenu)
            }

          >

            {mobileMenu ? <X/> : <Menu/>}

          </button>


        </div>


      </div>










      {/* Desktop Nav */}

      <nav className="hidden border-t px-6 py-2 md:flex justify-center gap-10 text-sm font-medium">


        <Link href="/">Home</Link>

        <Link href="/products">Products</Link>

        <Link href="/categories">Categories</Link>

        <Link href="/offers">Offers</Link>

        <Link href="/contact">Contact</Link>


      </nav>









    

{mobileMenu && (

  <div className="border-t border-gray-100 bg-white shadow-md md:hidden">


    <nav className="flex flex-col px-6 py-2 text-sm font-medium text-gray-800">


      {[
        ["Home", "/"],
        ["Products", "/products"],
        ["Categories", "/categories"],
        ["Offers", "/offers"],
        ["Contact", "/contact"],
      ].map(([name, path]) => (


        <Link

          key={name}

          href={path}

          onClick={() =>
            setMobileMenu(false)
          }

          className="rounded-md px-3 py-1.5 leading-5 transition hover:bg-orange-50 hover:text-orange-500"

        >

          {name}

        </Link>


      ))}


    </nav>


  </div>

)}



    </header>

  );

}