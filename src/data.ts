import { PricingPlan, ChannelCategory, DeviceGuide } from "./types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "eco_3m",
    name: "Formule Éco",
    duration: "3 Mois",
    priceMAD: 150,
    priceEUR: 15,
    features: [
      "+15 000 Chaînes Live HD & 4K",
      "+45 000 Films & Séries (VOD)",
      "Technologie Anti-Coupure (99.9% Uptime)",
      "Chaînes de Sport Premium incluses",
      "Qualité SD/HD/FHD/4K",
      "Support Client Dédié 24h/7j",
      "Mises à jour gratuites régulières",
    ],
    isPopular: false,
    whatsappMessage: "Bonjour IPTV Casablanca, je souhaite m'abonner à la Formule Éco de 3 Mois (150 DH). Pouvez-vous m'aider à l'activer ?",
  },
  {
    id: "standard_6m",
    name: "Formule Standard",
    duration: "6 Mois",
    priceMAD: 250,
    priceEUR: 25,
    features: [
      "+15 000 Chaînes Live HD & 4K",
      "+45 000 Films & Séries (VOD)",
      "Technologie Anti-Coupure (99.9% Uptime)",
      "Chaînes de Sport Premium incluses",
      "Qualité SD/HD/FHD/4K",
      "Support Client Dédié 24h/7j",
      "Mises à jour gratuites régulières",
    ],
    isPopular: false,
    whatsappMessage: "Bonjour IPTV Casablanca, je souhaite m'abonner à la Formule Standard de 6 Mois (250 DH). Pouvez-vous m'aider à l'activer ?",
  },
  {
    id: "premium_12m",
    name: "Formule Premium",
    duration: "12 Mois",
    priceMAD: 250,
    priceEUR: 25,
    features: [
      "+15 000 Chaînes Live HD & 4K",
      "+45 000 Films & Séries (VOD) 4K",
      "Technologie Anti-Freezing Ultra-Performante",
      "Toutes les Chaînes de Sport Premium (BeIN, RMC, Canal+)",
      "Serveur VIP Ultra-Rapide et Stable",
      "Support Client Prioritaire WhatsApp 24/7",
      "Aide à l'installation à distance gratuite",
      "Test Gratuit 1 Heure disponible",
    ],
    isPopular: true,
    badge: "Meilleur Rapport Qualité/Prix",
    whatsappMessage: "Bonjour IPTV Casablanca, je souhaite m'abonner à la Formule Premium de 12 Mois (250 DH) qui est votre Best Seller. Pouvez-vous m'aider à l'activer ?",
  },
  {
    id: "vip_24m",
    name: "Formule VIP",
    duration: "24 Mois",
    priceMAD: 690,
    priceEUR: 69,
    features: [
      "+15 000 Chaînes Live HD & 4K",
      "+45 000 Films & Séries (VOD) 4K",
      "Technologie Anti-Freezing Ultra-Performante",
      "Toutes les Chaînes de Sport Premium incluses",
      "Serveur VIP Ultra-Rapide (Double Bande passante)",
      "Support Client Prioritaire VIP 24/7",
      "Aide à l'installation à distance",
      "Garantie totale 24 Mois sans coupure",
    ],
    isPopular: false,
    badge: "Économie Maximum",
    whatsappMessage: "Bonjour IPTV Casablanca, je souhaite m'abonner à la Formule VIP de 24 Mois (690 DH) pour une tranquillité totale. Pouvez-vous m'aider ?",
  },
];

