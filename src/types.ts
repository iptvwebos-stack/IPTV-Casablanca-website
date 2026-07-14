export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  priceMAD: number;
  priceEUR: number;
  features: string[];
  isPopular: boolean;
  badge?: string;
  whatsappMessage: string;
}

export interface Channel {
  name: string;
  logoUrl?: string;
  isHd?: boolean;
  category: string;
}

export interface ChannelCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  popularChannels: Channel[];
}

export interface DeviceStep {
  title: string;
  description: string;
}

export interface DeviceGuide {
  id: string;
  name: string;
  icon: string;
  steps: DeviceStep[];
}

export interface ChannelData {
  country: string;
  "Channel Name": string;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  planName: string;
  price: string;
  device: string;
  macAddress?: string;
  deviceKey?: string;
  appChosen?: string;
  status: "pending" | "active" | "cancelled";
  date: string;
  timestamp: number;
}

export interface TrialRequest {
  id: string;
  name: string;
  email?: string;
  phone: string;
  device: string;
  status: "pending" | "sent";
  date: string;
  timestamp: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  timestamp: number;
}
