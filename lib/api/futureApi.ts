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

export const getFeaturedApi = async (): Promise<Service[]> => {
  const response = await fetch(`${API_URL}/futured-all`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("API response is not an array");
  }

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
