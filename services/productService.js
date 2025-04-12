import api from "../utils/api";

export const getProducts = async (filters = {}) => {
  try {
    const response = await api.get("/products", { params: filters });
    return response.data.success ? response.data.data : { data: [], meta: {} };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductDetail = async (slug) => {
  try {
    const response = await api.get(`/products/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    throw error;
  }
};

export const getProductReviews = async (slug, page = 1) => {
  try {
    const response = await api.get(`/products/${slug}/reviews`, {
      params: { page },
    });
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Error fetching reviews for ${slug}:`, error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/products/featured");
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

export const searchProducts = async (query, page = 1) => {
  try {
    const response = await api.get("/products/search", {
      params: { q: query, page },
    });
    return response.data.success ? response.data.data : { data: [], meta: {} };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
