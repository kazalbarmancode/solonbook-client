import CtaSection from "@/components/CtaSection"
import FeaturedServices from "@/components/future-servise/FutureServices"
import HeroBanner from "@/components/HeroBanner"
import SalonServiceCategories from "@/components/SalonServiceCategories"
import WhyChooseSalonBook from "@/components/WhyChooseSalonBook"

export default function Page() {
  return (
    <div>
      <HeroBanner></HeroBanner>
      <SalonServiceCategories></SalonServiceCategories>
      <FeaturedServices></FeaturedServices>
      <WhyChooseSalonBook></WhyChooseSalonBook>
      <CtaSection></CtaSection>
    </div>
  )
}
