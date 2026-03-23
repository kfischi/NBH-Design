import Header from "@/components/Header";
import Process from "@/components/Process";
import Footer from "@/components/Footer";

export const metadata = { title: "התהליך שלנו | NBH Engineering" };

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16">
        <Process />
      </div>
      <Footer />
    </main>
  );
}
