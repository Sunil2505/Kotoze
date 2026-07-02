"use client";

import { useState } from "react";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <section className="mt-16">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
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
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description */}
      {activeTab === "description" && (
        <div className="rounded-b-xl bg-gray-900 p-8">
          <h3 className="mb-4 text-2xl font-bold">
            Product Description
          </h3>

          <p className="leading-8 text-gray-300">
            Experience premium sound quality with advanced Active Noise
            Cancellation, crystal-clear audio, Bluetooth 5.3 connectivity,
            and up to 30 hours of battery life. Designed for comfort,
            these wireless headphones are perfect for work, travel,
            gaming, and entertainment.
          </p>
        </div>
      )}

      {/* Specifications */}
      {activeTab === "specifications" && (
        <div className="rounded-b-xl bg-gray-900 p-8">
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
                  className="border-b border-gray-800"
                >
                  <td className="py-4 font-semibold text-gray-400">
                    {key}
                  </td>

                  <td className="py-4 text-right text-white">
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
        <div className="rounded-b-xl bg-gray-900 p-8 space-y-6">
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
              className="rounded-xl border border-gray-800 p-5"
            >
              <h4 className="font-bold text-lg">
                {review.name}
              </h4>

              <p className="mt-1 text-yellow-400">
                {review.rating}
              </p>

              <p className="mt-3 text-gray-300">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}