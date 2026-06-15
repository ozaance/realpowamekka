import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Conviction from "@/components/Conviction";
import Services from "@/components/Services";
import Methode from "@/components/Methode";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Conviction />
        <Services />
        <Methode />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
