"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


export type Review = {
  id: number;
  productId: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
};


type ReviewContextType = {
  reviews: Review[];
  addReview: (review: Review) => void;
};


const ReviewContext =
  createContext<ReviewContextType | undefined>(
    undefined
  );


export function ReviewProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [reviews, setReviews] =
    useState<Review[]>([]);



  useEffect(() => {

    const saved =
      localStorage.getItem(
        "kotozeReviews"
      );


    if (saved) {

      setReviews(
        JSON.parse(saved)
      );

    }

  }, []);




  const addReview = (review: Review) => {


    const updated = [
      review,
      ...reviews,
    ];


    setReviews(updated);


    localStorage.setItem(
      "kotozeReviews",
      JSON.stringify(updated)
    );

  };




  return (

    <ReviewContext.Provider

      value={{
        reviews,
        addReview,
      }}

    >

      {children}

    </ReviewContext.Provider>

  );

}




export function useReviews() {


  const context =
    useContext(ReviewContext);


  if (!context) {

    throw new Error(
      "useReviews must be inside ReviewProvider"
    );

  }


  return context;

}