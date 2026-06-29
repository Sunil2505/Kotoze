export default function Hero() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-3 text-orange-500 font-semibold">
          Welcome to Kotoze
        </p>

        <h1 className="text-5xl font-bold text-gray-900">
          Everything You Need,
          <span className="text-orange-500"> All in One Place.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Discover quality products from trusted sellers across India.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600">
            Shop Now
        </button>

        <button className="rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">
            Become a Seller
        </button>
        </div>
        
      </div>
    </section>
  );
}