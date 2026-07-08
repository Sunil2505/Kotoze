"use client";

import { useState } from "react";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <section className="mt-0.5">

      {/* Tabs */}
      <div className="flex border-b border-gray-200">

        {[
          { id: "description", label: "Description" },
          { id: "specifications", label: "Specifications" },
          { id: "reviews", label: "Reviews (124)" },
        ].map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}

            className={`border-b-2 px-6 py-4 font-semibold transition ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-500 hover:text-orange-500"
            }`}
          >

            {tab.label}

          </button>

        ))}

      </div>



      {/* Description */}

      {activeTab === "description" && (

        <div className="rounded-b-xl bg-white p-8 shadow-md">

          <h3 className="mb-4 text-2xl font-bold text-gray-900">

            Product Description

          </h3>


          <p className="leading-8 text-gray-700">

            Experience premium sound quality with advanced Active Noise
            Cancellation, crystal-clear audio, Bluetooth 5.3 connectivity,
            and up to 30 hours of battery life.

            Designed for comfort, these wireless headphones are perfect
            for work, travel, gaming, and entertainment.

          </p>


        </div>

      )}




      {/* Specifications */}

      {activeTab === "specifications" && (

        <div className="rounded-b-xl bg-white p-8 shadow-md">

          <table className="w-full">

            <tbody>

              {[
                ["Brand", "Sony"],
                ["Model", "WH-1000XM5"],
                ["Bluetooth", "5.3"],
                ["Battery", "30 Hours"],
                ["Charging", "USB-C Fast Charging"],
                ["Warranty", "1 Year"],
                ["Weight", "250 g"],
              ].map(([key, value]) => (

                <tr
                  key={key}
                  className="border-b border-gray-200"
                >

                  <td className="py-4 font-semibold text-gray-600">

                    {key}

                  </td>


                  <td className="py-4 text-right text-gray-900">

                    {value}

                  </td>


                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}






      {/* Reviews */}

      {activeTab === "reviews" && (

        <div className="space-y-6 rounded-b-xl bg-white p-8 shadow-md">


          {[
            {
              name: "Rahul",
              rating: "★★★★★",
              review:
                "Amazing sound quality and battery backup. Worth every rupee.",
            },
            {
              name: "Anjali",
              rating: "★★★★☆",
              review:
                "Very comfortable to wear and excellent noise cancellation.",
            },
          ].map((review, index) => (

            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5"
            >

              <h4 className="text-lg font-bold text-gray-900">

                {review.name}

              </h4>


              <p className="mt-1 text-yellow-400">

                {review.rating}

              </p>


              <p className="mt-3 text-gray-700">

                {review.review}

              </p>


            </div>

          ))}

        </div>

      )}

    </section>
  );
}