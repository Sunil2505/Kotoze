"use client";

import Image from "next/image";
import { Trash2, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";


export default function WishlistPage() {

  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();
  const { addToCart } = useCart();


  if (wishlist.length === 0) {

    return (

      <main className="min-h-screen bg-gray-50 py-16">

        <div className="mx-auto max-w-7xl px-6 text-center">

          <Heart
            size={70}
            className="mx-auto text-orange-500"
          />


          <h1 className="mt-5 text-4xl font-bold text-gray-900">
            Your wishlist is empty
          </h1>


          <p className="mt-3 text-gray-600">
            Save your favourite products here.
          </p>


        </div>

      </main>

    );

  }


  return (

    <main className="min-h-screen bg-gray-50 py-12">

      <div className="mx-auto max-w-7xl px-6">


        <h1 className="mb-6 text-2xl font-extrabold text-gray-900">
          My Wishlist ❤️
        </h1>



        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


          {wishlist.map((item) => (

            <div
             key={item.id}
             className="w-72 rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg"
            >


              {/* Image */}

              <div className="flex h-36 items-center justify-center rounded-xl bg-white">

                <Image
                  src={item.image}
                  alt={item.name}
                  width={130}
                  height={130}
                  className="object-contain"
                />

              </div>



              {/* Info */}

              <h2 className="mt-3 text-lg font-bold text-gray-900">

                {item.name}

              </h2>



              <p className="mt-2 text-xl font-extrabold text-orange-500">

                ₹{item.price.toLocaleString("en-IN")}

              </p>




              {/* Buttons */}

              <div className="mt-5 flex gap-3">


                <button
                onClick={() => {

                    addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1,
                    });

                    removeFromWishlist(item.id);

                }}

                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-2 font-semibold text-white transition hover:bg-orange-600"
                >

                <ShoppingCart size={18} />

                Move to Cart

                </button>


                <button
                  onClick={() =>
                    removeFromWishlist(item.id)
                  }
                  className="rounded-xl border border-red-400 px-4 text-red-500 transition hover:bg-red-50"
                >

                  <Trash2 size={20} />

                </button>


              </div>


            </div>


          ))}


        </div>


      </div>


    </main>

  );

}