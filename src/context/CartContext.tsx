"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}


interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}


const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );


export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [cart, setCart] =
    useState<CartItem[]>([]);



  // Load cart

  useEffect(() => {

    const savedCart =
      localStorage.getItem("cart");


    if (savedCart) {

      setCart(
        JSON.parse(savedCart)
      );

    }

  }, []);




  // Save cart

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);





  // Add to cart

  const addToCart = (item: CartItem) => {


    setCart((prev) => {


      const existing =
        prev.find(
          (p) => p.id === item.id
        );



      if (existing) {


        return prev.map((p) =>


          p.id === item.id

            ? {
                ...p,
                quantity:
                  p.quantity +
                  item.quantity,
              }

            : p

        );


      }



      return [
        ...prev,
        item,
      ];


    });


  };






  // Remove

  const removeFromCart = (id: number) => {


    setCart((prev) =>

      prev.filter(
        (item) =>
          item.id !== id
      )

    );


  };







  // Increase

  const increaseQuantity = (id: number) => {


    setCart((prev) =>


      prev.map((item) =>


        item.id === id

          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }

          : item


      )


    );


  };






  // Decrease

  const decreaseQuantity = (id: number) => {


    setCart((prev) =>


      prev
        .map((item) =>


          item.id === id

            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }

            : item


        )


        .filter(

          (item) =>
            item.quantity > 0

        )


    );


  };






  // Clear

  const clearCart = () => {

    setCart([]);

  };






  const cartCount =
    cart.reduce(

      (total, item) =>
        total + item.quantity,

      0

    );





  const cartTotal =
    cart.reduce(

      (total, item) =>

        total +
        item.price *
          item.quantity,

      0

    );






  return (

    <CartContext.Provider

      value={{

        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        cartCount,

        cartTotal,

      }}

    >

      {children}

    </CartContext.Provider>

  );

}






export function useCart() {


  const context =
    useContext(CartContext);



  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );

  }



  return context;

} 