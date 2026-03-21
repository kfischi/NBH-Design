import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ProjectChatbot from "@/components/ProjectChatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <Services />
      <CaseStudies />
      <Testimonials />
      <About />
      <ContactForm />
      <Footer />
      <ProjectChatbot />
    </main>
  );
}
