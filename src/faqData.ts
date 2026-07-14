export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "general" | "config" | "network" | "troubleshoot";
}

export const faqCategories = [
  { id: "all", name: "Toutes les questions" },
  { id: "general", name: "Général & Offres" },
  { id: "config", name: "Installation & Applications" },
  { id: "network", name: "Connexion, Débit & VPN" },
  { id: "troubleshoot", name: "Résolution de Problèmes & Sécurité" }
];

export const faqData: FAQItem[] = [
  {
    id: 1,
    category: "general",
    question: "Qu'est-ce que l'IPTV ?",
    answer: "L'IPTV (Internet Protocol Television) est une technologie qui permet de diffuser des contenus télévisuels via Internet, plutôt que par les moyens traditionnels comme la TNT, le satellite ou le câble. Elle permet d'accéder à des chaînes en direct, des films et des séries sur divers appareils connectés."
  },
  {
    id: 2,
    category: "general",
    question: "L'IPTV est-elle légale ?",
    answer: "La technologie IPTV est parfaitement légale en elle-même. Ce qui détermine la légalité, c'est la source du contenu : les offres d'opérateurs ou de plateformes officielles (comme Netflix, MyCanal, etc.) sont légales car elles détiennent les droits de diffusion. IPTV Casablanca s'engage à vous guider vers des installations sûres et conformes."
  },
  {
    id: 3,
    category: "general",
    question: "Comment reconnaître un service IPTV de mauvaise qualité ou suspect ?",
    answer: "Plusieurs indices doivent vous alerter : un prix anormalement bas pour des milliers de chaînes sans aucune garantie de stabilité, l'absence complète de support client réactif, et des méthodes de paiement totalement anonymes. Chez IPTV Casablanca, nous fournissons un service Premium avec un support technique disponible 24h/24 et 7j/7."
  },
  {
    id: 4,
    category: "general",
    question: "Quels sont les risques d'utiliser une offre IPTV instable ou non certifiée ?",
    answer: "Les risques d'offres gratuites ou bas de gamme sont multiples : coupures incessantes pendant les grands matchs, vol de vos données bancaires sur des sites non sécurisés, et infection de vos appareils par des virus. De plus, ces services bas de gamme n'offrent aucune garantie et peuvent s'arrêter du jour au lendemain."
  },
  {
    id: 5,
    category: "network",
    question: "Quel débit internet est nécessaire pour regarder l'IPTV en 4K ?",
    answer: "Pour une diffusion fluide en 4K Ultra HD, un débit minimum et stable de 25 à 30 Mbps est indispensable. Cependant, une vitesse de 50 Mbps ou plus est vivement recommandée pour pallier les fluctuations du réseau et l'utilisation simultanée d'autres appareils dans votre foyer."
  },
  {
    id: 6,
    category: "network",
    question: "Puis-je regarder l'IPTV avec une connexion ADSL ?",
    answer: "C'est techniquement possible, mais difficile pour les flux en très haute définition (4K). L'ADSL plafonne souvent à 15-20 Mbps. Pour une expérience optimale sans aucune coupure, une connexion en fibre optique ou 4G/5G stable est fortement préconisée."
  },
  {
    id: 7,
    category: "network",
    question: "Vaut-il mieux utiliser le Wi-Fi ou un câble Ethernet ?",
    answer: "Pour garantir une stabilité maximale et éviter les micro-coupures ou saccades, l'utilisation d'un câble Ethernet (RJ45) branché directement à votre box est la solution idéale, car elle élimine toutes les interférences et pertes de signal liées au Wi-Fi."
  },
  {
    id: 8,
    category: "config",
    question: "Quel matériel utiliser pour profiter de l'IPTV ?",
    answer: "L'IPTV fonctionne sur Smart TV (Samsung, LG, Sony, Philips, TCL, Hisense), smartphones, tablettes et ordinateurs. Pour les téléviseurs plus anciens ou non connectés, l'ajout d'une passerelle multimédia comme une Nvidia Shield, un Amazon Fire Stick ou une Apple TV est parfait."
  },
  {
    id: 9,
    category: "config",
    question: "Quelle est la meilleure application IPTV pour Smart TV et Android TV ?",
    answer: "Pour les Smart TV Samsung, LG, Hisense et Roku, l'application Bob Player (ou IBO Player) est l'une des plus populaires pour sa simplicité et sa stabilité. Pour les supports Android (Box TV, Firestick, Smartphones), nous offrons gratuitement notre application officielle King IPTV Pro."
  },
  {
    id: 10,
    category: "config",
    question: "Qu'est-ce que King IPTV Pro ?",
    answer: "King IPTV Pro est notre lecteur multimédia sophistiqué officiel pour Android, TV Box et Firestick. Il permet de gérer et de visionner vos flux de manière extrêmement fluide, rapide et organisée, avec une interface moderne et élégante."
  },
  {
    id: 11,
    category: "config",
    question: "Comment installer une application IPTV sur ma Smart TV ?",
    answer: "La méthode la plus simple consiste à passer par le magasin d'applications officiel de votre TV (Google Play Store, Samsung Smart Hub, LG Content Store). Si l'application souhaitée n'y figure pas, vous pouvez installer des fichiers compatibles via l'outil 'Downloader' ou nous contacter sur WhatsApp pour vous guider pas à pas."
  },
  {
    id: 12,
    category: "network",
    question: "Faut-il utiliser un VPN pour l'IPTV ?",
    answer: "Pour un abonnement officiel et de haute qualité comme IPTV Casablanca, un VPN n'est absolument pas nécessaire car nos flux sont sécurisés. Cependant, un VPN peut être utile pour protéger votre vie privée globale sur internet ou pour contourner d'éventuels bridages de bande passante imposés par certains fournisseurs d'accès internet (FAI)."
  },
  {
    id: 13,
    category: "network",
    question: "Comment débloquer une IPTV bridée par mon fournisseur d'accès (FAI) ?",
    answer: "Si vous constatez des ralentissements inhabituels uniquement le soir pendant les grands événements sportifs, votre FAI bride probablement votre connexion. L'utilisation d'un VPN de qualité (comme ExpressVPN ou NordVPN) ou le changement des paramètres DNS de votre appareil vers les DNS de Cloudflare (1.1.1.1) ou Google (8.8.8.8) résout instantanément ce problème."
  },
  {
    id: 14,
    category: "general",
    question: "Puis-je utiliser mon abonnement sur plusieurs écrans simultanément ?",
    answer: "Par défaut, nos formules premium standard autorisent une connexion sur un seul écran à la fois. Si vous souhaitez utiliser votre abonnement sur un deuxième écran sans connexion simultanée (par exemple la chambre et le salon séparément), nous pouvons l'activer sur demande. Pour un usage simultané sur plusieurs écrans, contactez-nous pour nos tarifs multi-écrans avantageux."
  },
  {
    id: 15,
    category: "general",
    question: "Quels sont les avantages de passer par notre offre IPTV Casablanca ?",
    answer: "IPTV Casablanca vous garantit une stabilité parfaite grâce à nos serveurs privés équilibrés en charge, une qualité d'image réelle en 4K/FHD, un guide des programmes (EPG) complet, et surtout un service client et support technique ultra-réactif disponible 24/7 directement sur WhatsApp pour l'aide à la configuration."
  },
  {
    id: 16,
    category: "config",
    question: "C'est quoi un EPG (Electronic Program Guide) ?",
    answer: "L'EPG est un guide TV numérique interactif intégré à votre application IPTV. Il affiche en temps réel la grille des programmes des différentes chaînes, les horaires d'émission, les résumés des films et séries en cours, et les programmes à venir."
  },
  {
    id: 17,
    category: "network",
    question: "Peut-on utiliser un VPN gratuit pour l'IPTV ?",
    answer: "C'est fortement déconseillé. Les VPN gratuits ont des performances extrêmement limitées (bande passante restreinte provoquant des saccades), collectent vos données de navigation à des fins publicitaires, et peuvent compromettre la sécurité de votre réseau domestique."
  },
  {
    id: 18,
    category: "troubleshoot",
    question: "Quels sont les dangers pour mes données personnelles ?",
    answer: "Chez IPTV Casablanca, il y a absolument zéro risque pour vos données personnelles. Nos applications recommandées sont officielles et ne demandent aucune autorisation abusive qui donnerait accès à vos e-mails, vos contacts ou vos photos personnelles."
  },
  {
    id: 19,
    category: "troubleshoot",
    question: "Pourquoi mon IPTV s'arrête-t-elle ou 'bufférise' sans cesse ?",
    answer: "Ce phénomène (chargement ou mise en mémoire tampon) est généralement causé par un débit internet instable ou une saturation locale de votre bande passante (téléchargements en cours, Wi-Fi affaibli). Un débit stable d'au moins 25 Mbps est requis. Redémarrez votre box internet et privilégiez une connexion par câble Ethernet."
  },
  {
    id: 20,
    category: "network",
    question: "Le Wi-Fi est-il suffisant pour regarder l'IPTV en Haute Définition ?",
    answer: "Bien que pratique, le signal Wi-Fi subit des interférences électromagnétiques et s'affaiblit avec la distance et les obstacles (murs). Pour une stabilité de visionnage optimale et sans micro-coupures en 4K/FHD, l'usage d'un câble Ethernet RJ45 de catégorie 6 ou d'un kit CPL est vivement recommandé."
  },
  {
    id: 21,
    category: "troubleshoot",
    question: "Comment résoudre un bug d'affichage sur mon application (Bob Player, King IPTV Pro, etc.) ?",
    answer: "Avec le temps, les applications accumulent des données de cache qui peuvent ralentir l'interface ou causer des bugs. Allez dans les paramètres de votre appareil, sélectionnez votre application, et cliquez sur 'Vider le cache'. Si le bug persiste, une réinitialisation complète ou une réinstallation de l'application corrige le problème dans 99% des cas."
  },
  {
    id: 22,
    category: "troubleshoot",
    question: "Que faire si ma liste de chaînes ou mon guide TV (EPG) ne s'affiche plus ?",
    answer: "Il s'agit souvent d'un simple défaut temporaire de synchronisation avec nos serveurs. Cherchez l'option 'Refresh', 'Forcer la mise à jour' ou 'Reload' dans les menus ou paramètres de votre application pour forcer le rechargement complet de votre liste de chaînes et de l'EPG."
  },
  {
    id: 23,
    category: "config",
    question: "Pourquoi est-il important de mettre à jour régulièrement mon application IPTV ?",
    answer: "Les développeurs publient régulièrement des correctifs de stabilité, de nouveaux codecs vidéo et des améliorations de sécurité. Une application obsolète peut cesser de décoder correctement certains flux vidéo récents. Pensez à vérifier les mises à jour sur votre store d'applications."
  },
  {
    id: 24,
    category: "troubleshoot",
    question: "Comment savoir si la panne vient de mon internet ou du serveur IPTV ?",
    answer: "Effectuez un test de débit rapide (Speedtest) depuis l'appareil que vous utilisez pour l'IPTV. Si votre débit est normal mais que le service ne démarre pas, essayez d'ouvrir le flux sur votre smartphone en connexion 4G/5G (hors Wi-Fi de la maison). Si cela fonctionne en 4G, le problème vient de votre fournisseur d'accès internet qui bloque ou bride le flux."
  },
  {
    id: 25,
    category: "troubleshoot",
    question: "Un VPN peut-il aider à résoudre les problèmes de saccades ?",
    answer: "Oui ! Si votre fournisseur d'accès internet (FAI) bride volontairement la vitesse de votre connexion vers nos serveurs (bridage de flux), l'activation d'un VPN masquera la nature de votre trafic internet. Votre FAI ne pourra plus identifier que vous regardez de l'IPTV, ce qui restaurera votre vitesse maximale habituelle."
  },
  {
    id: 26,
    category: "troubleshoot",
    question: "Que faire si mon VPN est détecté et bloqué par mon service IPTV ?",
    answer: "Certains serveurs de sécurité bloquent les adresses IP publiques partagées par les VPN commerciaux. Si cela arrive, changez simplement de serveur ou de pays dans votre application VPN, utilisez le port de connexion 443, ou activez l'option de 'serveurs obscurcis / furtifs' (Obfuscated Servers) de votre VPN."
  },
  {
    id: 27,
    category: "troubleshoot",
    question: "Quels sont les risques d'utiliser une application IPTV non officielle (fichiers APK inconnus) ?",
    answer: "Les applications téléchargées sous forme de fichiers APK en dehors des magasins officiels ou de notre site peuvent contenir des logiciels espions, chevaux de troie ou malwares destinés à voler vos données ou ralentir vos appareils. Téléchargez uniquement via nos liens officiels recommandés."
  },
  {
    id: 28,
    category: "config",
    question: "Comment mettre à jour mon abonnement sur mon application ?",
    answer: "Pour les applications configurées via l'API Xtream Codes (Nom d'utilisateur et Mot de passe), la mise à jour de la date d'expiration et du contenu est 100% automatique après notre activation. Vous n'avez aucune manipulation compliquée à faire !"
  },
  {
    id: 29,
    category: "troubleshoot",
    question: "Pourquoi mon boîtier Android TV chauffe-t-il ou redémarre-t-il tout seul ?",
    answer: "Le décodage de flux vidéo Ultra HD 4K avec des codecs modernes (comme le H.265/HEVC) sollicite fortement le processeur et la puce graphique de votre boîtier. Les appareils d'entrée de gamme de faible qualité peuvent surchauffer. Privilégiez des appareils certifiés et performants (comme l'Amazon Fire Stick 4K ou la Xiaomi Mi Box) pour un confort d'utilisation optimal."
  },
  {
    id: 30,
    category: "troubleshoot",
    question: "Que se passe-t-il si notre service IPTV effectue une maintenance ?",
    answer: "Afin de garantir un service de qualité supérieure, des maintenances planifiées nocturnes ou des mises à jour serveurs peuvent parfois avoir lieu. Ces opérations durent généralement moins de 15 minutes. Un redémarrage rapide de votre application ou de votre décodeur suffit pour rétablir la connexion à la fin de la maintenance."
  },
  {
    id: 31,
    category: "troubleshoot",
    question: "Est-il possible de récupérer mon argent si mon service IPTV tiers bon marché est coupé ?",
    answer: "Les revendeurs d'offres low-cost bas de gamme disparaissent fréquemment et n'offrent aucun service après-vente ou remboursement. C'est pourquoi passer par un prestataire de confiance établi comme IPTV Casablanca vous sécurise : nous offrons une garantie de continuité de service et un support de techniciens réactifs joignables en tout temps."
  }
];
