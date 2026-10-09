import { Hero } from "@/components/sections/hero";
import { Bestsellers } from "@/components/sections/bestsellers";
import { ValueBanner } from "@/components/sections/value-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Bestsellers />
      <ValueBanner />
    </>
  );
}
