import Header from "@/components/Header";
import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/Footer";

export const metadata = { title: "מקרי בוחן | NBH Engineering" };

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16">
        <CaseStudies />
      </div>
      <Footer />
    </main>
  );
}
