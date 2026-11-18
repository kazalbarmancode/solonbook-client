
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

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Single Service Details
export const getServiceDetails = async (
  id: string
): Promise<Service> => {
  const response = await fetch(`${API_URL}/futured-all/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch service details");
  }

  return response.json();
};

// Related Services
export const getRelatedServices = async (
  category: string,
  currentId: string
): Promise<Service[]> => {
  const response = await fetch(`${API_URL}/futured-all`);

  if (!response.ok) {
    throw new Error("Failed to fetch related services");
  }

  const data: Service[] = await response.json();

  return data
    .filter(
      (service) =>
        service._id !== currentId &&
        service.category === category &&
        service.isActive
    )
    .slice(0, 3);
};
