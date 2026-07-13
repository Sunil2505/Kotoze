"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { useReviews } from "@/context/ReviewContext";
import { useAuth } from "@/context/AuthContext";


export default function ReviewSection({
  productId,
}: {
  productId: number;
}) {


  const { reviews, addReview } = useReviews();

  const { user } = useAuth();


  const [rating, setRating] =
    useState(5);


  const [comment, setComment] =
    useState("");



  const productReviews =
    reviews.filter(
      (review) =>
        review.productId === productId
    );




  return (

    <div className="mt-0 bg-white p-0">


      <h2 className="mb-0 text-lg font-bold text-gray-900">

        Customer Reviews

      </h2>




      {/* Stars */}

      <div className="1">


        {[1, 2, 3, 4, 5].map((star) => (


          <button

            key={star}

            onClick={() =>
              setRating(star)
            }

          >

            <Star

              size={18}

              className={
                star <= rating

                  ? "fill-yellow-400 text-yellow-400"

                  : "text-gray-300"
              }

            />


          </button>


        ))}


      </div>





<div className="flex flex-col items-start">

  <textarea

    value={comment}

    onChange={(e) =>
      setComment(e.target.value)
    }

    placeholder="Write your review..."

    className="h-[90px] w-[31%] rounded-lg border p-2 text-sm text-gray-900"

  />



  <button

    onClick={() => {


      if (!comment) return;


      addReview({

        id: Date.now(),

        productId,

        user:
          user?.name || "Guest",

        rating,

        comment,

        date:
          new Date()
            .toLocaleDateString(),

      });


      setComment("");

    }}


    className="mt-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600"

  >

    Submit Review

  </button>


</div>





      <div className="mt-8 space-y-4">


        {productReviews.map((review) => (


          <div
            key={review.id}
            className="border-t pt-4"
          >


            <p className="font-bold text-gray-900">

              {review.user}

            </p>



            <p className="text-yellow-500">

              {"★".repeat(review.rating)}

            </p>



            <p className="text-gray-700">

              {review.comment}

            </p>


          </div>


        ))}


      </div>


    </div>

  );

}