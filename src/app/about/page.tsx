import Header from "@/components/Header";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export const metadata = { title: "אודות | NBH Engineering" };

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16">
        <About />
        <Testimonials />
      </div>
      <Footer />
    </main>
  );
}
