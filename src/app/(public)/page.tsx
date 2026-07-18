import Hero from "../../components/Hero";
import Categories from "../../components/Categories";
import FeaturedProducts from "../../components/FeaturedProducts";
import FlashSale from "../../components/FlashSale";
import TrendingProducts from "../../components/TrendingProducts";
import Brands from "@/components/Brands";
import WhyChoose from "@/components/WhyChoose";
import Newsletter from "@/components/Newsletter";
export default function Home() {
  return (
<main className="min-h-screen bg-white">
  <Hero />
  <Categories />
  <TrendingProducts />
  <FeaturedProducts />
  <FlashSale />
  <Brands />
  <WhyChoose />
  <Newsletter />
</main>
  );
}