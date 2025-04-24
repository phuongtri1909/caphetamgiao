import api from '../utils/api';

export const getFranchises = async (page = 1) => {
    try {
      const response = await api.get("/franchises", {
        params: { page }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch franchises");
      }
    } catch (error) {
      console.error("Error fetching franchises:", error);
      throw error;
    }
  };
  
  export const getFranchiseDetail = async (slug) => {
    try {
      const response = await api.get(`/franchises/${slug}`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error(`Error fetching franchise detail for ${slug}:`, error);
      throw error;
    }
  };