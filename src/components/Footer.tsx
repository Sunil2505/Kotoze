export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-3xl font-bold text-orange-500">
              Kotoze
            </h2>

            <p className="mt-4 text-gray-400">
              India's next-generation marketplace connecting buyers
              and trusted sellers.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Company
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Support
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Follow Us
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500">
          © 2026 Kotoze. All rights reserved.
        </div>
      </div>
    </footer>
  );
}