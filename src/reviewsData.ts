export interface ReviewItem {
  id: number;
  author: string;
  avatarColor: string;
  initials: string;
  rating: number;
  date: string;
  location: string;
  text: string;
  isLocalGuide?: boolean;
  replied?: {
    date: string;
    text: string;
  };
}

export const reviewsData: ReviewItem[] = [
  {
    id: 1,
    author: "Youssef El Mansouri",
    avatarColor: "bg-blue-500/20 text-blue-400 border-blue-500/10",
    initials: "YM",
    rating: 5,
    date: "Il y a 3 jours",
    location: "Casablanca, Maroc",
    text: "Excellent service IPTV ! Les chaînes en 4K sont d'une fluidité incroyable pour regarder les matchs de football. Activation en moins de 5 minutes par le support technique sur WhatsApp. Je recommande les yeux fermés.",
    isLocalGuide: true,
    replied: {
      date: "Il y a 3 jours",
      text: "Bonjour Youssef, un grand merci pour votre retour positif ! Nous mettons tout en œuvre pour vous garantir une stabilité maximale pour tous vos matchs en direct. Bon visionnage !"
    }
  },
  {
    id: 2,
    author: "Kenza Bennani",
    avatarColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/10",
    initials: "KB",
    rating: 5,
    date: "Il y a 1 semaine",
    location: "Rabat, Maroc",
    text: "Abonnement Premium installé sur ma Smart TV LG avec Bob Player. Zapping ultra rapide, pas de coupures, et le catalogue VOD (films et séries récents) est très riche et mis à jour très régulièrement. Équipe très gentille.",
    replied: {
      date: "Il y a 1 semaine",
      text: "Merci Kenza ! Nous sommes ravis que Bob Player et notre catalogue VOD mis à jour quotidiennement vous apportent entière satisfaction."
    }
  },
  {
    id: 3,
    author: "Amine Hariri",
    avatarColor: "bg-purple-500/20 text-purple-400 border-purple-500/10",
    initials: "AH",
    rating: 5,
    date: "Il y a 2 semaines",
    location: "Marrakech, Maroc",
    text: "Très satisfait du test gratuit de 1 heure puis de l'abonnement annuel. Le service client est professionnel et répond à tout moment de la journée. Je recommande vivement IPTV Casablanca !",
    isLocalGuide: true,
    replied: {
      date: "Il y a 2 semaines",
      text: "Merci beaucoup Amine pour votre confiance ! Notre équipe technique reste disponible 24/7 pour toute assistance."
    }
  },
  {
    id: 4,
    author: "Rachid Alami",
    avatarColor: "bg-amber-500/20 text-amber-400 border-amber-500/10",
    initials: "RA",
    rating: 5,
    date: "Il y a 2 semaines",
    location: "Casablanca, Maroc",
    text: "Le meilleur abonnement IPTV au Maroc sans hésitation. Serveurs hyper stables même pendant les grosses soirées de Ligue des Champions. Le support WhatsApp m'a aidé à configurer mon Amazon Firestick à distance en quelques minutes.",
    isLocalGuide: true,
    replied: {
      date: "Il y a 2 semaines",
      text: "Ravi de vous compter parmi nos abonnés premium, Rachid ! Nos serveurs équilibrés en charge sont spécialement conçus pour tenir sans freeze lors des grands directs."
    }
  },
  {
    id: 5,
    author: "Fatima-Zahra Chraibi",
    avatarColor: "bg-rose-500/20 text-rose-400 border-rose-500/10",
    initials: "FC",
    rating: 5,
    date: "Il y a 3 semaines",
    location: "Fès, Maroc",
    text: "Excellent catalogue de films et de séries arabes, françaises et internationales. Qualité d'image 4K superbe. Très réactifs sur WhatsApp pour l'activation. Je l'utilise sur Apple TV et ça marche à la perfection.",
    replied: {
      date: "Il y a 3 semaines",
      text: "Merci Fatima-Zahra ! L'Apple TV offre effectivement une superbe expérience de décodage avec notre flux 4K."
    }
  },
  {
    id: 6,
    author: "Karim Tazi",
    avatarColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/10",
    initials: "KT",
    rating: 5,
    date: "Il y a 1 mois",
    location: "Casablanca, Maroc",
    text: "Zapping ultra rapide et fluidité absolue. J'ai testé plusieurs fournisseurs d'IPTV au Maroc avant, mais celui-ci est de loin le plus stable. Pas de freeze, pas de décalage de son.",
    replied: {
      date: "Il y a 1 mois",
      text: "Bonjour Karim, merci pour votre témoignage. Notre infrastructure réseau privée fait toute la différence par rapport aux offres low-cost du marché."
    }
  },
  {
    id: 7,
    author: "Salma El Fassi",
    avatarColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/10",
    initials: "SF",
    rating: 5,
    date: "Il y a 1 mois",
    location: "Tangier, Maroc",
    text: "Très bon rapport qualité-prix. Support client impeccable et super patient qui m'a aidé à installer l'application XCIPTV sur ma Smart TV Samsung. Je recommande ce pack premium !",
    replied: {
      date: "Il y a 1 mois",
      text: "Merci Salma ! Installer sur Samsung via XCIPTV ou smart TV est notre spécialité. Bon divertissement !"
    }
  },
  {
    id: 8,
    author: "Mehdi Bensouda",
    avatarColor: "bg-teal-500/20 text-teal-400 border-teal-500/10",
    initials: "MB",
    rating: 5,
    date: "Il y a 2 mois",
    location: "Agadir, Maroc",
    text: "Service au top ! Je l'utilise principalement sur ma Box Android TV dans mon salon, et sur mon smartphone lors de mes déplacements professionnels. C'est hyper stable et pratique. Rapport qualité prix imbattable.",
    isLocalGuide: true
  },
  {
    id: 9,
    author: "Hassan Jouahri",
    avatarColor: "bg-orange-500/20 text-orange-400 border-orange-500/10",
    initials: "HJ",
    rating: 5,
    date: "Il y a 2 mois",
    location: "Casablanca, Maroc",
    text: "Je recommande vivement IPTV Casablanca. Le service d'activation est très rapide, j'ai reçu mes codes d'accès en moins de 10 minutes après le paiement. Le guide des programmes (EPG) est super complet.",
    replied: {
      date: "Il y a 2 mois",
      text: "Merci Hassan ! Nous veillons à ce que le guide EPG soit toujours synchronisé pour un confort de lecture optimal."
    }
  },
  {
    id: 10,
    author: "Nadia Belkhayat",
    avatarColor: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/10",
    initials: "NB",
    rating: 5,
    date: "Il y a 3 mois",
    location: "Oujda, Maroc",
    text: "Des milliers de chaînes du monde entier et une bibliothèque VOD de films et séries énorme. Qualité d'image irréprochable et support WhatsApp très réactif pour toutes les questions d'installation. 5 étoiles méritées.",
    replied: {
      date: "Il y a 3 mois",
      text: "Merci beaucoup Nadia pour votre gentil message. Notre équipe est ravie de vous accompagner !"
    }
  }
];
