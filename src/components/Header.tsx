"use client";

import Link from "next/link";
import {
  Heart,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();

  return (

    <header className="sticky top-0 z-50 bg-white shadow-sm">


      {/* Top Header */}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


        {/* Logo */}

        <Link href="/">

          <h1 className="cursor-pointer text-4xl font-extrabold text-orange-500">

            Kotoze

          </h1>

        </Link>





        {/* Search */}

        <div className="mx-8 max-w-4xl flex-1">


          <div className="relative rounded-full border border-gray-300 bg-white shadow-sm">


            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />



            <input

              type="text"

              placeholder="Search products..."

              className="w-full rounded-full bg-transparent py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none"

            />


          </div>


        </div>






        {/* Icons */}

        <div className="flex items-center gap-6 text-gray-700">



          {/* Wishlist */}

          <Link
            href="/wishlist"
            className="relative transition hover:text-orange-500"
          >

            <Heart
              size={24}
              strokeWidth={2}
            />



            {wishlistCount > 0 && (

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">

                {wishlistCount}

              </span>

            )}


          </Link>






          {/* Cart */}

          <Link
            href="/cart"
            className="relative transition hover:text-orange-500"
          >

            <ShoppingCart
              size={24}
              strokeWidth={2}
            />



            {cartCount > 0 && (

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">

                {cartCount}

              </span>

            )}


          </Link>






          {/* Account */}

         <Link

  href={isLoggedIn ? "/account" : "/login"}

  className="transition hover:text-orange-500"

>

  <User
    size={24}
    strokeWidth={2}
  />

</Link>


        </div>


      </div>







      {/* Navigation */}

      <div className="border-t border-gray-200">


        <nav className="mx-auto flex max-w-7xl gap-10 px-6 py-3 font-medium text-gray-700">



          <Link
            href="/"
            className="transition hover:text-orange-500"
          >

            Home

          </Link>



          <Link
            href="/products"
            className="transition hover:text-orange-500"
          >

            Products

          </Link>




          <Link
            href="/categories"
            className="transition hover:text-orange-500"
          >

            Categories

          </Link>




          <Link
            href="/offers"
            className="transition hover:text-orange-500"
          >

            Offers

          </Link>




          <Link
            href="/contact"
            className="transition hover:text-orange-500"
          >

            Contact

          </Link>


        </nav>


      </div>



    </header>

  );

}