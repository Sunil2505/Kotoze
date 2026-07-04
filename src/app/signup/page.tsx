"use client";

import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


export default function SignupPage() {


  const router = useRouter();

  const { login } = useAuth();


  const [name, setName] = useState("");

  const [email, setEmail] = useState("");



  return (

    <main className="min-h-screen bg-gray-50 py-12">


      <div className="mx-auto max-w-md px-6">


        <div className="rounded-2xl bg-white p-6 shadow-lg">


          <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-900">

            Create Account

          </h1>




          <div className="space-y-4">



            {/* Name */}

            <div className="relative">

              <User
                size={20}
                className="absolute left-4 top-4 text-gray-500"
              />


              <input

                value={name}

                onChange={(e) =>
                  setName(e.target.value)
                }

                placeholder="Full Name"

                className="w-full rounded-xl border p-4 pl-12 text-gray-900 focus:border-orange-500 focus:outline-none"

              />


            </div>





            {/* Email */}

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






            {/* Password */}

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

                  name: name,

                  email: email,

                });



                router.push("/account");


              }}


              className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600"

            >


              Create Account


            </button>



          </div>


        </div>


      </div>


    </main>

  );

}