export const CHANNEL_CATEGORIES: ChannelCategory[] = [
  {
    id: "sports",
    name: "Sports Premium",
    icon: "Trophy",
    description: "Vivez les plus grands championnats (Champions League, Botola, Premier League, LaLiga, Serie A) en qualité maximale et sans latence.",
    popularChannels: [
      { name: "beIN Sports 1 Premium", isHd: true, category: "Sports" },
      { name: "beIN Sports 2 Premium", isHd: true, category: "Sports" },
      { name: "Canal+ Sport France", isHd: true, category: "Sports" },
      { name: "RMC Sport 1", isHd: true, category: "Sports" },
      { name: "Arryadia TNT HD", isHd: true, category: "Sports" },
      { name: "SSC Sports Saudi", isHd: true, category: "Sports" },
      { name: "DAZN Ligue 1", isHd: true, category: "Sports" },
      { name: "Eurosport 1", isHd: true, category: "Sports" },
    ],
  },
  {
    id: "morocco_arab",
    name: "Maroc & Monde Arabe",
    icon: "Tv",
    description: "Toutes vos chaînes marocaines régionales, nationales et les plus grands bouquets du monde arabe (MBC, Rotana, Abu Dhabi).",
    popularChannels: [
      { name: "2M Monde HD", isHd: true, category: "Maroc" },
      { name: "Al Aoula Maroc HD", isHd: true, category: "Maroc" },
      { name: "Medi 1 TV", isHd: true, category: "Maroc" },
      { name: "MBC 1 HD", isHd: true, category: "Arabe" },
      { name: "MBC Masr", isHd: true, category: "Arabe" },
      { name: "Rotana Cinema", isHd: true, category: "Arabe" },
      { name: "Abu Dhabi Drama", isHd: true, category: "Arabe" },
      { name: "Al Arabiya HD", isHd: true, category: "News" },
    ],
  },
  {
    id: "france_europe",
    name: "France & Europe Premium",
    icon: "Globe",
    description: "Un catalogue complet de chaînes françaises, espagnoles, italiennes et anglaises pour toute la famille en qualité Full HD.",
    popularChannels: [
      { name: "TF1 Full HD", isHd: true, category: "France" },
      { name: "M6 Full HD", isHd: true, category: "France" },
      { name: "Canal+ France", isHd: true, category: "France" },
      { name: "TMC HD", isHd: true, category: "France" },
      { name: "France 2 HD", isHd: true, category: "France" },
      { name: "Telecinco HD", isHd: true, category: "Espagne" },
      { name: "Rai 1 HD", isHd: true, category: "Italie" },
      { name: "Sky Cinema UK", isHd: true, category: "Royaume-Uni" },
    ],
  },
  {
    id: "vod",
    name: "Cinéma & Séries (VOD)",
    icon: "Film",
    description: "Un catalogue de plus de 45 000 films et séries issus des plus grandes plateformes (Netflix, Disney+, Prime Video, Apple TV+) avec mises à jour quotidiennes.",
    popularChannels: [
      { name: "[VOD] Gladiator II (2024)", isHd: true, category: "Films Récents" },
      { name: "[VOD] Dune: Part Two (2024)", isHd: true, category: "Films Récents" },
      { name: "[VOD] Squid Game - Saison 2", isHd: true, category: "Séries Actuelles" },
      { name: "[VOD] House of the Dragon", isHd: true, category: "Séries Actuelles" },
      { name: "[VOD] Oppenheimer", isHd: true, category: "Films Récents" },
      { name: "[VOD] Stranger Things S4", isHd: true, category: "Séries Actuelles" },
      { name: "[VOD] Le Roi Lion (Live Action)", isHd: true, category: "Enfants" },
      { name: "[VOD] Spider-Man No Way Home", isHd: true, category: "Films Récents" },
    ],
  },
];

export const DEVICE_GUIDES: DeviceGuide[] = [
  {
    id: "smart_tv",
    name: "Smart TV (Samsung, LG, Sony...)",
    icon: "Monitor",
    steps: [
      {
        title: "Télécharger l'Application",
        description: "Recherchez 'IPTV Smarters Pro', 'IBO Player', 'Set IPTV' ou 'Smart IPTV' dans la boutique d'applications de votre Smart TV et installez-la.",
      },
      {
        title: "Récupérer vos identifiants",
        description: "Après validation de votre abonnement, nous vous envoyons par WhatsApp votre lien M3U et vos codes Xtream API (Nom d'utilisateur, Mot de passe, URL du serveur).",
      },
      {
        title: "Saisir vos codes",
        description: "Lancez l'application, choisissez 'Connexion via Xtream Codes' (recommandé), puis saisissez les informations fournies. Les flux se chargeront instantanément.",
      },
    ],
  },
  {
    id: "android_firestick",
    name: "Android Box & Amazon Fire Stick",
    icon: "Cpu",
    steps: [
      {
        title: "Activer les applications inconnues",
        description: "Sur votre Amazon Fire Stick, allez dans Paramètres > Ma Fire TV > Options pour les développeurs, et activez les applications de sources inconnues (ou utilisez l'application 'Downloader').",
      },
      {
        title: "Installer l'application IPTV",
        description: "Téléchargez l'application 'IPTV Smarters Pro' ou 'Smarters Player Lite' depuis le Google Play Store ou en saisissant l'URL de téléchargement direct dans Downloader.",
      },
      {
        title: "Connecter vos accès",
        description: "Ouvrez l'application, sélectionnez 'Add User', puis insérez les identifiants Xtream Codes que nous vous avons transmis pour commencer à regarder vos chaînes.",
      },
    ],
  },
  {
    id: "ios_apple_tv",
    name: "iPhone, iPad & Apple TV",
    icon: "Smartphone",
    steps: [
      {
        title: "Installer une application compatible",
        description: "Allez sur l'App Store de votre appareil Apple et téléchargez une application de lecture comme 'IPTV Smarters Pro', 'GSE Smart IPTV' ou 'Smarters Player Lite'.",
      },
      {
        title: "Configurer l'accès Xtream",
        description: "Sélectionnez 'Xtream Codes API' dans l'application, entrez le nom de profil (ex: 'IPTV Casablanca'), puis les informations de connexion reçues par message.",
      },
      {
        title: "Chargement de la Playlist",
        description: "Cliquez sur 'Add User' ou 'Connecter'. L'application télécharge la liste des chaînes et le catalogue de films/séries. Vous êtes prêt !",
      },
    ],
  },
];
