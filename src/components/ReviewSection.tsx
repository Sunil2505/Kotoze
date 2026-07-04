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

    <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">


      <h2 className="mb-5 text-2xl font-bold text-gray-900">

        Customer Reviews

      </h2>




      {/* Stars */}

      <div className="mb-4 flex gap-2">


        {[1, 2, 3, 4, 5].map((star) => (


          <button

            key={star}

            onClick={() =>
              setRating(star)
            }

          >

            <Star

              size={28}

              className={
                star <= rating

                  ? "fill-yellow-400 text-yellow-400"

                  : "text-gray-300"
              }

            />


          </button>


        ))}


      </div>





      <textarea

        value={comment}

        onChange={(e) =>
          setComment(e.target.value)
        }

        placeholder="Write your review..."

        className="w-full rounded-xl border p-4 text-gray-900"

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


        className="mt-4 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"

      >

        Submit Review

      </button>






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