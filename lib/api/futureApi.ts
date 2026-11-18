
export interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  isActive: boolean;
}

// All Featured Services
export const featuredApi = async () => {
  const res = await fetch("http://localhost:5000/featured-all");

  if (!res.ok) {
    console.log("API Status:", res.status);
    throw new Error("Failed to fetch featured services");
  }

  const data = await res.json();

  return data;
};

// First 6 Featured Services
export const featuredSixApi = async (): Promise<Service[]> => {
  const res = await fetch("http://localhost:5000/featured");

  if (!res.ok) {
    throw new Error("Failed to fetch featured services");
  }

  return res.json();
};
