import api from "../utils/api";

/**
 * Get all active banners
 * @returns {Promise} - Promise with active banners data
 */
export const getActiveBanners = async () => {
  try {
    const response = await api.get("/banners/active");
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching active banners:", error);
    throw error;
  }
}; 