"use client";

import { use, useEffect } from "react";
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


  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

  }, []);



  const product = products.find(
    (item) => item.id === Number(id)
  );


  if (!product) {

    return (

      <main className="py-20">

        <h1 className="text-center text-3xl font-bold text-gray-900">

          Product Not Found

        </h1>

      </main>

    );

  }



  return (

    <main className="mx-auto max-w-7xl px-6 py-6">


      {/* Back Button */}

      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-700 shadow transition hover:bg-orange-500 hover:text-white"
      >

        <ArrowLeft size={20} />

        Back

      </button>

      <div className="grid gap-12 lg:grid-cols-2">


        {/* Product Image */}


        <div className="flex items-center justify-center rounded-2xl bg-white p-10 shadow-lg">


          <Image

            src={product.image}

            alt={product.name}

            width={450}

            height={450}

            className="object-contain"

          />


        </div>







        {/* Product Details */}


        <div>


          <h1 className="text-4xl font-extrabold text-gray-900">

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



            <span className="font-medium text-gray-600">

              ({product.reviews} Reviews)

            </span>


          </div>






          <div className="mt-6 flex flex-wrap items-center gap-4">


            <span className="text-3xl font-extrabold text-orange-600">

              ₹{product.price.toLocaleString("en-IN")}

            </span>


            <span className="text-2xl text-gray-500 line-through">

              ₹{product.oldPrice.toLocaleString("en-IN")}

            </span>



            <span className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">

              {product.discount}

            </span>


          </div>






          <div className="mt-6 space-y-3 text-lg font-medium text-gray-800">


            <p>✓ In Stock</p>

            <p>🚚 Free Delivery within 2 - 4 days</p>

            <p>🔒 100% Secure Payment</p>

            <p>
              🏷 Brand: {product.brand}
            </p>


          </div>






          <div className="mt-10 flex flex-wrap gap-4">



            <button

              onClick={() =>

                addToCart({

                  id: product.id,

                  name: product.name,

                  price: product.price,

                  image: product.image,

                  quantity: 1,

                })

              }


              className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"

            >


              <ShoppingCart />


              Add to Cart


            </button>






            <button

              className="rounded-xl bg-green-600 px-8 py-4 font-bold text-white transition hover:bg-green-700"

            >

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


              className="rounded-xl border border-gray-300 p-4 text-gray-800 transition hover:border-orange-500 hover:text-orange-500"

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