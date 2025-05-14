import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service types based on backend model
export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'hourly' | 'fixed';
  location: string;
  image: string;
  status: 'active' | 'inactive';
  provider: string;
  createdAt: string;
  updatedAt: string;
}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Service API functions
export const serviceApi = {
  // Get all services for the logged-in provider
  getMyServices: async (): Promise<Service[]> => {
    try {
      const response = await api.get<ApiResponse<Service[]>>('/services');
      return response.data.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get a service by ID
  getServiceById: async (id: string): Promise<Service> => {
    try {
      const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
      return response.data.data as Service;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create a new service
  createService: async (serviceData: FormData): Promise<Service> => {
    try {
      const response = await api.post<ApiResponse<Service>>('/services', serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      return response.data.data as Service;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update a service
  updateService: async (id: string, serviceData: FormData): Promise<Service> => {
    try {
      const response = await api.put<ApiResponse<Service>>(`/services/${id}`, serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      return response.data.data as Service;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Toggle service status
  toggleServiceStatus: async (id: string): Promise<Service> => {
    try {
      const response = await api.patch<ApiResponse<Service>>(`/services/${id}/toggle-status`);
      return response.data.data as Service;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete a service
  deleteService: async (id: string): Promise<void> => {
    try {
      await api.delete<ApiResponse<null>>(`/services/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Error handler function
function handleApiError(error: any): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return new Error(message);
  }
  return error instanceof Error ? error : new Error('Unknown error');
}

export default api;