"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";


export default function EditProfilePage() {


  const { user, updateUser } = useAuth();

  const router = useRouter();


  const [name, setName] =
    useState(user?.name || "");

  const [email, setEmail] =
    useState(user?.email || "");

  const [phone, setPhone] =
    useState(user?.phone || "");

  const [address, setAddress] =
    useState(user?.address || "");



useEffect(() => {

  if (!user) {

    router.push("/login");

  }

}, [user, router]);


if (!user) {

  return null;

}


  return (

    <main className="min-h-screen bg-gray-50 py-12">


      <div className="mx-auto max-w-md px-6">


        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">

          Edit Profile

        </h1>



        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-lg">



          <div className="relative">

            <User className="absolute left-4 top-4 text-gray-500" size={20}/>

            <input

              value={name}

              onChange={(e) =>
                setName(e.target.value)
              }

              placeholder="Name"

              className="w-full rounded-xl border p-4 pl-12 text-gray-900"

            />

          </div>





          <div className="relative">

            <Mail className="absolute left-4 top-4 text-gray-500" size={20}/>

            <input

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              placeholder="Email"

              className="w-full rounded-xl border p-4 pl-12 text-gray-900"

            />

          </div>






          <div className="relative">

            <Phone className="absolute left-4 top-4 text-gray-500" size={20}/>

            <input

              value={phone}

              onChange={(e) =>
                setPhone(e.target.value)
              }

              placeholder="Phone Number"

              className="w-full rounded-xl border p-4 pl-12 text-gray-900"

            />

          </div>






          <div className="relative">

            <MapPin className="absolute left-4 top-4 text-gray-500" size={20}/>

            <textarea

              value={address}

              onChange={(e) =>
                setAddress(e.target.value)
              }

              placeholder="Address"

              className="w-full rounded-xl border p-4 pl-12 text-gray-900"

            />

          </div>







          <button

            onClick={() => {


              updateUser({

                name,

                email,

                phone,

                address,

              });


              router.push("/account");


            }}


            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600"

          >

            <Save size={20}/>

            Save Changes

          </button>




        </div>


      </div>


    </main>

  );

}