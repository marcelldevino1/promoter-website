import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import PackageSection from "../components/PackageSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="bg-[#0e0e0e] text-white scroll-smooth">
      <Navbar />

      {/* 🏠 Hero / Home Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* ⚙️ Features Section */}
      <section id="features">
        <FeatureSection />
      </section>

      {/* ❓ FAQ Section */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* 📦 Packages Section */}
      <section id="packages">
        <PackageSection />
      </section>

      {/* ⭐ Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      <Footer />
    </div>
  );
}
