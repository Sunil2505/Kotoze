export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b">

        <div className="text-3xl font-bold text-orange-500">
          Kartly
        </div>

        <input
          type="text"
          placeholder="Search products..."
          className="w-[450px] border rounded-lg px-4 py-2"
        />

        <div className="flex gap-6">
          <button>Categories</button>
          <button>Become Seller</button>
          <button>Login</button>
        </div>

      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-32">

        <h1 className="text-6xl font-bold text-gray-900">
          India's Trusted Marketplace
        </h1>

        <p className="mt-6 text-xl text-gray-600">
          Buy. Sell. Grow.
        </p>

        <div className="mt-8 flex gap-4">

          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg">
            Shop Now
          </button>

          <button className="border border-orange-500 text-orange-500 px-8 py-3 rounded-lg">
            Become Seller
          </button>

        </div>

      </section>

    </main>
  );
}