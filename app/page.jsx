import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import LatestNews from "@/components/ui/news/LatestNews"; // Add this import
import LatestFranchises from "@/components/ui/franchise/LatestFranchises"; // Add this import
import Reviews from "@/components/Reviews";
import Cta from "@/components/Cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Work />
      <LatestFranchises /> 
      <LatestNews />
      <Reviews />
      <Cta />
    </main>
  );
}