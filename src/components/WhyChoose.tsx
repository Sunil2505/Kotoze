import {
  ShieldCheck,
  Truck,
  BadgePercent,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Secure Payments",
    description: "Safe and encrypted payment methods.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick shipping across India.",
  },
  {
    icon: BadgePercent,
    title: "Best Prices",
    description: "Amazing deals and daily offers.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here whenever you need us.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-3 text-center text-4xl font-bold text-gray-900">
          Why Choose Kotoze?
        </h2>

        <p className="mb-12 text-center text-gray-500">
          Everything you need for a safe, smart and enjoyable shopping experience.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-400 hover:shadow-xl"
              >
                <div className="mb-5 flex justify-center">
                  <Icon
                    size={52}
                    className="text-orange-500 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}