import Hero from '@/components/Hero';
import FAQ from '../components/FAQ';
import FeaturedContent from '@/components/FeaturedContent';
import ScheduleDisplay from '@/components/ScheduleDisplay';
import StatisticsSection from '@/components/StatisticsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1729] pt-16">
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          <Hero />
        </div>
      </div>
      
      {/* <StatisticsSection /> */}
      <FeaturedContent />
      <ScheduleDisplay />
      
      <FAQ />
    </main>
  )
}