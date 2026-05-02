import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import PainPoints from "@/components/PainPoints";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Manifesto from "@/components/Manifesto";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ProjectChatbot from "@/components/ProjectChatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <StatsCounter />
      <PainPoints />
      <Services />
      <Process />
      <Manifesto />
      <CaseStudies />
      <Testimonials />
      <ContactForm />
      <Footer />
      <ProjectChatbot />
    </main>
  );
}
