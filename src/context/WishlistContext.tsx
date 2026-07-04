"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
}


const WishlistContext =
  createContext<WishlistContextType | undefined>(
    undefined
  );


export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);


  // Load wishlist when app starts
  useEffect(() => {

    const savedWishlist =
      localStorage.getItem("wishlist");

    if (savedWishlist) {
      setWishlist(
        JSON.parse(savedWishlist)
      );
    }

  }, []);


  // Save whenever wishlist changes
  useEffect(() => {

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

  }, [wishlist]);



  // Add / Remove toggle
  const toggleWishlist = (
    item: WishlistItem
  ) => {

    setWishlist((prev) => {

      const exists = prev.find(
        (p) => p.id === item.id
      );


      if (exists) {

        return prev.filter(
          (p) => p.id !== item.id
        );

      }


      return [...prev, item];

    });

  };



  const removeFromWishlist = (
    id: number
  ) => {

    setWishlist((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

  };



  const wishlistCount =
    wishlist.length;



  return (

    <WishlistContext.Provider

      value={{

        wishlist,

        wishlistCount,

        toggleWishlist,

        removeFromWishlist,

      }}

    >

      {children}

    </WishlistContext.Provider>

  );
}



export function useWishlist() {

  const context =
    useContext(WishlistContext);


  if (!context) {

    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );

  }


  return context;

}