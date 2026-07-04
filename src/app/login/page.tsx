"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";


export default function LoginPage() {


  const router = useRouter();

  const { login } = useAuth();


  const [email, setEmail] = useState("");



  return (

    <main className="min-h-screen bg-gray-50 py-12">


      <div className="mx-auto max-w-md px-6">


        <div className="rounded-2xl bg-white p-6 shadow-lg">


          <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-900">

            Login

          </h1>




          <div className="space-y-4">



            <div className="relative">


              <Mail
                size={20}
                className="absolute left-4 top-4 text-gray-500"
              />


              <input

                value={email}

                onChange={(e) =>
                  setEmail(e.target.value)
                }

                placeholder="Email Address"

                className="w-full rounded-xl border p-4 pl-12 text-gray-900 focus:border-orange-500 focus:outline-none"

              />


            </div>






            <div className="relative">


              <Lock
                size={20}
                className="absolute left-4 top-4 text-gray-500"
              />


              <input

                type="password"

                placeholder="Password"

                className="w-full rounded-xl border p-4 pl-12 text-gray-900 focus:border-orange-500 focus:outline-none"

              />


            </div>







            <button

              onClick={() => {


                login({

                  name: email.split("@")[0],

                  email: email,

                });



                router.push("/account");


              }}


              className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600"

            >


              Login


            </button>



          </div>






          <p className="mt-5 text-center text-gray-600">

            New to Kotoze?


            <Link

              href="/signup"

              className="font-bold text-orange-500"

            >

              {" "}Create Account

            </Link>


          </p>




        </div>


      </div>


    </main>

  );

}