
import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * Custom hook cơ bản để gọi API
 * @param {string} url - Endpoint API
 * @param {object} options - Options cho API call
 * @param {boolean} loadOnMount - Tự động gọi API khi component mount
 */
export function useAPI(url, options = {}, loadOnMount = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Hàm để gọi API
  const fetchData = async (overrideUrl = url, overrideOptions = options) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(overrideUrl, overrideOptions);
      if (response.data.success) {
        setData(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Đã có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Trigger refresh
  const refresh = () => {
    setRefreshIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (loadOnMount) {
      fetchData();
    }
  }, [refreshIndex, url]);

  return { data, loading, error, fetchData, refresh };
}

/**
 * Hook cho danh sách danh mục
 */
export function useCategories() {
  return useAPI('/categories');
}

/**
 * Hook cho chi tiết danh mục
 */
export function useCategoryDetail(slug) {
  const [isReady, setIsReady] = useState(Boolean(slug));
  
  useEffect(() => {
    setIsReady(Boolean(slug));
  }, [slug]);

  return useAPI(`/categories/${slug}`, {}, isReady);
}

/**
 * Hook cho danh sách sản phẩm của danh mục
 */
export function useCategoryProducts(slug) {
  const [isReady, setIsReady] = useState(Boolean(slug));
  
  useEffect(() => {
    setIsReady(Boolean(slug));
  }, [slug]);

  return useAPI(`/categories/${slug}/products`, {}, isReady);
}

/**
 * Hook cho danh sách sản phẩm với các filter
 */
export function useProducts(filters = {}) {
  const [currentFilters, setCurrentFilters] = useState(filters);
  const { data, loading, error, refresh } = useAPI('/products', { params: currentFilters });

  const updateFilters = (newFilters) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
    // Khi thay đổi filter, reset về trang 1
    if (newFilters.page === undefined) {
      setCurrentFilters(prev => ({ ...prev, page: 1 }));
    }
  };

  useEffect(() => {
    refresh();
  }, [currentFilters]);

  return { data, loading, error, filters: currentFilters, updateFilters };
}

/**
 * Hook cho chi tiết sản phẩm
 */
export function useProductDetail(slug) {
  const [isReady, setIsReady] = useState(Boolean(slug));
  
  useEffect(() => {
    setIsReady(Boolean(slug));
  }, [slug]);

  return useAPI(`/products/${slug}`, {}, isReady);
}

/**
 * Hook cho sản phẩm nổi bật
 */
export function useFeaturedProducts() {
  return useAPI('/products/featured');
}

/**
 * Hook cho tìm kiếm sản phẩm
 */
export function useProductSearch(query = '') {
  const [searchTerm, setSearchTerm] = useState(query);
  const [debouncedTerm, setDebouncedTerm] = useState(query);
  const [isReady, setIsReady] = useState(Boolean(query));

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // 500ms debounce time

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update isReady based on debounced term
  useEffect(() => {
    setIsReady(Boolean(debouncedTerm));
  }, [debouncedTerm]);

  const { data, loading, error } = useAPI(
    '/products/search',
    { params: { q: debouncedTerm } },
    isReady
  );

  return {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  };
}