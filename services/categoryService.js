import api from '../utils/api';

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryDetail = async (slug) => {
  try {
    const response = await api.get(`/categories/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    throw error;
  }
};

export const getCategoryProducts = async (slug) => {
  try {
    const response = await api.get(`/categories/${slug}/products`);
    return response.data.success ? response.data.data : { category: null, products: [] };
  } catch (error) {
    console.error(`Error fetching products for category ${slug}:`, error);
    throw error;
  }
};