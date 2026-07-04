"use client";

export default function Hero() {


  const scrollToProducts = () => {

    const section =
      document.getElementById("products");


    if (section) {

      section.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }

  };



  return (

    <section className="mx-auto max-w-7xl px-6 py-12 text-center">


      <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">


        Everything You Need,


        <br />


        <span className="text-orange-500">

          All in One Place.

        </span>


      </h1>





      <p className="mx-auto mt-6 max-w-3xl text-2xl text-gray-600">


        Buy products from trusted sellers across India.


      </p>






      <div className="mt-8 flex flex-wrap justify-center gap-6">



        <button

          onClick={scrollToProducts}

          className="rounded-xl bg-orange-500 px-8 py-4 text-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-600"

        >


          Shop Now


        </button>







        <button

          className="rounded-xl border-2 border-orange-500 bg-white px-8 py-4 text-xl font-bold text-orange-500 transition-all duration-300 hover:scale-105 hover:bg-orange-500 hover:text-white"

        >


          Become a Seller


        </button>




      </div>



    </section>

  );

}