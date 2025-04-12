import api from '../utils/api';

/**
 * Lấy danh sách tất cả các tỉnh thành
 * @returns {Promise<Array>} Danh sách tỉnh thành
 */
export const getAllProvinces = async () => {
  try {
    const response = await api.get('/provinces');
    
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

/**
 * Lấy danh sách quận huyện theo mã tỉnh thành
 * @param {string|number} provinceCode - Mã tỉnh thành
 * @returns {Promise<Array>} Danh sách quận huyện
 */
export const getDistrictsByProvince = async (provinceCode) => {
  try {
    const response = await api.get(`/provinces/${provinceCode}/districts`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error(`Error fetching districts for province ${provinceCode}:`, error);
    return [];
  }
};

/**
 * Lấy danh sách phường xã theo mã quận huyện
 * @param {string|number} districtCode - Mã quận huyện
 * @returns {Promise<Array>} Danh sách phường xã
 */
export const getWardsByDistrict = async (districtCode) => {
  try {
    const response = await api.get(`/provinces/${districtCode}/wards`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error(`Error fetching wards for district ${districtCode}:`, error);
    return [];
  }
};

/**
 * Hàm lấy thông tin địa chỉ đầy đủ dựa trên các mã đã chọn
 * @param {Object} params - Các tham số địa chỉ
 * @param {string|number} params.provinceCode - Mã tỉnh thành
 * @param {string|number} params.districtCode - Mã quận huyện
 * @param {string|number} params.wardCode - Mã phường xã
 * @returns {Promise<Object>} Thông tin địa chỉ đầy đủ
 */
export const getFullAddressInfo = async ({ provinceCode, districtCode, wardCode }) => {
  try {
    // Cache object để lưu trữ thông tin
    const addressInfo = {};
    
    // Lấy thông tin tỉnh thành
    if (provinceCode) {
      const provinces = await getAllProvinces();
      addressInfo.province = provinces.find(p => p.code.toString() === provinceCode.toString()) || null;
    }
    
    // Lấy thông tin quận huyện
    if (provinceCode && districtCode) {
      const districts = await getDistrictsByProvince(provinceCode);
      addressInfo.district = districts.find(d => d.code.toString() === districtCode.toString()) || null;
    }
    
    // Lấy thông tin phường xã
    if (districtCode && wardCode) {
      const wards = await getWardsByDistrict(districtCode);
      addressInfo.ward = wards.find(w => w.code.toString() === wardCode.toString()) || null;
    }
    
    return addressInfo;
  } catch (error) {
    console.error('Error getting full address info:', error);
    return {};
  }
};