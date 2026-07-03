import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
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
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row">

        {/* Image */}
        <div className="flex h-44 w-44 items-center justify-center rounded-xl bg-gray-100">
          <Image
            src={item.image}
            alt={item.name}
            width={180}
            height={180}
            className="object-contain"
          />
        </div>


        {/* Details */}
        <div className="flex-1">

          <h2 className="text-3xl font-extrabold text-gray-900">
            {item.name}
          </h2>

          <p className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            🟢 In Stock
          </p>


          <div className="mt-5">
            <span className="text-3xl font-bold text-orange-500">
              ₹{item.price.toLocaleString("en-IN")}
            </span>
          </div>


          <div className="mt-6 flex items-center gap-4">

            {/* Quantity */}
            <div className="flex items-center rounded-xl border">

            <button
            onClick={() => decreaseQuantity(item.id)}
            className="p-3 text-gray-900 hover:bg-gray-100"
            >
            <Minus size={18} />
            </button>   

              <span className="px-5 font-bold text-gray-900">
                {item.quantity}
              </span>


                <button
                onClick={() => increaseQuantity(item.id)}
                className="p-3 text-gray-900 hover:bg-gray-100"
                >
                <Plus size={18} />
                </button>
            </div>


            <button className="flex items-center gap-2 text-orange-500">
              <Heart size={18} />
              Save
            </button>


            <button
              onClick={() => removeFromCart(item.id)}
              className="flex items-center gap-2 text-red-500"
            >
              <Trash2 size={18} />
              Remove
            </button>


          </div>

        </div>

      </div>
    </div>
  );
}