import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Approach from "@/components/Approach";
import Programmes from "@/components/Programmes";
import Enrol from "@/components/Enrol";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";

/**
 * Page order (each section owns exactly one scroll effect):
 *  Nav → Hero → Statement → Approach → Programmes → Enrol → Footer (revealed from behind <main>)
 * All sections are client components only for their animation hooks; the markup is still
 * fully server-rendered for SEO.
 */
export default function Home() {
  return (
    <>
      <MotionProvider />
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <Statement />
        <Approach />
        <Programmes />
        <Enrol />
      </main>
      <Footer />
    </>
  );
}

