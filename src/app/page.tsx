import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Sandboxes from "@/components/landing/Sandboxes";
import LearningPaths from "@/components/landing/LearningPaths";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Sandboxes />
        <LearningPaths />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
