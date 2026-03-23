import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export const metadata = { title: "צור קשר | NBH Engineering" };

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16">
        <ContactForm />
      </div>
      <Footer />
    </main>
  );
}
