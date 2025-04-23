import api from '../utils/api';


/**
 * Get all news articles with pagination
 * @param {number} page - Page number
 * @returns {Promise} - Promise with the news data
 */
export const getAllNews = async (page = 1) => {
  try {
    const response = await api.get('/news', { params: { page } });
    return response.data.success ? response.data.data : { data: [], meta: {} };
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

/**
 * Get featured news articles
 * @param {number} page - Page number
 * @returns {Promise} - Promise with featured news data
 */
export const getFeaturedNews = async (page = 1) => {
  try {
    const response = await api.get('/news/featured', { params: { page } });
    return response.data.success ? response.data.data : { data: [], meta: {} };
  } catch (error) {
    console.error("Error fetching featured news:", error);
    throw error;
  }
};

/**
 * Get latest news articles
 * @param {number} page - Page number
 * @returns {Promise} - Promise with latest news data
 */
export const getLatestNews = async (page = 1) => {
  try {
    const response = await api.get('/news/latest', { params: { page } });
    return response.data.success ? response.data.data : { data: [], meta: {} };
  } catch (error) {
    console.error("Error fetching latest news:", error);
    throw error;
  }
};

/**
 * Search news articles
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise} - Promise with search results
 */
export const searchNews = async (query, page = 1) => {
  try {
    const response = await api.get('/news/search', { 
      params: { query, page } 
    });
    return response.data.success ? response.data.data : { data: [], meta: {} };
  } catch (error) {
    console.error("Error searching news:", error);
    throw error;
  }
};

/**
 * Get single news article by slug
 * @param {string} slug - News article slug
 * @returns {Promise} - Promise with news article data
 */
export const getNewsDetail = async (slug) => {
  try {
    const response = await api.get(`/news/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Error fetching news article ${slug}:`, error);
    throw error;
  }
};