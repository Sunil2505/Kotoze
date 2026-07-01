export default function Hero() {
  return (
      <section className="mx-auto max-w-7xl px-6 py-12 text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
        Everything You Need,
       <br />
         <span className="text-orange-500">
          All in One Place.
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-3xl text-2xl text-gray-600">
        Buy products from trusted sellers across India.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-6">
        <button className="rounded-xl bg-orange-500 px-8 py-4 text-xl font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-xl">
          Shop Now
        </button>
        <button className="rounded-xl border-2 border-orange-500 bg-white px-8 py-4 text-xl font-bold text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white">
          Become a Seller
        </button>
      </div> 
   </section>
  );
}