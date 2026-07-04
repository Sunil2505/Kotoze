"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};


export type Order = {
  orderId: string;
  date: string;
  items: OrderItem[];
  total: number;
};


type OrderContextType = {
  orders: Order[];
  placeOrder: (order: Order) => void;
};


const OrderContext =
  createContext<OrderContextType | undefined>(
    undefined
  );


export function OrderProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [orders, setOrders] =
    useState<Order[]>([]);



  useEffect(() => {

    const savedOrders =
      localStorage.getItem("kotozeOrders");


    if (savedOrders) {

      setOrders(
        JSON.parse(savedOrders)
      );

    }

  }, []);




  const placeOrder = (order: Order) => {


    setOrders((prev) => {


      const updatedOrders = [
        order,
        ...prev,
      ];


      localStorage.setItem(
        "kotozeOrders",
        JSON.stringify(updatedOrders)
      );


      return updatedOrders;


    });


  };





  return (

    <OrderContext.Provider

      value={{

        orders,

        placeOrder,

      }}

    >

      {children}

    </OrderContext.Provider>

  );

}




export function useOrders() {


  const context =
    useContext(OrderContext);


  if (!context) {

    throw new Error(
      "useOrders must be inside OrderProvider"
    );

  }


  return context;

}