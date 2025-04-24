import api from "../utils/api";

/**
 * Get all social media links
 * @returns {Promise} - Promise with the social media data
 */
export const getSocialLinks = async () => {
  try {
    const response = await api.get("/socials");
    
    if (response.data.success) {
      
      return response.data.data;
    } else {
      throw new Error("Failed to fetch social media links");
    }
  } catch (error) {
    console.error("Error fetching social media links:", error);
    // Return default social links as fallback
    return [
      {
        name: "youtube",
        icon: "RiYoutubeFill",
        url: "https://youtube.com",
        status: true
      },
      {
        name: "linkedin",
        icon: "RiLinkedinFill",
        url: "https://linkedin.com",
        status: true
      },
      {
        name: "github",
        icon: "RiGithubFill",
        url: "https://github.com",
        status: true
      },
      {
        name: "facebook",
        icon: "RiFacebookFill",
        url: "https://facebook.com",
        status: true
      },
      {
        name: "instagram",
        icon: "RiInstagramFill",
        url: "https://instagram.com",
        status: true
      }
    ];
  }
};