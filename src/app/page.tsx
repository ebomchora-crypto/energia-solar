import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/ui/Cursor";
import HeroScene from "@/components/scenes/HeroScene";
import EnergyScene from "@/components/scenes/EnergyScene";
import HouseScene from "@/components/scenes/HouseScene";
import SavingsScene from "@/components/scenes/SavingsScene";
import GalleryScene from "@/components/scenes/GalleryScene";
import ProcessScene from "@/components/scenes/ProcessScene";
import CtaScene from "@/components/scenes/CtaScene";

export default function Home() {
  return (
    <SmoothScroll>
      <Cursor />
      <Nav />
      <main>
        <HeroScene />
        <EnergyScene />
        <HouseScene />
        <SavingsScene />
        <GalleryScene />
        <ProcessScene />
        <CtaScene />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
