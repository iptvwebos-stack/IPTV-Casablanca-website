import React from "react";
import { Tv, MessageSquareCode, PhoneCall } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const navItems = [
    { id: "hero", label: "Accueil" },
    { id: "pricing", label: "Nos Offres" },
    { id: "channels", label: "Chaînes & VOD" },
    { id: "setup", label: "Tutoriels" },
    { id: "chat", label: "Support Client 24/7" },
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      "Bonjour IPTV Casablanca, je souhaite avoir plus de renseignements sur vos abonnements premium et obtenir un test gratuit de 1 heure s'il vous plaît."
    );
    window.open(`https://wa.me/212600000000?text=${text}`, "_blank");
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="main-navbar"
      className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate("hero")}
          className="flex items-center gap-2.5 text-left group"
          id="btn-nav-logo"
        >
          <img 
            src="https://raw.githubusercontent.com/iptvwebos-stack/repo/refs/heads/main/IMG_20260714_010908.jpg"
            alt="IPTV Casablanca Logo"
            className="h-10 w-10 rounded-xl object-cover shadow-md border border-white/20 transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-sans text-lg font-bold tracking-tight text-white sm:text-xl">
              iptv<span className="text-amber-500">-casablanca</span>
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
              Premium Stream Service
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative px-4 py-2 font-sans text-sm font-medium rounded-lg transition-all ${
                  isActive ? "text-amber-500" : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-amber-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-nav-whatsapp"
            onClick={handleWhatsAppContact}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-sans text-xs font-semibold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-500 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Test Gratuit 1 Heure</span>
            <span className="sm:hidden">Test 1H</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
