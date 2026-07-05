"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import { products } from "@/data/products";

import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewSection from "@/components/ReviewSection";


export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const { id } = use(params);

  const router = useRouter();

  const { addToCart } = useCart();

  const { toggleWishlist } = useWishlist();

  const [quantity, setQuantity] =
    useState(1);



  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

  }, []);




  const product =
    products.find(
      (item) =>
        item.id === Number(id)
    );



  if (!product) {

    return (

      <main className="py-20">

        <h1 className="text-center text-3xl font-bold">

          Product Not Found

        </h1>

      </main>

    );

  }





  return (

    <main className="mx-auto max-w-6xl px-6 py-3">


      {/* Back */}

      <button

        onClick={() => router.back()}

        className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2white"

      >

        <ArrowLeft size={20} />

        Back

      </button>






      <div className="grid gap-6 lg:grid-cols-2">


        {/* Image */}


        <div className="group flex h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow">


          <Image

            src={product.image}

            alt={product.name}

            width={280}

            height={280}

            className="object-contain transition-transform duration-500 group-hover:scale-125"

          />


        </div>








        {/* Details */}


        <div>


          <h1 className="text-2xl font-extrabold text-gray-900">

            {product.name}

          </h1>





          <div className="mt-4 flex items-center gap-2">


            {[...Array(product.rating)].map(
              (_, index) => (

                <Star

                  key={index}

                  size={18}

                  className="fill-yellow-400 text-yellow-400"

                />

              )
            )}


            <span className="text-gray-600">

              ({product.reviews} Reviews)

            </span>


          </div>







          <div className="mt-5 flex items-center gap-4">


            <span className="text-2xl font-extrabold text-orange-600">

              ₹{product.price.toLocaleString("en-IN")}

            </span>



            <span className="text-xl text-gray-500 line-through">

              ₹{product.oldPrice.toLocaleString("en-IN")}

            </span>



            <span className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">

              {product.discount}

            </span>


          </div>








          <div className="mt-5 space-y-3 font-medium text-gray-800">

            <p>✓ In Stock</p>

            <p>🚚 Free Delivery within 2 - 4 days</p>

            <p>🔒 100% Secure Payment</p>

            <p>🏷 Brand: {product.brand}</p>

          </div>








          {/* Quantity */}


          <div className="mt-7 flex items-center gap-4">


            <span className="font-bold">

              Quantity

            </span>



            <div className="flex overflow-hidden rounded-xl border">


              <button

                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity - 1
                    )
                  )
                }

                className="px-5 py-2 text-xl font-bold"

              >

                -

              </button>




              <span className="border-x px-6 py-2 font-bold">

                {quantity}

              </span>





              <button

                onClick={() =>
                  setQuantity(
                    quantity + 1
                  )
                }

                className="px-5 py-2 text-xl font-bold"

              >

                +

              </button>


            </div>


          </div>









          {/* Buttons */}


          <div className="mt-8 flex flex-wrap gap-4">


            <button

              onClick={() =>

                addToCart({

                  id: product.id,

                  name: product.name,

                  price: product.price,

                  image: product.image,

                  quantity,

                })

              }


              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"

            >


              <ShoppingCart />

              Add to Cart


            </button>







            <button className="rounded-xl bg-green-600 px-8 py-4 font-bold text-white hover:bg-green-700">

              Buy Now

            </button>







            <button

              onClick={() =>

                toggleWishlist({

                  id: product.id,

                  name: product.name,

                  price: product.price,

                  image: product.image,

                })

              }

              className="rounded-xl border p-4 hover:text-orange-500"

            >

              <Heart />

            </button>



          </div>


        </div>


      </div>








      <ProductTabs />


      <ReviewSection productId={product.id} />


      <RelatedProducts />



    </main>

  );

}