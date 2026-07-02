import { Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-6 bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-8 lg:flex-row lg:items-center">
          {/* Left */}
          <div className="max-w-lg text-left">
            <h2 className="text-4xl font-bold leading-tight">
              Subscribe to our Newsletter
            </h2>

            <p className="mt-3 text-gray-400 leading-7">
              Stay updated with our latest products, exclusive offers,
              discounts and shopping news delivered directly to your inbox.
            </p>
          </div>

          {/* Right */}
          <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-11 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-7 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:bg-orange-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <h2 className="text-4xl font-extrabold text-orange-500">
              Kotoze
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              India's next-generation marketplace connecting buyers with trusted
              sellers across the country.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-xl font-semibold">Company</h3>

            <ul className="space-y-3 text-gray-400">
              {["About", "Careers", "Contact", "Blog"].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition-all duration-300 hover:translate-x-1 hover:text-orange-500"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-xl font-semibold">Support</h3>

            <ul className="space-y-3 text-gray-400">
              {[
                "Help Center",
                "Returns",
                "Shipping",
                "Privacy Policy",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition-all duration-300 hover:translate-x-1 hover:text-orange-500"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 text-xl font-semibold">Follow Us</h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-gray-800 p-3 transition-all duration-300 hover:scale-110 hover:bg-orange-500"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                className="rounded-full bg-gray-800 p-3 transition-all duration-300 hover:scale-110 hover:bg-orange-500"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="rounded-full bg-gray-800 p-3 transition-all duration-300 hover:scale-110 hover:bg-orange-500"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>

            <p className="mt-6 text-sm leading-6 text-gray-400">
              Follow us on social media for exciting offers, new arrivals and
              product updates.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-4 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} Kotoze. All Rights Reserved.</p>

          <div className="flex gap-6">
            <span className="cursor-pointer transition hover:text-orange-500">
              Terms
            </span>

            <span className="cursor-pointer transition hover:text-orange-500">
              Privacy
            </span>

            <span className="cursor-pointer transition hover:text-orange-500">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}