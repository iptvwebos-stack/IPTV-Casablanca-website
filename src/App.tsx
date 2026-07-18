import React, { useState, useEffect, useRef } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Tv,
  Trophy,
  Globe,
  Film,
  Smartphone,
  Monitor,
  Cpu,
  Check,
  ChevronRight,
  Send,
  MessageSquare,
  Clock,
  Sparkles,
  ShieldCheck,
  Headphones,
  Users,
  CheckCircle2,
  HelpCircle,
  X,
  ArrowRight,
  Play,
  Filter,
  Search,
  PhoneCall,
  Lock,
  Settings,
  Trash2,
  Activity,
  FileText,
  Mail,
  User,
  ExternalLink,
  ShieldAlert,
  Cookie,
  Star,
  MapPin,
  Tv,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, ChannelData, Order, TrialRequest, ContactMessage } from "./types";
import { faqData, faqCategories } from "./faqData";
import { reviewsData } from "./reviewsData";
import AdminMediaManager from "./components/AdminMediaManager";
import chatbotLogo from "./assets/images/iptv_chat_logo_1784379453243.jpg";

export default function App() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Navigation State: 'accueil', 'installation', etc. + 'admin'
  const [currentPage, setCurrentPage] = useState<string>("accueil");
  const [prevPages, setPrevPages] = useState<string[]>([]);
  
  // Channels data state
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loadingChannels, setLoadingChannels] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});

  // Form states
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [deviceKey, setDeviceKey] = useState("");
  const [appChosen, setAppChosen] = useState("BobPlayer");
  const [receiverModel, setReceiverModel] = useState("");
  const [androidDeviceModel, setAndroidDeviceModel] = useState("");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessageText, setContactMessageText] = useState("");

  // Storage / Dashboard states (persisted via localStorage)
  const [orders, setOrders] = useState<Order[]>([]);
  const [trials, setTrials] = useState<TrialRequest[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  
  // Global config settings (Admin editable)
  const [whatsappNumber, setWhatsappNumber] = useState("212698649074");
  const [annualPriceMAD, setAnnualPriceMAD] = useState(250);
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [mediaLinks, setMediaLinks] = useState<Record<string, string>>({
    logo: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/logo.jpg",
    banner: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/banner.png",
    samsung: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/samsung.png",
    lg: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/lg.png",
    android: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/android.png",
    satellite: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/satellite.png",
    xciptvLogo: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/xciptv-logo.png",
    xciptvAccueil: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/xciptv-acceuil.jpg",
    xciptvIdentifiants: "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/xciptv-identifiants.jpg"
  });

  // Authentication for dashboard
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminTab, setAdminTab] = useState<"stats" | "orders" | "trials" | "contacts" | "settings" | "media">("stats");

  // YouTube modal state
  const [videoModalId, setVideoModalId] = useState<string | null>(null);

  // Android installation page sub-tab state
  const [androidTab, setAndroidTab] = useState<"xciptv" | "downloader">("downloader");

  // Cookie banner state
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  // Chatbot State (Youssef)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Salut ! Je suis Youssef de l'équipe IPTV Casablanca. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // FAQ page interactive states
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [faqActiveCategory, setFaqActiveCategory] = useState("all");
  const [expandedFaqIds, setExpandedFaqIds] = useState<Record<number, boolean>>({});

  // Reviews page interactive states
  const [reviewsSearchQuery, setReviewsSearchQuery] = useState("");
  const [reviewsRatingFilter, setReviewsRatingFilter] = useState<number>(0); // 0 means all ratings

  // Fetch channel data and load initial state
  useEffect(() => {
    // Load channels
    setLoadingChannels(true);
    fetch("/data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => {
        setChannels(data);
        setLoadingChannels(false);
      })
      .catch((err) => {
        console.error("Could not fetch /data.json, trying fallback github url", err);
        fetch("https://raw.githubusercontent.com/iptvwebos-stack/repo/refs/heads/main/data.json")
          .then((res) => res.json())
          .then((data) => {
            setChannels(data);
            setLoadingChannels(false);
          })
          .catch((err2) => {
            console.error("Failed to fetch channels list", err2);
            setLoadingChannels(false);
          });
      });

    // Check cookie consent
    if (!localStorage.getItem("cookiesAccepted")) {
      setShowCookieBanner(true);
    }

    // Load persisted dashboard data from server
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        if (data.orders && data.orders.length > 0) setOrders(data.orders);
        else {
          const seedOrders: Order[] = [
            {
              id: "ORD-9482",
              name: "Mohamed El Alami",
              phone: "+212661234567",
              planName: "Abonnement Annuel Premium",
              price: "250 DH",
              device: "Samsung TV",
              macAddress: "AA:BB:CC:DD:EE:11",
              deviceKey: "847293",
              appChosen: "BobPlayer",
              status: "active",
              date: "12/07/2026",
              timestamp: Date.now() - 86400000
            }
          ];
          setOrders(seedOrders);
          fetch("/api/data/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seedOrders) });
        }

        if (data.trials && data.trials.length > 0) setTrials(data.trials);
        else {
          const seedTrials: TrialRequest[] = [
            {
              id: "TRL-1029",
              name: "Amine Kabbaj",
              phone: "+212650112233",
              device: "LG Smart TV",
              status: "pending",
              date: "12/07/2026",
              timestamp: Date.now() - 1200000
            }
          ];
          setTrials(seedTrials);
          fetch("/api/data/trials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seedTrials) });
        }

        if (data.contacts && data.contacts.length > 0) setContactMessages(data.contacts);
        else {
          const seedContacts: ContactMessage[] = [
            {
              id: "MSG-102",
              name: "Karim Rachidi",
              email: "karim.rachidi@gmail.com",
              subject: "Demande de partenariat",
              message: "Bonjour, j'aimerais savoir si vous proposez des tarifs de revendeur IPTV au Maroc.",
              date: "11/07/2026",
              timestamp: Date.now() - 100000000
            }
          ];
          setContactMessages(seedContacts);
          fetch("/api/data/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seedContacts) });
        }

        if (data.settings) {
          if (data.settings.whatsappNumber) setWhatsappNumber(data.settings.whatsappNumber);
          if (data.settings.annualPriceMAD) setAnnualPriceMAD(Number(data.settings.annualPriceMAD));
          if (data.settings.adminPassword) setAdminPassword(data.settings.adminPassword);
        }
        if (data.mediaLinks) {
          setMediaLinks(data.mediaLinks);
        }
      })
      .catch(err => console.error("Failed to load data", err));
  }, []);

  // Chat scroll to end helper
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  // Navigate function matching the original 13 steps indicator and history tracking
  const handlePageChange = (targetPage: string) => {
    setPrevPages((prev) => [...prev, currentPage]);
    setCurrentPage(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (prevPages.length > 0) {
      const previous = prevPages[prevPages.length - 1];
      setPrevPages((prev) => prev.slice(0, -1));
      setCurrentPage(previous);
    } else {
      // Default fallback logic matching original js floating button
      if (["installation", "catalogue-chaines", "a-propos", "faq", "avis-clients", "confidentialite", "securite", "mentions-legales", "contact"].includes(currentPage)) {
        setCurrentPage("accueil");
      } else if (["installation-samsung", "installation-lg", "installation-android", "installation-satellite"].includes(currentPage)) {
        setCurrentPage("installation");
      }
    }
  };

  // Group channels by country country
  const getGroupedChannels = () => {
    const grouped: Record<string, ChannelData[]> = {};
    channels.forEach((c) => {
      const country = c.country?.trim() || "Autres";
      if (!grouped[country]) {
        grouped[country] = [];
      }
      if (!searchQuery || c["Channel Name"]?.toLowerCase().includes(searchQuery.toLowerCase())) {
        grouped[country].push(c);
      }
    });

    // Clean empty groups
    const result: Record<string, ChannelData[]> = {};
    Object.keys(grouped).forEach((country) => {
      if (grouped[country].length > 0) {
        result[country] = grouped[country];
      }
    });

    return result;
  };

  // Submit Order Helper
  const submitNewOrder = async (deviceType: string, customDetails: Record<string, string>) => {
    let token = "dummy_token";
    if (executeRecaptcha) {
      try {
        token = await executeRecaptcha("order");
      } catch (e) {
        console.warn("reCAPTCHA execute failed, using dummy token", e);
      }
    } else {
      console.warn("reCAPTCHA not ready, using dummy token");
    }

    try {
      const res = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      
      if (!data.success) {
        alert(data.error || "Validation reCAPTCHA échouée.");
        return;
      }
    } catch (err) {
      alert("Erreur de validation de sécurité.");
      return;
    }

    const newOrder: Order = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      name: orderName || "Visiteur Anonyme",
      phone: orderPhone || "Non spécifié",
      planName: "Abonnement Annuel Premium",
      price: `${annualPriceMAD} DH`,
      device: deviceType,
      status: "pending",
      date: new Date().toLocaleDateString("fr-FR"),
      timestamp: Date.now(),
      ...customDetails
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    fetch("/api/data/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });

    // Clear form inputs
    setOrderName("");
    setOrderPhone("");
    setMacAddress("");
    setDeviceKey("");
    setReceiverModel("");
    setAndroidDeviceModel("");

    // Create the WhatsApp message
    let waMessage = `Bonjour IPTV Casablanca,\n\nJe viens de commander mon abonnement annuel premium pour ${deviceType} !\n\n`;
    waMessage += `👤 *Client :* ${newOrder.name}\n`;
    waMessage += `📞 *Téléphone :* ${newOrder.phone}\n`;
    if (customDetails.macAddress) waMessage += `🖥️ *Adresse MAC :* ${customDetails.macAddress}\n`;
    if (customDetails.deviceKey) waMessage += `🔑 *Device Key :* ${customDetails.deviceKey}\n`;
    if (customDetails.appChosen) waMessage += `📱 *Application :* ${customDetails.appChosen}\n`;
    if (customDetails.receiverModel) waMessage += `📡 *Modèle Récepteur :* ${customDetails.receiverModel}\n`;
    if (customDetails.androidDeviceModel) waMessage += `⚙️ *Modèle Appareil :* ${customDetails.androidDeviceModel}\n`;
    waMessage += `\nMerci de m'activer mon abonnement rapidement s'il vous plaît !`;

    const encoded = encodeURIComponent(waMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };

  // 1 Heure Trial submit
  const submitTrialRequest = async (name: string, phone: string, device: string) => {
    let token = "dummy_token";
    if (executeRecaptcha) {
      try {
        token = await executeRecaptcha("trial");
      } catch (e) {
        console.warn("reCAPTCHA execute failed, using dummy token", e);
      }
    } else {
      console.warn("reCAPTCHA not ready, using dummy token");
    }

    try {
      const res = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      
      if (!data.success) {
        alert(data.error || "Validation reCAPTCHA échouée.");
        return;
      }
    } catch (err) {
      alert("Erreur de validation de sécurité.");
      return;
    }

    const newTrial: TrialRequest = {
      id: "TRL-" + Math.floor(1000 + Math.random() * 9000),
      name: name,
      phone: phone,
      device: device,
      status: "pending",
      date: new Date().toLocaleDateString("fr-FR"),
      timestamp: Date.now()
    };

    const updated = [newTrial, ...trials];
    setTrials(updated);
    fetch("/api/data/trials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });

    // Build WhatsApp message
    const waMessage = `Bonjour IPTV Casablanca, je souhaite recevoir mon test gratuit de 1 heure s'il vous plaît !\n\n👤 *Nom :* ${name}\n📞 *Téléphone :* ${phone}\n📱 *Appareil :* ${device}`;
    const encoded = encodeURIComponent(waMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };

  // Submit contact message
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactSubject || !contactMessageText) {
      alert("Veuillez remplir tous les champs s'il vous plaît.");
      return;
    }

    let token = "dummy_token";
    if (executeRecaptcha) {
      try {
        token = await executeRecaptcha("contact");
      } catch (e) {
        console.warn("reCAPTCHA execute failed, using dummy token", e);
      }
    } else {
      console.warn("reCAPTCHA not ready, using dummy token");
    }

    try {
      const res = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      
      if (!data.success) {
        alert(data.error || "Validation reCAPTCHA échouée.");
        return;
      }
    } catch (err) {
      alert("Erreur de validation de sécurité.");
      return;
    }

    const newMsg: ContactMessage = {
      id: "MSG-" + Math.floor(100 + Math.random() * 900),
      name: contactName,
      email: contactEmail,
      subject: contactSubject,
      message: contactMessageText,
      date: new Date().toLocaleDateString("fr-FR"),
      timestamp: Date.now()
    };

    const updated = [newMsg, ...contactMessages];
    setContactMessages(updated);
    fetch("/api/data/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });

    alert("Votre message a été enregistré avec succès ! L'équipe d'IPTV Casablanca vous contactera sous peu.");
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMessageText("");
  };

  // Handle support chatbot send
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const history = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.text,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error(err);
      // Fallback assistant logic offline
      setTimeout(() => {
        let text = "";
        const query = userMsg.content.toLowerCase();

        if (query.includes("prix") || query.includes("tarif") || query.includes("combien") || query.includes("offre")) {
          text = "On a une seule offre : 12 mois à 250 DH seulement. C'est l'unique formule !";
        } else if (query.includes("test") || query.includes("essai") || query.includes("gratuit")) {
          text = "On propose un test gratuit d'une heure. Contacte-nous directement sur WhatsApp pour l'activer rapidement !";
        } else if (query.includes("samsung") || query.includes("lg") || query.includes("smart") || query.includes("bobplayer")) {
          text = "Installe l'application BobPlayer sur ta Smart TV, puis envoie-nous l'adresse MAC et le Device Key sur WhatsApp pour l'activation.";
        } else {
          text = "Dis-moi ce qu'il te faut ou contacte-nous directement sur WhatsApp pour faire au plus simple !";
        }

        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: text,
            timestamp: new Date()
          }
        ]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  // Cookie actions
  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookieBanner(false);
  };
  const rejectCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setShowCookieBanner(false);
  };

  // Handle admin password submit
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === adminPassword) {
      setIsAdminLoggedIn(true);
      setAdminLoginError("");
      setShowAdminLoginModal(false);
      setAdminPassInput("");
      setCurrentPage("admin");
    } else {
      setAdminLoginError("Mot de passe incorrect");
    }
  };

  // Step Indicators Render Helper
  const renderStepIndicators = (activeIdx: number) => {
    return (
      <div className="flex justify-center gap-1.5 mt-8 mb-4">
        {Array.from({ length: 13 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx <= activeIdx ? "w-4 bg-amber-500" : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none overflow-x-hidden pb-24 text-white bg-gradient-to-tr from-[#1a2a6c] via-[#b21f1f] to-[#001510]">
      
      {/* Top Banner & Header Brand */}
      <header className="w-full bg-[#0a0f1d] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setCurrentPage("accueil")} className="flex items-center gap-2.5 text-left group">
            <img 
              src={mediaLinks.logo}
              alt="IPTV Casablanca Logo"
              className="h-10 w-10 rounded-xl object-cover shadow-md border border-white/20 transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                iptv<span className="text-amber-500">-casablanca</span>
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-300">
                Service Premium & Support Dédié
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const namePrompt = prompt("Entrez votre nom pour votre essai gratuit :");
                if (!namePrompt) return;
                const phonePrompt = prompt("Entrez votre numéro de téléphone :");
                if (!phonePrompt) return;
                const devicePrompt = prompt("Entrez le modèle de votre appareil (ex: Smart TV, Mi Box, etc.) :");
                if (!devicePrompt) return;
                submitTrialRequest(namePrompt, phonePrompt, devicePrompt);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-3 sm:px-4 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Test Gratuit 1 Heure</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* ----------------- PAGE 1: HERO / ACCUEIL ----------------- */}
            {currentPage === "accueil" && (
              <section className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-2xl">
                  <img
                    src={mediaLinks.banner}
                    alt="IPTV Premium Casablanca Banner"
                    className="w-full h-auto block rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="text-center space-y-3">
                    <span className="bg-amber-500/10 text-amber-400 font-mono text-xs uppercase tracking-widest py-1 px-3.5 rounded-full border border-amber-500/20 inline-block">
                      ★ Offre Promotionnelle Limitée ★
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                      Abonnement IPTV Premium
                    </h2>
                    
                    <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-2xl py-3 px-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                      Seulement {annualPriceMAD} Dhs / An
                    </div>
                  </div>

                  <p className="text-slate-200 text-center text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                    Profitez de l'expérience de divertissement ultime avec notre formule IPTV premium numéro 1 au Maroc. Accédez instantanément à vos chaînes internationales, matchs sportifs en direct, films et séries récents avec une fluidité absolue.
                  </p>

                  {/* Navigation Buttons for Main View */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                    <button
                      onClick={() => handlePageChange("catalogue-chaines")}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-4 px-6 rounded-2xl font-bold text-white shadow-lg shadow-purple-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Film className="h-5 w-5" />
                      <span>Liste des chaînes & VOD</span>
                    </button>
                    
                    <button
                      onClick={() => handlePageChange("a-propos")}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 py-4 px-6 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Globe className="h-5 w-5" />
                      <span>À propos de nous</span>
                    </button>
                  </div>

                  <hr className="border-white/10" />

                  {/* Features Grid */}
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-slate-100 tracking-tight text-center">Inclus dans votre abonnement :</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      {/* Chaînes Directes */}
                      <div className="bg-[#131926] border border-white/10 rounded-2xl p-5 text-center space-y-3 transition-colors hover:bg-[#182030]">
                        <div className="h-12 w-12 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/15 shadow-inner">
                          <Tv className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm md:text-base">Chaînes Directes</h4>
                          <p className="text-xs text-slate-400 leading-normal">+20,000 chaînes live mondiales</p>
                        </div>
                      </div>

                      {/* VOD Premium */}
                      <div className="bg-[#131926] border border-white/10 rounded-2xl p-5 text-center space-y-3 transition-colors hover:bg-[#182030]">
                        <div className="h-12 w-12 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/15 shadow-inner">
                          <Film className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm md:text-base">VOD Premium</h4>
                          <p className="text-xs text-slate-400 leading-normal">Films récents & classiques</p>
                        </div>
                      </div>

                      {/* Séries TV */}
                      <div className="bg-[#131926] border border-white/10 rounded-2xl p-5 text-center space-y-3 transition-colors hover:bg-[#182030]">
                        <div className="h-12 w-12 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/15 shadow-inner">
                          <Smartphone className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm md:text-base">Séries TV</h4>
                          <p className="text-xs text-slate-400 leading-normal">Séries des grandes plateformes</p>
                        </div>
                      </div>

                      {/* Sports Live */}
                      <div className="bg-[#131926] border border-white/10 rounded-2xl p-5 text-center space-y-3 transition-colors hover:bg-[#182030]">
                        <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/15 shadow-inner">
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm md:text-base">Sports Live</h4>
                          <p className="text-xs text-slate-400 leading-normal">Matchs en direct HD/4K</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Section Avis Google Maps */}
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></span>
                          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Avis Clients Google Maps</span>
                        </div>
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          SMART TV + IPTV Casablanca
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            <Star className="h-4 w-4 fill-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400" />
                          </div>
                          <span className="text-sm font-black text-amber-400">4.9 / 5</span>
                          <span className="text-xs text-slate-400">(+180 avis vérifiés)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={() => handlePageChange("avis-clients")}
                          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Star className="h-4 w-4 fill-slate-950" />
                          <span>Lire les avis clients</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Subscribe Action button */}
                  <button
                    onClick={() => handlePageChange("installation")}
                    className="w-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff527c] hover:to-[#ff5c3c] py-4.5 px-6 rounded-2xl font-extrabold text-lg text-white shadow-xl shadow-red-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Commander / S'abonner Maintenant</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                {renderStepIndicators(0)}
              </section>
            )}

            {/* ----------------- PAGE 2: CHOOSE PLATFORM ----------------- */}
            {currentPage === "installation" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center">
                <h2 className="text-2xl md:text-3xl font-black text-amber-400">Choisissez Votre Plateforme</h2>
                <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
                  Sélectionnez l'appareil ou le système sur lequel vous souhaitez configurer et installer votre abonnement IPTV Casablanca :
                </p>

                <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => handlePageChange("installation-samsung")}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group text-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center p-3 shadow-md">
                      <img
                        src={mediaLinks.samsung}
                        alt="Samsung Smart TV"
                        className="object-contain"
                        onError={(e) => { e.currentTarget.src = "/samsung.png"; }}
                      />
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                      Samsung Smart TV
                    </h3>
                  </button>

                  <button
                    onClick={() => handlePageChange("installation-lg")}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group text-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center p-3 shadow-md">
                      <img
                        src={mediaLinks.lg}
                        alt="LG Smart TV"
                        className="object-contain"
                        onError={(e) => { e.currentTarget.src = "/lg.png"; }}
                      />
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                      LG Smart TV
                    </h3>
                  </button>

                  <button
                    onClick={() => handlePageChange("installation-android")}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group text-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center p-3 shadow-md">
                      <img
                        src={mediaLinks.android}
                        alt="Android TV Box"
                        className="object-contain"
                        onError={(e) => { e.currentTarget.src = "/android(1).png"; }}
                      />
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                      Android TV / BOXTV
                    </h3>
                  </button>

                  <button
                    onClick={() => handlePageChange("installation-satellite")}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group text-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center p-3 shadow-md">
                      <img
                        src={mediaLinks.satellite}
                        alt="Satellite Receiver"
                        className="object-contain"
                        onError={(e) => { e.currentTarget.src = "/satellite.png"; }}
                      />
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                      Récepteur Satellite
                    </h3>
                  </button>
                </div>

                {renderStepIndicators(1)}
              </section>
            )}

            {/* ----------------- PAGE 3: SAMSUNG TV ----------------- */}
            {currentPage === "installation-samsung" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Installation sur Samsung TV</h2>
                  <p className="text-slate-300 text-sm">Suivez le guide d'installation étape par étape pour BobPlayer</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-amber-400 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                    Instructions Importantes :
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    1. Lancez le **Samsung App Store** sur votre téléviseur.<br />
                    2. Recherchez et installez l'application **BOBPLAYER**.<br />
                    3. Ouvrez BobPlayer. Vous y verrez affichées votre adresse **MAC** (Device MAC) et votre clé d'appareil **Device Key**.<br />
                    4. Remplissez le formulaire ci-dessous avec vos codes pour l'activation immédiate de votre abonnement IPTV Casablanca !
                  </p>
                </div>

                {/* Video Demo Embed Placeholder */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg group">
                  <img
                    src="https://img.youtube.com/vi/6H_DPscclUc/maxresdefault.jpg"
                    alt="YouTube Video Demo thumbnail"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <button
                    onClick={() => setVideoModalId("6H_DPscclUc")}
                    className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <Play className="h-7 w-7 fill-white translate-x-0.5" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/70 py-1 px-3.5 rounded-lg text-xs font-mono font-bold">
                    Demo BobPlayer Installation
                  </div>
                </div>

                {/* Form to submit details */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!orderName || !orderPhone || !macAddress || !deviceKey) {
                      alert("Veuillez remplir toutes les informations requises.");
                      return;
                    }
                    submitNewOrder("Samsung TV", {
                      macAddress,
                      deviceKey,
                      appChosen: "BobPlayer"
                    });
                  }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4"
                >
                  <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300">Valider mon abonnement annuel :</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Votre nom complet *</label>
                      <input
                        type="text"
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        placeholder="Ex: Ahmed Alami"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Numéro de Téléphone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="Ex: +212600000000"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Adresse MAC de votre TV *</label>
                      <input
                        type="text"
                        value={macAddress}
                        onChange={(e) => setMacAddress(e.target.value)}
                        placeholder="Ex: AB:CD:EF:12:34:56"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Device Key de l'application *</label>
                      <input
                        type="text"
                        value={deviceKey}
                        onChange={(e) => setDeviceKey(e.target.value)}
                        placeholder="Ex: 849302"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="h-5 w-5" />
                    <span>Envoyer les détails sur WhatsApp</span>
                  </button>
                </form>

                {renderStepIndicators(2)}
              </section>
            )}

            {/* ----------------- PAGE 4: LG TV ----------------- */}
            {currentPage === "installation-lg" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Installation sur LG TV</h2>
                  <p className="text-slate-300 text-sm">Guide d'installation de BobPlayer sur LG webOS Smart TV</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-amber-400 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                    Instructions Importantes :
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    1. Ouvrez le **LG Content Store** (boutique d'applications) sur votre TV LG.<br />
                    2. Recherchez et installez l'application **BOBPLAYER**.<br />
                    3. Lancez BobPlayer. Notez l'adresse **MAC** et le **Device Key** affichés à l'écran.<br />
                    4. Envoyez-nous ces codes via le formulaire ci-dessous pour activer votre abonnement en moins de 10 minutes !
                  </p>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg group">
                  <img
                    src="https://img.youtube.com/vi/Q2eh5ircd-Y/maxresdefault.jpg"
                    alt="YouTube Video Demo LG"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <button
                    onClick={() => setVideoModalId("Q2eh5ircd-Y")}
                    className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <Play className="h-7 w-7 fill-white translate-x-0.5" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/70 py-1 px-3.5 rounded-lg text-xs font-mono font-bold">
                    Demo BobPlayer LG TV Installation
                  </div>
                </div>

                {/* Form to submit details */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!orderName || !orderPhone || !macAddress || !deviceKey) {
                      alert("Veuillez remplir toutes les informations requises.");
                      return;
                    }
                    submitNewOrder("LG TV", {
                      macAddress,
                      deviceKey,
                      appChosen: "BobPlayer"
                    });
                  }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4"
                >
                  <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300">Valider mon abonnement annuel LG :</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Votre nom complet *</label>
                      <input
                        type="text"
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        placeholder="Ex: Ahmed Alami"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Numéro de Téléphone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="Ex: +212600000000"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Adresse MAC de votre TV *</label>
                      <input
                        type="text"
                        value={macAddress}
                        onChange={(e) => setMacAddress(e.target.value)}
                        placeholder="Ex: AB:CD:EF:12:34:56"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Device Key de l'application *</label>
                      <input
                        type="text"
                        value={deviceKey}
                        onChange={(e) => setDeviceKey(e.target.value)}
                        placeholder="Ex: 849302"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="h-5 w-5" />
                    <span>Envoyer les détails sur WhatsApp</span>
                  </button>
                </form>

                {renderStepIndicators(3)}
              </section>
            )}

            {/* ----------------- PAGE 5: ANDROID TV/BOX ----------------- */}
            {currentPage === "installation-android" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Installation sur Android TV & Box TV</h2>
                  <p className="text-slate-300 text-sm">Découvrez nos méthodes d'installation simples et rapides pour tous vos appareils Android</p>
                </div>

                {/* Sub-Tabs Selector */}
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => setAndroidTab("downloader")}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      androidTab === "downloader"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Méthode 1 : King IPTV Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setAndroidTab("xciptv")}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      androidTab === "xciptv"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Méthode 2 : XCIPTV (Direct)
                  </button>
                </div>

                {/* Tab content 1: King IPTV Player (via Downloader) */}
                {androidTab === "downloader" && (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                      <h3 className="font-bold text-amber-400 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-amber-400" />
                        Méthode King IPTV Player
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        Suivez ces étapes simples pour installer notre application dédiée **King IPTV Player** sur votre téléviseur ou Box Android :
                      </p>
                      <div className="text-xs text-slate-300 space-y-2.5 pl-4 border-l-2 border-amber-500/50">
                        <p>1. **Installer Downloader** : Rendez-vous sur le Google Play Store et installez l'application gratuite **Downloader**.</p>
                        <p>2. **Entrer le Code de téléchargement** : Lancez l'application *Downloader* et entrez le Code **7568702** pour télécharger automatiquement l'application.</p>
                        <p>3. **Installation de l'application** : Une fois le téléchargement terminé, procédez à l'installation de l'application King IPTV Player.</p>
                        <p>4. **Ouvrir l'application** : Lancez l'application King IPTV Player.</p>
                        <p>5. **Saisir l'utilisateur et le Mot de Passe** : Saisissez vos identifiants reçus de notre part pour activer et profiter de vos flux.</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.esaba.downloader"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 font-bold py-3.5 px-8 rounded-2xl text-xs text-white shadow-lg transition-all hover:scale-105"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>Télécharger Downloader sur Play Store</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg group max-w-lg mx-auto">
                      <img
                        src="https://img.youtube.com/vi/A34DfNDxAio/maxresdefault.jpg"
                        alt="YouTube Video Demo King IPTV Player Setup"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <button
                        onClick={() => setVideoModalId("A34DfNDxAio")}
                        className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                      >
                        <Play className="h-7 w-7 fill-white translate-x-0.5" />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-black/70 py-1 px-3.5 rounded-lg text-xs font-mono font-bold">
                        Tutoriel Vidéo d'installation King IPTV Player
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 2: XCIPTV */}
                {androidTab === "xciptv" && (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={mediaLinks.xciptvLogo}
                          alt="XCIPTV Player Logo"
                          className="h-12 w-12 rounded-xl border border-white/20 bg-slate-900 object-contain p-1 shadow-md"
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = "/android(1).png"; }}
                        />
                        <div>
                          <h3 className="font-bold text-amber-400 text-lg">
                            XCIPTV Player — Installation Simple & Directe
                          </h3>
                          <p className="text-xs text-slate-300">L'application officielle disponible directement sur le Play Store</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-200 leading-relaxed">
                        C'est l'application officielle et la solution la plus simple ! Elle est disponible directement sur le magasin d'applications de votre téléviseur sans manipulation complexe :
                      </p>
                      
                      <div className="text-xs text-slate-300 space-y-2.5 pl-4 border-l-2 border-amber-500/50">
                        <p>1. Lancez le **Google Play Store** sur votre téléviseur ou Box (Mi Box, Shield TV, TCL, Chromecast etc).</p>
                        <p>2. Recherchez et installez l'application **XCIPTV Player**.</p>
                        <p>3. Ouvrez l'application pour accéder à l'écran de connexion.</p>
                        <p>4. Remplissez le formulaire ci-dessous et nous vous enverrons immédiatement vos accès API complets !</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.ottrun.xciptv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold py-3.5 px-8 rounded-2xl text-xs text-white shadow-lg transition-all hover:scale-105"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>Télécharger XCIPTV sur Google Play Store</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/60 group">
                        <img
                          src={mediaLinks.xciptvAccueil}
                          alt="XCIPTV Player Interface Mockup"
                          className="w-full h-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = "/xciptv-page-accueil.jpg"; }}
                        />
                        <div className="absolute bottom-3 left-3 bg-black/80 py-1 px-3.5 rounded-lg text-[10px] font-mono text-slate-300">
                          Écran principal de l'interface XCIPTV
                        </div>
                      </div>

                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/60 group">
                        <img
                          src={mediaLinks.xciptvIdentifiants}
                          alt="XCIPTV Credentials Input Screen"
                          className="w-full h-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = "/xciptv-identifiants.jpg"; }}
                        />
                        <div className="absolute bottom-3 left-3 bg-black/80 py-1 px-3.5 rounded-lg text-[10px] font-mono text-slate-300">
                          Écran de saisie des identifiants (Xtream API)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form to submit details */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!orderName || !orderPhone || !androidDeviceModel) {
                      alert("Veuillez remplir toutes les informations requises.");
                      return;
                    }
                    submitNewOrder("Android TV / BOXTV", {
                      androidDeviceModel,
                      appChosen: androidTab === "downloader" ? "King IPTV Player" : "XCIPTV Player"
                    });
                  }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4"
                >
                  <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300">Valider mon abonnement annuel Android ({androidTab === "downloader" ? "King IPTV Player" : "XCIPTV"}) :</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Votre nom complet *</label>
                      <input
                        type="text"
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        placeholder="Ex: Ahmed Alami"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Numéro de Téléphone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="Ex: +212600000000"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Modèle de votre appareil Android *</label>
                      <input
                        type="text"
                        value={androidDeviceModel}
                        onChange={(e) => setAndroidDeviceModel(e.target.value)}
                        placeholder="Ex: Xiaomi Mi Box S, Nvidia Shield, Amazon Fire Stick, etc."
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="h-5 w-5" />
                    <span>Envoyer les détails sur WhatsApp</span>
                  </button>
                </form>

                {renderStepIndicators(4)}
              </section>
            )}

            {/* ----------------- PAGE 6: SATELLITE RECEIVER ----------------- */}
            {currentPage === "installation-satellite" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Récepteur Satellite</h2>
                  <p className="text-slate-300 text-sm">Activez l'IPTV directement sur votre récepteur satellite compatible</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-amber-400 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                    Choix de l'application :
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Nous prenons en charge la majorité des récepteurs satellite modernes (Echolink, Vision, Pinacle, Samsat, Goldvision etc).<br />
                    Nous supportons deux formats très stables :<br />
                    • **King IPTV** (Idéal pour l'ergonomie globale)<br />
                    • **Xtreamiptv** (Idéal pour la simplicité de configuration)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => setAppChosen("King IPTV")}
                    className={`p-5 rounded-2xl border text-center transition-all ${
                      appChosen === "King IPTV"
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <h4 className="font-extrabold text-lg text-amber-400">King IPTV</h4>
                    <p className="text-xs text-slate-400 mt-1">Interface intuitive et fluide</p>
                  </button>

                  <button
                    onClick={() => setAppChosen("Xtreamiptv")}
                    className={`p-5 rounded-2xl border text-center transition-all ${
                      appChosen === "Xtreamiptv"
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <h4 className="font-extrabold text-lg text-amber-400">Xtreamiptv</h4>
                    <p className="text-xs text-slate-400 mt-1">Stable et compatible tous décodeurs</p>
                  </button>
                </div>

                {/* Form to submit details */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!orderName || !orderPhone || !receiverModel) {
                      alert("Veuillez remplir toutes les informations requises.");
                      return;
                    }
                    submitNewOrder("Récepteur Satellite", {
                      receiverModel,
                      appChosen
                    });
                  }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4"
                >
                  <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300">Valider mon abonnement annuel Satellite :</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Votre nom complet *</label>
                      <input
                        type="text"
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        placeholder="Ex: Ahmed Alami"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Numéro de Téléphone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="Ex: +212600000000"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Marque & Modèle de votre Récepteur *</label>
                      <input
                        type="text"
                        value={receiverModel}
                        onChange={(e) => setReceiverModel(e.target.value)}
                        placeholder="Ex: Echolink Tornado V4, Vision Clever 3, etc."
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="h-5 w-5" />
                    <span>Envoyer les détails sur WhatsApp</span>
                  </button>
                </form>

                {renderStepIndicators(5)}
              </section>
            )}

            {/* ----------------- PAGE 7: CHANNELS & VOD CATALOG ----------------- */}
            {currentPage === "catalogue-chaines" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Liste des chaînes & VOD & Séries</h2>
                  <p className="text-slate-300 text-sm">Consultez et recherchez parmi notre catalogue complet de flux TV premium</p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une chaîne ou un pays..."
                    className="w-full bg-black/50 border border-white/10 rounded-full pl-11 pr-5 py-3 text-sm focus:outline-none focus:border-amber-500 text-white transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-3.5 text-slate-400 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Channels lists categorized */}
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingChannels ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
                      <p className="text-sm">Chargement du catalogue des chaînes...</p>
                    </div>
                  ) : Object.keys(getGroupedChannels()).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-medium">
                      Aucune chaîne ne correspond à votre recherche.
                    </div>
                  ) : (
                    Object.entries(getGroupedChannels()).map(([country, items]) => {
                      const isExpanded = expandedCountries[country] ?? false;
                      return (
                        <div key={country} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all">
                          <button
                            onClick={() =>
                              setExpandedCountries((prev) => ({
                                ...prev,
                                [country]: !isExpanded
                              }))
                            }
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              <h4 className="font-extrabold text-slate-200">
                                {country}
                              </h4>
                              <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                                {items.length} chaînes
                              </span>
                            </div>
                            <ChevronRight
                              className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-90 text-amber-500" : ""}`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-5 pt-1 border-t border-white/5 bg-black/30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-300">
                              {items.map((channel, i) => (
                                <div
                                  key={i}
                                  className="py-1.5 px-3 bg-white/5 rounded-lg border border-white/5 hover:border-amber-500/20 truncate transition-all text-xs flex items-center gap-2"
                                >
                                  <Tv className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                                  <span className="truncate">{channel["Channel Name"]}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {renderStepIndicators(6)}
              </section>
            )}

            {/* ----------------- PAGE 8: À PROPOS DE NOUS ----------------- */}
            {currentPage === "a-propos" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">À propos de nous</h2>
                  <p className="text-slate-300 text-sm">Découvrez l'équipe et la technologie derrière IPTV Casablanca</p>
                </div>

                <div className="space-y-4 text-slate-200 text-sm md:text-base leading-relaxed">
                  <p>
                    Bienvenue sur **IPTV Casablanca** ! Notre mission primordiale est de rendre le meilleur du divertissement télévisuel mondial accessible à tous au Maroc et partout ailleurs, avec un niveau de qualité irréprochable.
                  </p>
                  <p>
                    Nous fournissons un service de flux IPTV de calibre VIP qui vous permet de savourer vos chaînes préférées en direct, vos films, vos séries et vos grands championnats sportifs avec une fluidité exceptionnelle et sans aucune coupure grâce à notre infrastructure réseau haut de gamme.
                  </p>
                  <p>
                    Notre équipe passionnée par la technologie et l'innovation s'investit au quotidien pour vous garantir la meilleure expérience possible, une configuration simplifiée sur tous vos écrans et un support réactif disponible 24 heures sur 24.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center space-y-2">
                    <Sparkles className="h-6 w-6 mx-auto text-amber-400" />
                    <h4 className="font-bold text-xs">Innovation</h4>
                    <p className="text-[10px] text-slate-400">Dernières technologies de serveurs anti-freezing</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center space-y-2">
                    <Headphones className="h-6 w-6 mx-auto text-amber-400" />
                    <h4 className="font-bold text-xs">Support 24/7</h4>
                    <p className="text-[10px] text-slate-400">Équipe technique dévouée sur WhatsApp</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center space-y-2">
                    <ShieldCheck className="h-6 w-6 mx-auto text-amber-400" />
                    <h4 className="font-bold text-xs">Sécurité</h4>
                    <p className="text-[10px] text-slate-400">Transactions sécurisées et protection des données</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center space-y-2">
                    <Globe className="h-6 w-6 mx-auto text-amber-400" />
                    <h4 className="font-bold text-xs">Accessibilité</h4>
                    <p className="text-[10px] text-slate-400">Disponible et rapide partout dans le monde</p>
                  </div>
                </div>

                {/* Centre d'optimisation IA pour les moteurs de recherche génératifs (AIO / GEO) */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-6 w-6 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-amber-400 text-sm md:text-base">Console d'Optimisation IA (AIO / GEO)</h3>
                      <p className="text-[11px] text-slate-300">Données structurées et de haute précision pour assistants IA (ChatGPT, Claude, Gemini, Perplexity)</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Afin d'assurer que les modèles de langage et les comparateurs d'intelligence artificielle vous fournissent toujours des données fiables et actualisées, ce site internet intègre les spécifications <strong>AIO (AI Optimization)</strong> de pointe. Nous fournissons aux robots d'exploration des fichiers de métadonnées sémantiques (<code>ai.txt</code>) et des schémas sémantiques normalisés (JSON-LD).
                  </p>
                  
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2.5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">Nom vérifié :</span> <strong className="text-white">IPTV Casablanca</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Services :</span> <strong className="text-white">Abonnements IPTV Premium 4K/FHD</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Fichier de spécification IA :</span> <strong className="text-emerald-400">/ai.txt disponible</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Compatibilité crawlers :</span> <strong className="text-emerald-400">Full Access (GPTBot, ClaudeBot, etc.)</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Briques sémantiques Schema.org :</span> <strong className="text-amber-400">LocalBusiness, Product, FAQPage</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Canal de support indexé :</span> <strong className="text-amber-400">WhatsApp Support Technique 24/7</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-[11px] font-mono py-1.5 px-3 rounded-lg border border-white/10 transition-colors">
                      <FileText className="h-3 w-3" />
                      <span>Voir robots.txt</span>
                    </a>
                    <a href="/ai.txt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-[11px] font-mono py-1.5 px-3 rounded-lg border border-white/10 transition-colors">
                      <Cpu className="h-3 w-3" />
                      <span>Voir ai.txt</span>
                    </a>
                  </div>
                </div>

                {renderStepIndicators(7)}
              </section>
            )}

            {/* ----------------- PAGE 9: FAQ ----------------- */}
            {currentPage === "faq" && (() => {
              const filteredFaqs = faqData.filter(item => {
                const matchesCategory = faqActiveCategory === "all" || item.category === faqActiveCategory;
                const query = faqSearchQuery.toLowerCase().trim();
                const matchesSearch = !query || 
                  item.question.toLowerCase().includes(query) || 
                  item.answer.toLowerCase().includes(query);
                return matchesCategory && matchesSearch;
              });

              return (
                <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-amber-400">FAQ - Questions Fréquentes</h2>
                    <p className="text-slate-300 text-sm">Obtenez rapidement des réponses à vos questions d'installation ou techniques parmi nos {faqData.length} guides</p>
                  </div>

                  {/* Search bar */}
                  <div className="relative max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all"
                      placeholder="Rechercher une question..."
                      value={faqSearchQuery}
                      onChange={(e) => setFaqSearchQuery(e.target.value)}
                    />
                    {faqSearchQuery && (
                      <button
                        onClick={() => setFaqSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 justify-center pb-2">
                    {faqCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFaqActiveCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          faqActiveCategory === cat.id
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Questions list */}
                  <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((item, index) => {
                        const isExpanded = !!expandedFaqIds[item.id];
                        return (
                          <div
                            key={item.id}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-200"
                          >
                            <button
                              onClick={() => {
                                setExpandedFaqIds((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }));
                              }}
                              className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-white/5 transition-colors"
                            >
                              <span className="font-bold text-slate-100 text-sm md:text-base leading-snug">
                                {item.id}. {item.question}
                              </span>
                              <ChevronRight
                                className={`h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0 transition-transform duration-300 ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                            
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="px-4 pb-4 pt-1 border-t border-white/5">
                                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                      {item.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        Aucune question ne correspond à votre recherche.
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all hover:scale-105"
                    >
                      <PhoneCall className="h-5 w-5" />
                      <span>Contacter notre Support technique</span>
                    </a>
                  </div>

                  {renderStepIndicators(8)}
                </section>
              );
            })()}

            {/* ----------------- PAGE REVIEWS: AVIS GOOGLE MAPS ----------------- */}
            {currentPage === "avis-clients" && (() => {
              const filteredReviews = reviewsData.filter(item => {
                const query = reviewsSearchQuery.toLowerCase().trim();
                const matchesSearch = !query || 
                  item.author.toLowerCase().includes(query) || 
                  item.text.toLowerCase().includes(query) || 
                  item.location.toLowerCase().includes(query);
                
                if (!matchesSearch) return false;

                if (reviewsRatingFilter === 5) {
                  return item.rating === 5;
                } else if (reviewsRatingFilter === 10) {
                  return !!item.isLocalGuide;
                } else if (reviewsRatingFilter === 20) {
                  return !!item.replied;
                }
                return true;
              });

              return (
                <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                  {/* Top Back Nav & Title */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                      <span>Retour</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Avis Établissement vérifié</span>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-amber-400">Avis Clients Google Maps</h2>
                    <p className="text-slate-300 text-sm">Découvrez les retours authentiques de nos clients à Casablanca et partout au Maroc</p>
                  </div>

                  {/* Google Rating Card Overview */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4 text-center space-y-2 md:border-r md:border-white/10 md:pr-6">
                      <div className="text-5xl font-black text-white">4.9</div>
                      <div className="flex justify-center text-amber-400">
                        <Star className="h-5 w-5 fill-amber-400" />
                        <Star className="h-5 w-5 fill-amber-400" />
                        <Star className="h-5 w-5 fill-amber-400" />
                        <Star className="h-5 w-5 fill-amber-400" />
                        <Star className="h-5 w-5 fill-amber-400" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Basé sur 180+ avis Google Maps</p>
                      <div className="pt-2">
                        <a
                          href="https://g.page/r/CRXjuwC4utVfEBE/review"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#4285F4] hover:bg-[#357ae8] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all hover:scale-105"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          <span>Donner votre avis</span>
                        </a>
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-2">
                      <div className="text-xs font-semibold text-slate-300">Répartition des évaluations :</div>
                      <div className="space-y-1.5">
                        {/* 5 stars */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="w-14 text-slate-400 font-mono text-left">5 étoiles</span>
                          <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full w-[94%]" />
                          </div>
                          <span className="w-8 text-right text-slate-400 font-mono">94%</span>
                        </div>
                        {/* 4 stars */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="w-14 text-slate-400 font-mono text-left">4 étoiles</span>
                          <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full w-[4%]" />
                          </div>
                          <span className="w-8 text-right text-slate-400 font-mono">4%</span>
                        </div>
                        {/* 3 stars */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="w-14 text-slate-400 font-mono text-left">3 étoiles</span>
                          <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full w-[1%]" />
                          </div>
                          <span className="w-8 text-right text-slate-400 font-mono">1%</span>
                        </div>
                        {/* 2 stars */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="w-14 text-slate-400 font-mono text-left">2 étoiles</span>
                          <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full w-[0%]" />
                          </div>
                          <span className="w-8 text-right text-slate-400 font-mono">0%</span>
                        </div>
                        {/* 1 star */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="w-14 text-slate-400 font-mono text-left">1 étoile</span>
                          <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full w-[1%]" />
                          </div>
                          <span className="w-8 text-right text-slate-400 font-mono">1%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-3">
                    <div className="relative max-w-md mx-auto">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all"
                        placeholder="Rechercher par nom ou contenu..."
                        value={reviewsSearchQuery}
                        onChange={(e) => setReviewsSearchQuery(e.target.value)}
                      />
                      {reviewsSearchQuery && (
                        <button
                          onClick={() => setReviewsSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => setReviewsRatingFilter(0)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          reviewsRatingFilter === 0
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        Tous les avis ({reviewsData.length})
                      </button>
                      <button
                        onClick={() => setReviewsRatingFilter(5)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                          reviewsRatingFilter === 5
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <Star className="h-3 w-3 fill-current" />
                        <span>5 Étoiles</span>
                      </button>
                      <button
                        onClick={() => setReviewsRatingFilter(10)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                          reviewsRatingFilter === 10
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <MapPin className="h-3 w-3 text-rose-500 fill-current" />
                        <span>Local Guides</span>
                      </button>
                      <button
                        onClick={() => setReviewsRatingFilter(20)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                          reviewsRatingFilter === 20
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>Avec réponse</span>
                      </button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 space-y-3.5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border ${item.avatarColor}`}>
                                {item.initials}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-bold text-sm text-slate-100">{item.author}</h4>
                                  {item.isLocalGuide && (
                                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/10">
                                      <Star className="h-2.5 w-2.5 fill-amber-400" />
                                      <span>Local Guide</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                                  <span>{item.location}</span>
                                  <span>•</span>
                                  <span>{item.date}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex text-amber-400 flex-shrink-0">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans italic">
                            "{item.text}"
                          </p>

                          {item.replied && (
                            <div className="bg-white/5 border-l-2 border-amber-500 rounded-r-xl p-3.5 space-y-1 ml-2">
                              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                                <span>Réponse du propriétaire</span>
                                <span className="text-[10px] text-slate-500 font-normal">• {item.replied.date}</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed italic">
                                "{item.replied.text}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-400 text-sm">
                        Aucun avis ne correspond à vos critères de recherche.
                      </div>
                    )}
                  </div>

                  {/* Call to action */}
                  <div className="text-center pt-2">
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all hover:scale-105"
                    >
                      <PhoneCall className="h-5 w-5" />
                      <span>Obtenir un Test Gratuit sur WhatsApp</span>
                    </a>
                  </div>
                </section>
              );
            })()}

            {/* ----------------- PAGE 10: CONFIDENTIALITÉ ----------------- */}
            {currentPage === "confidentialite" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Politique de Confidentialité</h2>
                  <p className="text-slate-300 text-sm">Votre vie privée et vos codes d'activation sont en sécurité</p>
                </div>

                <div className="space-y-4 text-slate-200 text-sm md:text-base leading-relaxed">
                  <p>
                    Chez **IPTV Casablanca**, nous traitons vos données personnelles avec le plus grand sérieux et la plus grande rigueur.
                  </p>
                  <p>
                    Les informations que vous nous transmettez (comme votre nom complet, adresse MAC de téléviseur, Device Key d'application ou modèle de décodeur) servent exclusivement à activer votre flux d'abonnement et à configurer nos serveurs de diffusion à distance.
                  </p>
                  <p>
                    Nous ne revendons ni ne divulguons aucune donnée personnelle à des entreprises tierces. Toutes les communications et transmissions de données sont chiffrées de bout en bout de manière à sécuriser totalement vos accès IPTV contre toute utilisation frauduleuse.
                  </p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex gap-3.5 items-start">
                  <ShieldCheck className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-amber-400 text-sm">Chiffrement Avancé des Serveurs</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Vos couples d'adresses MAC et clés d'applications sont encryptés sur nos bases de données de serveurs dédiés. Seuls nos techniciens habilités y ont accès pour la configuration de vos bouquets.
                    </p>
                  </div>
                </div>

                {renderStepIndicators(9)}
              </section>
            )}

            {/* ----------------- PAGE 11: SÉCURITÉ DES DONNÉES ----------------- */}
            {currentPage === "securite" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Sécurité des Données</h2>
                  <p className="text-slate-300 text-sm">Nos mesures techniques de cryptage et d'hébergement</p>
                </div>

                <p className="text-sm md:text-base text-slate-200 leading-relaxed text-center max-w-xl mx-auto">
                  La protection de nos utilisateurs est notre priorité absolue. Nous mettons en œuvre les meilleures pratiques du secteur informatique pour préserver l'intégrité de nos infrastructures.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-200">Cryptage Fort</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Tous les flux de configuration de l'API BobPlayer et de 1-Stream sont protégés par chiffrement SSL.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="h-9 w-9 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-200">Hebergement Cloud Sécurisé</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Nos serveurs d'administration et de gestion de code d'activation sont hébergés dans des datacenters certifiés ISO.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-200">Accès Restreint</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">L'accès à la console de gestion d'abonnement est exclusivement réservé au gestionnaire technique authentifié.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <Activity className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-200">Sauvegardes Quotidiennes</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Nous effectuons des copies de sécurité automatiques toutes les 24h pour éviter toute perte de vos abonnements.</p>
                  </div>
                </div>

                {renderStepIndicators(10)}
              </section>
            )}

            {/* ----------------- PAGE 12: MENTIONS LÉGALES ----------------- */}
            {currentPage === "mentions-legales" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Mentions Légales & Avertissement</h2>
                  <p className="text-slate-300 text-sm">Informations contractuelles et cadres de diffusion</p>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar text-xs md:text-sm text-slate-300 leading-relaxed">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                    <h4 className="font-bold text-amber-400">1. Mentions Générales</h4>
                    <p>Ce site internet IPTV Casablanca est édité et exploité par l'équipe technique de support d'IPTV Casablanca.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                    <h4 className="font-bold text-amber-400">2. Utilisation Conforme</h4>
                    <p>L'abonné s'engage à utiliser les services IPTV Casablanca exclusivement dans le cadre d'un usage privé, familial et non commercial. Le partage de vos codes d'activation Xtream sur plusieurs appareils simultanément entraînera la suspension automatique de votre ligne.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                    <h4 className="font-bold text-amber-400">3. Propriété Intellectuelle</h4>
                    <p>Nous diffusons des flux de bouquets TV et catalogues VOD via des accords de serveurs partenaires. Si vous êtes titulaire légitime de droits d'auteur sur un contenu spécifique et souhaitez son retrait ou sa désactivation, contactez-nous via WhatsApp.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                    <h4 className="font-bold text-amber-400">4. Limitation de Responsabilité</h4>
                    <p>Nous faisons le maximum pour assurer un temps de fonctionnement de 99.9% sur nos serveurs. Toutefois, la qualité finale dépend également de la vitesse de votre débit internet ou de la stabilité de votre connexion Wi-Fi domestique.</p>
                  </div>
                </div>

                {renderStepIndicators(11)}
              </section>
            )}

            {/* ----------------- PAGE 13: CONTACT ----------------- */}
            {currentPage === "contact" && (
              <section className="bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Contact</h2>
                  <p className="text-slate-300 text-sm">Envoyez-nous un message écrit ou contactez-nous par WhatsApp</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* WhatsApp contact Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-4">
                    <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                      <PhoneCall className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-base">Contact WhatsApp Ultra-Rapide</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Pour toute question technique urgente, demande d'essai gratuit ou pour activer votre abonnement en moins de 10 minutes, nous vous conseillons de nous contacter directement par WhatsApp :
                    </p>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="h-5 w-5" />
                      <span>Parler à un conseiller</span>
                    </a>
                  </div>

                  {/* Form Contact */}
                  <form onSubmit={handleContactSubmit} className="space-y-4 bg-white/5 border border-white/5 p-5 rounded-2xl">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">Formulaire de contact :</h3>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Votre Nom *</label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Ahmed Alami"
                          required
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Votre Email *</label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="ahmed@gmail.com"
                          required
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Sujet *</label>
                        <input
                          type="text"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="Ex: Problème d'installation"
                          required
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Votre Message *</label>
                        <textarea
                          value={contactMessageText}
                          onChange={(e) => setContactMessageText(e.target.value)}
                          placeholder="Tapez votre question ici..."
                          required
                          rows={3}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold py-3 rounded-xl text-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="h-4.5 w-4.5" />
                      <span>Envoyer le Message</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-2">
                      Protégé par reCAPTCHA v3. Les <a href="https://policies.google.com/privacy" className="underline hover:text-slate-400" target="_blank" rel="noreferrer">règles de confidentialité</a> s'appliquent.
                    </p>
                  </form>
                </div>

                {renderStepIndicators(12)}
              </section>
            )}

            {/* ----------------- ADMIN DASHBOARD VIEW ----------------- */}
            {currentPage === "admin" && isAdminLoggedIn && (
              <section className="bg-[#0f172a] border border-white/10 rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl text-slate-100">
                
                {/* Header of Dashboard */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                        Tableau de bord - Administration
                      </h2>
                      <p className="text-xs text-slate-400">Gérez vos abonnés, commandes, tests gratuits et réglages du site</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-300">Session Administrateur Active</span>
                    <button
                      onClick={() => {
                        setIsAdminLoggedIn(false);
                        setCurrentPage("accueil");
                      }}
                      className="ml-3 bg-red-600 hover:bg-red-500 text-white text-xs py-1.5 px-3.5 rounded-lg transition-all"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>

                {/* Tab buttons */}
                <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-white/5">
                  <button
                    onClick={() => setAdminTab("stats")}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all ${
                      adminTab === "stats" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Activity className="h-4 w-4" />
                    <span>Statistiques</span>
                  </button>

                  <button
                    onClick={() => setAdminTab("orders")}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all ${
                      adminTab === "orders" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Tv className="h-4 w-4" />
                    <span>Abonnements ({orders.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminTab("trials")}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all ${
                      adminTab === "trials" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Essais 1H ({trials.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminTab("contacts")}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all ${
                      adminTab === "contacts" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact ({contactMessages.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminTab("settings")}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all ${
                      adminTab === "settings" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configuration</span>
                  </button>

                  <button
                    onClick={() => setAdminTab("media")}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all ${
                      adminTab === "media" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Médias</span>
                  </button>
                </div>

                {/* Content Tabs */}
                {adminTab === "stats" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-1 shadow-lg">
                        <span className="text-xs text-slate-400">Revenu Annuel Estimé</span>
                        <h4 className="text-2xl font-black text-emerald-400">
                          {orders.filter((o) => o.status === "active").length * annualPriceMAD} DH
                        </h4>
                        <p className="text-[10px] text-slate-500">Basé sur les abonnements activés</p>
                      </div>

                      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-1 shadow-lg">
                        <span className="text-xs text-slate-400">Commandes Totales</span>
                        <h4 className="text-2xl font-black text-white">{orders.length}</h4>
                        <p className="text-[10px] text-amber-500 font-bold">
                          {orders.filter((o) => o.status === "pending").length} en attente
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-1 shadow-lg">
                        <span className="text-xs text-slate-400">Demandes de Test 1H</span>
                        <h4 className="text-2xl font-black text-amber-400">{trials.length}</h4>
                        <p className="text-[10px] text-slate-400">Tests demandés par les prospects</p>
                      </div>

                      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-1 shadow-lg">
                        <span className="text-xs text-slate-400">Messages de Contact</span>
                        <h4 className="text-2xl font-black text-blue-400">{contactMessages.length}</h4>
                        <p className="text-[10px] text-slate-500">Formulaires soumis par les clients</p>
                      </div>
                    </div>

                    {/* Chart list by platform */}
                    <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl">
                      <h4 className="font-bold text-sm mb-3">Répartition des Appareils Clients</h4>
                      <div className="space-y-2.5">
                        {["Samsung TV", "LG TV", "Android TV / BOXTV", "Récepteur Satellite"].map((dev) => {
                          const count = orders.filter((o) => o.device === dev).length;
                          const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                          return (
                            <div key={dev} className="space-y-1 text-xs">
                              <div className="flex justify-between font-bold">
                                <span>{dev}</span>
                                <span>{count} abonnés ({pct.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === "orders" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Abonnements Commandés</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 bg-slate-900/50">
                            <th className="py-3 px-3">Date / ID</th>
                            <th className="py-3 px-3">Client / Contact</th>
                            <th className="py-3 px-3">Appareil</th>
                            <th className="py-3 px-3">Détails de Connexion</th>
                            <th className="py-3 px-3">Statut</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-6 text-center text-slate-500">Aucun abonnement commandé pour l'instant.</td>
                            </tr>
                          ) : (
                            orders.map((o) => (
                              <tr key={o.id} className="hover:bg-slate-900/40">
                                <td className="py-3 px-3 space-y-0.5">
                                  <div className="text-slate-400">{o.date}</div>
                                  <div className="font-mono font-bold text-slate-300">{o.id}</div>
                                </td>
                                <td className="py-3 px-3 space-y-1">
                                  <div className="font-bold text-white">{o.name}</div>
                                  <div className="text-slate-400">{o.phone}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="bg-slate-800 py-1 px-2.5 rounded-lg border border-white/5 text-slate-300">
                                    {o.device}
                                  </span>
                                </td>
                                <td className="py-3 px-3 space-y-1">
                                  {o.macAddress && (
                                    <div className="font-mono text-[11px]">
                                      <span className="text-slate-500">MAC:</span> <span className="text-amber-500 font-bold">{o.macAddress}</span>
                                    </div>
                                  )}
                                  {o.deviceKey && (
                                    <div className="font-mono text-[11px]">
                                      <span className="text-slate-500">Key:</span> <span className="text-amber-500 font-bold">{o.deviceKey}</span>
                                    </div>
                                  )}
                                  {o.androidDeviceModel && (
                                    <div className="text-slate-300 text-[11px]">
                                      <span className="text-slate-500">Modèle:</span> {o.androidDeviceModel}
                                    </div>
                                  )}
                                  {o.receiverModel && (
                                    <div className="text-slate-300 text-[11px]">
                                      <span className="text-slate-500">Récepteur:</span> {o.receiverModel}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  <select
                                    value={o.status}
                                    onChange={(e) => {
                                      const updatedStatus = e.target.value as "pending" | "active" | "cancelled";
                                      const newOrders = orders.map((item) =>
                                        item.id === o.id ? { ...item, status: updatedStatus } : item
                                      );
                                      setOrders(newOrders);
                                      fetch("/api/data/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newOrders) });
                                    }}
                                    className={`py-1 px-2.5 rounded-lg font-bold text-[10px] uppercase border focus:outline-none ${
                                      o.status === "active"
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        : o.status === "cancelled"
                                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                    }`}
                                  >
                                    <option value="pending" className="bg-[#0f172a] text-amber-400">En attente</option>
                                    <option value="active" className="bg-[#0f172a] text-emerald-400">Activé</option>
                                    <option value="cancelled" className="bg-[#0f172a] text-red-400">Annulé</option>
                                  </select>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <a
                                      href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                      title="Contacter sur WhatsApp"
                                    >
                                      <PhoneCall className="h-3.5 w-3.5" />
                                    </a>
                                    <button
                                      onClick={() => {
                                        if (confirm("Supprimer définitivement cette commande ?")) {
                                          const filtered = orders.filter((item) => item.id !== o.id);
                                          setOrders(filtered);
                                          fetch("/api/data/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(filtered) });
                                        }
                                      }}
                                      className="p-1.5 bg-red-600/15 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                      title="Supprimer la commande"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {adminTab === "trials" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Demandes d'Essais Gratuit 1H</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 bg-slate-900/50">
                            <th className="py-3 px-3">Date</th>
                            <th className="py-3 px-3">Prospect</th>
                            <th className="py-3 px-3">Appareil</th>
                            <th className="py-3 px-3">Statut</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {trials.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-slate-500">Aucune demande d'essai pour le moment.</td>
                            </tr>
                          ) : (
                            trials.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-900/40">
                                <td className="py-3 px-3 text-slate-400">{t.date}</td>
                                <td className="py-3 px-3 space-y-0.5">
                                  <div className="font-bold text-white">{t.name}</div>
                                  <div className="text-slate-400">{t.phone}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="bg-slate-800 py-0.5 px-2 rounded-lg text-slate-300 border border-white/5">
                                    {t.device}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    onClick={() => {
                                      const nextStatus = t.status === "pending" ? "sent" : "pending";
                                      const newTrials = trials.map((item) =>
                                        item.id === t.id ? { ...item, status: nextStatus } : item
                                      );
                                      setTrials(newTrials);
                                      fetch("/api/data/trials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newTrials) });
                                    }}
                                    className={`py-0.5 px-2.5 rounded-full font-bold text-[10px] uppercase border cursor-pointer ${
                                      t.status === "sent"
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                    }`}
                                  >
                                    {t.status === "sent" ? "Envoyé" : "En attente"}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <a
                                      href={`https://wa.me/${t.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Bonjour, voici votre code test IPTV gratuit de 1 heure...")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                      title="Envoyer le test"
                                    >
                                      <PhoneCall className="h-3.5 w-3.5" />
                                    </a>
                                    <button
                                      onClick={() => {
                                        if (confirm("Supprimer cette demande d'essai ?")) {
                                          const filtered = trials.filter((item) => item.id !== t.id);
                                          setTrials(filtered);
                                          fetch("/api/data/trials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(filtered) });
                                        }
                                      }}
                                      className="p-1.5 bg-red-600/15 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {adminTab === "contacts" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Messages reçus</h3>
                    <div className="space-y-3.5">
                      {contactMessages.length === 0 ? (
                        <p className="text-center py-6 text-slate-500 text-sm">Aucun message de contact reçu.</p>
                      ) : (
                        contactMessages.map((m) => (
                          <div key={m.id} className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-3 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-2.5">
                              <div>
                                <h4 className="font-extrabold text-white">{m.name}</h4>
                                <p className="text-xs text-slate-400">{m.email}</p>
                              </div>
                              <span className="text-xs font-mono text-slate-500">{m.date}</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">Sujet: {m.subject}</span>
                              <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                                {m.message}
                              </p>
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() => {
                                  if (confirm("Supprimer ce message ?")) {
                                    const filtered = contactMessages.filter((item) => item.id !== m.id);
                                    setContactMessages(filtered);
                                    fetch("/api/data/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(filtered) });
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {adminTab === "media" && (
                  <AdminMediaManager mediaLinks={mediaLinks} setMediaLinks={setMediaLinks} />
                )}

                {adminTab === "settings" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetch("/api/data/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ whatsappNumber, annualPriceMAD, adminPassword })
                      });
                      alert("Réglages mis à jour avec succès !");
                    }}
                    className="space-y-4 max-w-lg bg-slate-900 border border-white/5 p-5 rounded-2xl"
                  >
                    <h3 className="font-bold text-lg border-b border-white/5 pb-2">Réglages du site</h3>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Numéro de WhatsApp Commercial (sans le +) *</label>
                        <input
                          type="text"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Prix de l'abonnement annuel (en DH) *</label>
                        <input
                          type="number"
                          value={annualPriceMAD}
                          onChange={(e) => setAnnualPriceMAD(Number(e.target.value))}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Mot de Passe d'administration *</label>
                        <input
                          type="text"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Settings className="h-4.5 w-4.5" />
                      <span>Enregistrer les modifications</span>
                    </button>
                  </form>
                )}

              </section>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating back button (on bottom left) */}
      {currentPage !== "accueil" && (
        <button
          onClick={handleBack}
          className="fixed bottom-24 md:bottom-24 left-4 md:left-6 z-[60] bg-black/85 hover:bg-black text-white font-bold py-2.5 px-4 rounded-full flex items-center gap-2 border border-white/10 shadow-2xl transition-all hover:scale-105 active:scale-95 text-sm"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span>Retour</span>
        </button>
      )}

      {/* Cookie consent banner */}
      {showCookieBanner && (
        <div className="fixed bottom-24 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 bg-[#0f172a] border border-white/15 p-4 rounded-2xl shadow-2xl flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-white">Gestion des Cookies</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nous utilisons des cookies techniques nécessaires à l'enregistrement local de vos abonnements et préférences.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={rejectCookies} className="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-bold rounded-lg transition-all">
              Refuser
            </button>
            <button onClick={acceptCookies} className="py-1.5 px-4 bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-bold rounded-lg transition-all">
              Accepter
            </button>
          </div>
        </div>
      )}

      {/* YouTube Video Modal Dialog Overlay */}
      {videoModalId && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full aspect-video rounded-3xl overflow-hidden border border-white/15 bg-slate-950">
            <button
              onClick={() => setVideoModalId(null)}
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black text-white h-9 w-9 rounded-full flex items-center justify-center border border-white/10 transition-all hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoModalId}?autoplay=1&rel=0`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Admin Auth Modal Overlay */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <form
            onSubmit={handleAdminAuth}
            className="bg-[#0f172a] border border-white/15 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-slate-200"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-white text-base">Connexion Administration</h3>
              <button type="button" onClick={() => setShowAdminLoginModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400">Mot de Passe Administrateur :</label>
              <input
                type="password"
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                placeholder="Entrez le mot de passe..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-amber-500 text-white"
                required
              />
              {adminLoginError && (
                <p className="text-xs text-red-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>{adminLoginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition-all"
            >
              Déverrouiller
            </button>
          </form>
        </div>
      )}

      {/* Chatbot Toggle Bubble on bottom right */}
      <div className="fixed bottom-24 md:bottom-24 right-4 md:right-6 z-[60] flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="bg-[#0f172a] border border-white/15 rounded-2xl w-80 md:w-96 h-[400px] flex flex-col shadow-2xl overflow-hidden text-slate-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 flex items-center justify-between text-slate-950 font-black text-sm">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-black/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white">Youssef (Support IPTV)</h4>
                  <p className="text-[10px] text-white/80">Support en ligne actif</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 custom-scrollbar bg-black/40 text-xs md:text-sm">
              {chatMessages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                      m.role === "user"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-slate-400 rounded-2xl py-2 px-4 italic animate-pulse">
                    Youssef est en train d'écrire...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleChatSend} className="p-3 border-t border-white/10 flex gap-2 bg-[#0f172a]">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Posez votre question à Youssef..."
                className="flex-grow bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 text-white"
              />
              <button type="submit" className="bg-amber-500 text-slate-950 p-2.5 rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="hover:opacity-90 h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 border-2 border-white/10 p-0 overflow-hidden"
        >
          <img src={chatbotLogo} alt="Chatbot" className="h-full w-full object-cover" />
        </button>
      </div>

      {/* Menu Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1d] border-t border-white/10 py-2.5 md:py-4 px-2 md:px-4 shadow-xl">
        <nav className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2 md:gap-4 text-[10px] md:text-sm font-semibold">
          <button
            onClick={() => handlePageChange("a-propos")}
            className={`px-3 py-1.5 rounded-full transition-all ${currentPage === "a-propos" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
          >
            À propos
          </button>
          
          <button
            onClick={() => handlePageChange("faq")}
            className={`px-3 py-1.5 rounded-full transition-all ${currentPage === "faq" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
          >
            FAQ
          </button>

          <button
            onClick={() => handlePageChange("avis-clients")}
            className={`px-3 py-1.5 rounded-full transition-all ${currentPage === "avis-clients" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
          >
            Avis Clients
          </button>

          <button
            onClick={() => handlePageChange("confidentialite")}
            className={`px-3 py-1.5 rounded-full transition-all ${currentPage === "confidentialite" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
          >
            Confidentialité
          </button>

          <button
            onClick={() => handlePageChange("securite")}
            className={`px-3 py-1.5 rounded-full transition-all ${currentPage === "securite" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
          >
            Sécurité
          </button>

          <button
            onClick={() => handlePageChange("mentions-legales")}
            className={`px-3 py-1.5 rounded-full transition-all ${currentPage === "mentions-legales" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
          >
            Mentions légales
          </button>

          <button
            onClick={() => handlePageChange("contact")}
            className={`px-3 py-1.5 rounded-full transition-all ${currentPage === "contact" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
          >
            Contact
          </button>



          <button
            onClick={() => {
              if (isAdminLoggedIn) {
                setCurrentPage("admin");
              } else {
                setShowAdminLoginModal(true);
              }
            }}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
              currentPage === "admin" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </button>
        </nav>
      </footer>

    </div>
  );
}
