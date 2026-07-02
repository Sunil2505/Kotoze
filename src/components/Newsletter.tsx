export default function Newsletter() {
  return (
    <section className="bg-orange-500 py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white">
          Stay Updated with Kotoze
        </h2>

        <p className="mt-4 text-lg text-orange-100">
          Subscribe to receive exclusive offers, latest arrivals and exciting
          marketplace updates.
        </p>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 rounded-lg border border-black bg-white px-5 py-3 text-gray-700 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-200"
          />

          <button className="rounded-lg bg-gray-900 px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-black hover:shadow-xl">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}