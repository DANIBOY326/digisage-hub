import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import Hero from "./Index/_components/Hero.tsx";
import Pillars from "./Index/_components/Pillars.tsx";
import Programs from "./Index/_components/Programs.tsx";
import About from "./Index/_components/About.tsx";
import Ecosystem from "./Index/_components/Ecosystem.tsx";
import FAQ from "./Index/_components/FAQ.tsx";
import CallToAction from "./Index/_components/CallToAction.tsx";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <Pillars />
      <Programs />
      <Ecosystem />
      <FAQ />
      <CallToAction />
      <Footer />
    </div>
  );
}
