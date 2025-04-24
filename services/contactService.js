import api from '../utils/api';

/**
 * Submit contact form data to the backend
 * @param {Object} contactData - The contact form data
 * @param {string} contactData.name - User's name
 * @param {string} contactData.contact - User's phone/Zalo number
 * @param {string} contactData.message - User's message or request
 * @returns {Promise} - The API response
 */
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to submit contact form");
    }
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};