import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import FlashSale from "../components/FlashSale";
import TrendingProducts from "../components/TrendingProducts";
export default function Home() {
  return (
<main className="min-h-screen bg-white">
 <Header />
  <Hero />
  <Categories />
  <TrendingProducts />
  <FeaturedProducts />
  <FlashSale />
  <Footer />
</main>
  );
}