import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IdentityStudio from "@/components/IdentityStudio";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <IdentityStudio />
      </main>
      <Footer />
    </>
  );
}
