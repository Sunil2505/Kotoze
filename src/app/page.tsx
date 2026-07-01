import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import FlashSale from "../components/FlashSale";
import TrendingProducts from "../components/TrendingProducts";
import Brands from "@/components/Brands";
import WhyChoose from "@/components/WhyChoose";
import Footer from "../components/Footer";
export default function Home() {
  return (
<main className="min-h-screen bg-white">
  <Header />
  <Hero />
  <Categories />
  <TrendingProducts />
  <FeaturedProducts />
  <FlashSale />
  <Brands />
  <WhyChoose />
  <Footer />
</main>
  );
}