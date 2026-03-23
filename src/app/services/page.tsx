import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export const metadata = { title: "שירותים | NBH Engineering" };

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16">
        <Services />
      </div>
      <Footer />
    </main>
  );
}
