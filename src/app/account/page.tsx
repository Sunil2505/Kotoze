"use client";

"use client";

import { useEffect } from "react";
import {
  User,
  Mail,
  PackageCheck,
  LogOut,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AccountPage() {

  const { user, logout } = useAuth();
  const router = useRouter();


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

          My Account

        </h1>




        <div className="rounded-2xl bg-white p-5 shadow-lg">


          <div className="flex items-center gap-4">


            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">


              <User
                size={32}
                className="text-orange-500"
              />


            </div>





            <div>


              <h2 className="text-xl font-bold text-gray-900">

                {user.name}

              </h2>



              <p className="flex items-center gap-2 text-sm text-gray-600">


                <Mail size={16}/>


                {user.email}


              </p>



            </div>


          </div>






          <div className="mt-6 space-y-3">

            <Link

              href="/account/edit"

              className="flex items-center gap-3 rounded-xl border p-3 font-bold text-gray-800 hover:bg-gray-50"

            >

              <Pencil size={20}/>

              Edit Profile

            </Link>

            <Link

              href="/orders"

              className="flex items-center gap-3 rounded-xl border p-3 font-bold text-gray-800 hover:bg-gray-50"

            >


              <PackageCheck size={20}/>


              My Orders


            </Link>





<button

  onClick={() => {

    logout();

    router.push("/login");

  }}

  className="flex w-full items-center gap-3 rounded-xl border p-3 font-bold text-red-500 hover:bg-red-50"

>

  <LogOut size={20} />

  Logout

</button>




          </div>



        </div>



      </div>



    </main>

  );

}