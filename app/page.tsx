import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Features from "@/components/public/Features";
import Campaigns from "@/components/public/Campaigns";
import Trust from "@/components/public/Trust";
import CTA from "@/components/public/CTA";
import Footer from "@/components/public/Footer";
import ScrollReveal from "@/components/public/ScrollReveal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Campaigns />
        <Trust />
        <CTA />
      </main>
      <Footer />
      <ScrollReveal />
    </div>
  );
}
