import FeaturedServices from "@/components/future-servise/FutureServices"
import HeroBanner from "@/components/HeroBanner"
import SalonServiceCategories from "@/components/SalonServiceCategories"

export default function Page() {
  return (
    <div>
      <HeroBanner></HeroBanner>
      <SalonServiceCategories></SalonServiceCategories>
      <FeaturedServices></FeaturedServices>
    </div>
  )
}
