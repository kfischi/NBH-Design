"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = "972500000000";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const navLinks = [
  { label: "שירותים",   href: "/services"     },
  { label: "תהליך",     href: "/process"      },
  { label: "מקרי בוחן", href: "/case-studies"  },
  { label: "אודות",     href: "/about"         },
  { label: "צור קשר",  href: "/contact"       },
];

export default function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          solid
            ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-900/5"
            : "bg-black/25 backdrop-blur-md border-b border-white/8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className={`font-bold text-base tracking-tight transition-colors duration-300 ${solid ? "text-slate-900" : "text-white"}`}>
                    Proto-Model
                  </span>
                  <span className={`text-[10px] font-medium tracking-wider transition-colors duration-300 ${solid ? "text-slate-500" : "text-white/60"}`}>
                    מחלום למציאות
                  </span>
                </div>
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.span
                      className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                        solid
                          ? active
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          : active
                            ? "text-white bg-white/20"
                            : "text-white/80 hover:text-white hover:bg-white/12"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <motion.a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-sm font-semibold rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <WhatsAppIcon className="w-4 h-4" />
                וואטסאפ
              </motion.a>

              <button
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  solid ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/15"
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white/96 backdrop-blur-xl border-b border-slate-200 shadow-xl md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-right px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    pathname === link.href
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-xl shadow-md shadow-green-500/25 flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-5 h-5" />
                וואטסאפ
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
