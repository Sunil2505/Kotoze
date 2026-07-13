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
import { productDetails } from "@/data/productDetails";

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

  const [selectedImage, setSelectedImage] =
    useState("");


  const product =
    products.find(
      (item) =>
        item.id === Number(id)
    );


  const details =
    product
      ? productDetails[
          product.id as keyof typeof productDetails
        ]
      : null;


  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

  }, []);


  useEffect(() => {

    if (product) {
      setSelectedImage(product.image);
    }

  }, [product]);


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

    <main className="mx-auto max-w-full px-8 py-2">


      {/* BACK */}

      <button

        onClick={() => router.back()}

        className="mb-2 flex items-center gap-2 hover:text-orange-500"

      >

        <ArrowLeft size={20} />

        Back

      </button>



      {/* PRODUCT GRID */}

      <div className="grid items-start gap-5 lg:grid-cols-[40%_35%_22%]">


        {/* LEFT GALLERY */}

        <div className="flex h-[360px] bg-white">


          {/* THUMBNAILS */}

          <div className="flex w-[75px] flex-col gap-3">


            {details?.gallery.map((img) => (

              <button

                key={img}

                onClick={() =>
                  setSelectedImage(img)
                }

                className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 bg-white p-1
                ${
                  selectedImage === img
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}

              >

                <Image

                  src={img}

                  alt="thumbnail"

                  width={55}

                  height={55}

                  className="object-contain"

                />

              </button>

            ))}

          </div>


{/* MAIN IMAGE */}

<div className="group flex flex-1 items-center justify-center overflow-hidden">

  <Image

    src={selectedImage || product.image}

    alt={product.name}

    width={420}

    height={420}

    className="max-h-[330px] w-auto object-contain transition-transform duration-500 group-hover:scale-125"

  />

</div>

        </div>
                {/* MIDDLE DETAILS */}

        <div>

          <h1 className="text-3xl font-medium text-gray-900">

            {product.name}

          </h1>


          {/* Rating */}

          <div className="mt-1 flex items-center gap-1">

            {[...Array(product.rating)].map(
              (_, index) => (

                <Star

                  key={index}

                  size={15}

                  className="fill-yellow-400 text-yellow-400"

                />

              )
            )}


            <span className="text-sm text-blue-600">

              ({product.reviews} Reviews)

            </span>

          </div>



          {/* Price */}

          <div className="mt-2">

            <div className="flex items-center gap-3">

              <span className="text-3xl font-medium">

                ₹{product.price.toLocaleString("en-IN")}

              </span>


              <span className="text-gray-500 line-through">

                ₹{product.oldPrice.toLocaleString("en-IN")}

              </span>

            </div>


            <p className="text-red-500">

              {product.discount} Limited Deal

            </p>

          </div>



          {/* About */}

          {details && (

            <div className="mt-3">

              <h2 className="font-bold">

                About this item

              </h2>


              <ul className="list-disc pl-5 text-sm leading-5">

                {details.features.map((item) => (

                  <li key={item}>

                    {item}

                  </li>

                ))}

              </ul>

            </div>

          )}




          {/* Offers */}

          <div className="mt-3">

            <h3 className="mb-2 font-bold">

              Offers

            </h3>


            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl border p-3 text-sm">

                <b>Bank Offer</b>

                <p>10% Discount</p>

              </div>


              <div className="rounded-xl border p-3 text-sm">

                <b>Special Price</b>

                <p>Extra Savings</p>

              </div>


              <div className="rounded-xl border p-3 text-sm">

                <b>No Cost EMI</b>

                <p>Available</p>

              </div>

            </div>

          </div>



          <div className="mt-2 text-sm text-gray-600">

            <p>Item Code: {product.code}</p>

            <p>Brand: {product.brand}</p>

            <p>100% Secure Payment</p>

          </div>


        </div>





        {/* RIGHT BUY BOX */}

        <div className="sticky top-28 rounded-xl border bg-white p-4">


          <p className="text-2xl font-medium">

            ₹{product.price.toLocaleString("en-IN")}

          </p>


          <p className="mt-2 text-sm">

            🚚 FREE Delivery within 2 - 4 days

          </p>


          <p className="font-bold text-green-700">

            In Stock

          </p>



          {/* Quantity */}

          <div className="my-3 flex items-center gap-3">

            <span className="font-semibold text-sm">

              Quantity:

            </span>


            <button

              onClick={() =>
                setQuantity(
                  Math.max(1, quantity - 1)
                )
              }

            >

              -

            </button>


            <b>{quantity}</b>


            <button

              onClick={() =>
                setQuantity(quantity + 1)
              }

            >

              +

            </button>


          </div>




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

            className="mb-2 flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 py-2 font-bold"

          >

            <ShoppingCart />

            Add to Cart

          </button>



          <button

            className="mb-2 w-full rounded-full bg-orange-500 py-2 font-bold text-white"

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

            className="flex w-full items-center justify-center gap-2 rounded-full border py-2"

          >

            <Heart />

            Wishlist

          </button>


        </div>


      </div>



      {/* PRODUCT TABS */}

      <div className="mt-4">

<ProductTabs

  description={details?.description}

  specifications={details?.specifications}

  productId={product.id}

/>

      </div>



         <RelatedProducts />


    </main>

  );

}