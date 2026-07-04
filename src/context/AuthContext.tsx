"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


type User = {

  name: string;

  email: string;

  phone?: string;

  address?: string;

};



type AuthContextType = {

  user: User | null;

  login: (user: User) => void;

  logout: () => void;

  updateUser: (user: User) => void;

  isLoggedIn: boolean;

};



const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );




export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {



  const [user, setUser] =
    useState<User | null>(null);




  useEffect(() => {


    const savedUser =
      localStorage.getItem("kotozeUser");



    if (savedUser) {

      setUser(JSON.parse(savedUser));

    }


  }, []);





  const login = (user: User) => {


    setUser(user);


    localStorage.setItem(
      "kotozeUser",
      JSON.stringify(user)
    );


  };





  const logout = () => {


    setUser(null);


    localStorage.removeItem(
      "kotozeUser"
    );


  };





  const updateUser = (user: User) => {


    setUser(user);


    localStorage.setItem(
      "kotozeUser",
      JSON.stringify(user)
    );


  };






  return (


    <AuthContext.Provider

      value={{

        user,

        login,

        logout,

        updateUser,

        isLoggedIn: !!user,

      }}

    >


      {children}


    </AuthContext.Provider>


  );


}






export function useAuth() {


  const context =
    useContext(AuthContext);



  if (!context) {


    throw new Error(
      "useAuth must be used inside AuthProvider"
    );


  }



  return context;


}