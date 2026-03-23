import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProjectChatbot from "@/components/ProjectChatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <Footer />
      <ProjectChatbot />
    </main>
  );
}
