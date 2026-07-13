"use client";

import { useState } from "react";
import ReviewSection from "@/components/ReviewSection";


type Props = {
  description?: string;
  specifications?: Record<string, string>;
  productId: number;
};

export default function ProductTabs({

  description,

  specifications,

  productId,

}: Props) {


  const [activeTab, setActiveTab] =
    useState("description");


  return (

    <section className="mt-0">


      {/* Tabs */}

            <div className="flex gap-6 border-b border-gray-200 pl-0">


        {[
          { id: "description", label: "Description" },
          { id: "specifications", label: "Specifications" },
          { id: "reviews", label: "Reviews" },
        ].map((tab) => (

<button

  key={tab.id}

  onClick={() =>
    setActiveTab(tab.id)
  }

  className={`px-4 py-3 text-sm font-semibold transition
  border-0 border-b-2 rounded-none bg-transparent
  outline-none focus:outline-none focus:ring-0
  ${
    activeTab === tab.id
      ? "border-b-orange-500 text-orange-500"
      : "border-b-transparent text-gray-500 hover:text-orange-500"
  }`}

>
            {tab.label}

          </button>

        ))}


      </div>





{/* Description */}

{activeTab === "description" && (

  <div className="bg-white pt-5 pl-7">

    <h3 className="mb-3 text-sm font-bold">
      Product Description
    </h3>

    <p className="max-w-md text-justify text-sm leading-6 text-gray-700">

      {description}

    </p>

  </div>

)}





{/* Specifications */}

{activeTab === "specifications" && (

  <div className="bg-white pt-5 pl-7">

    <table className="w-[260px] text-sm">

      <tbody>

        {Object.entries(
          specifications || {}
        ).map(([key, value]) => (

          <tr
            key={key}
            className="border-b border-gray-200"
          >

            <td className="w-[120px] py-2 font-semibold text-gray-600">

              {key}

            </td>


            <td className="py-2 pl-10 text-gray-900">

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

  <div className="bg-white pt-5 pl-7">

    <ReviewSection productId={productId} />

  </div>

)}
    </section>

  );

}