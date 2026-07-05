import Image from "next/image";

import {
  Minus,
  Plus,
  Trash2,
  Heart,
} from "lucide-react";

import { CartItem as CartItemType } from "@/context/CartContext";


type Props = {

  item: CartItemType;

  increaseQuantity: (id: number) => void;

  decreaseQuantity: (id: number) => void;

  removeFromCart: (id: number) => void;

};



export default function CartItem({

  item,

  increaseQuantity,

  decreaseQuantity,

  removeFromCart,

}: Props) {


  return (

    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow">


      <div className="flex gap-5">



        {/* Image */}

        <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gray-100">


          <Image

            src={item.image}

            alt={item.name}

            width={110}

            height={110}

            className="object-contain"

          />


        </div>






        {/* Details */}

        <div className="flex-1">



          <h2 className="text-xl font-bold text-gray-900">

            {item.name}

          </h2>




          <p className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

            🟢 In Stock

          </p>





          <div className="mt-3">


            <span className="text-2xl font-bold text-orange-600">

              ₹{item.price.toLocaleString("en-IN")}

            </span>


          </div>






          <div className="mt-4 flex items-center gap-4">



            {/* Quantity */}

            <div className="flex items-center rounded-xl border">



              <button

                onClick={() => decreaseQuantity(item.id)}

                className="p-2 text-gray-900 hover:bg-gray-100"

              >

                <Minus size={16} />

              </button>





              <span className="px-4 font-bold text-gray-900">

                {item.quantity}

              </span>






              <button

                onClick={() => increaseQuantity(item.id)}

                className="p-2 text-gray-900 hover:bg-gray-100"

              >

                <Plus size={16} />

              </button>



            </div>







            <button className="flex items-center gap-1 text-sm text-orange-500">

              <Heart size={16} />

              Save

            </button>







            <button

              onClick={() => removeFromCart(item.id)}

              className="flex items-center gap-1 text-sm text-red-500"

            >

              <Trash2 size={16} />

              Remove

            </button>




          </div>



        </div>


      </div>


    </div>

  );

}