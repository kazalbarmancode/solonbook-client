import { Service } from "./servicesDetailsPageApi";

export interface ServiceType {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ||  "http://localhost:5000"

// All Featured Services
export const getFeaturedApi = async (): Promise<ServiceType[]> => {
  const res = await fetch(`${API_URL}/featured-all`);

  if (!res.ok) {
    console.log("API Status:", res.status);
    throw new Error("Failed to fetch featured services");
  }

  const data: Service[] = await res.json();

  return data;
};

// First 6 Featured Services
export const getFeaturedSixApi = async (): Promise<Service[]> => {
  const res = await fetch(`${API_URL}/featured`);

  if (!res.ok) {
    console.log("API Status:", res.status);
    throw new Error("Failed to fetch featured services");
  }

  const data: Service[] = await res.json();

  return data;
};
