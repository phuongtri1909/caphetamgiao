import api from "../utils/api";

/**
 * Validate đơn hàng trước khi gửi
 * @param {Object} orderData - Dữ liệu đơn hàng cần validate
 * @returns {Object} - Kết quả validate {isValid, errors}
 */
export const validateOrder = (orderData) => {
  const errors = {};

  // Validate thông tin khách hàng
  const { customer, product_id, product_weight_id, quantity } = orderData;

  if (!product_id) errors.product_id = "Thiếu thông tin sản phẩm";
  if (!product_weight_id)
    errors.product_weight_id = "Thiếu thông tin trọng lượng sản phẩm";
  if (!quantity || quantity < 1) errors.quantity = "Số lượng không hợp lệ";

  if (!customer) {
    errors.customer = "Thiếu thông tin khách hàng";
    return { isValid: false, errors };
  }

  // Validate thông tin khách hàng chi tiết
  if (!customer.firstName?.trim()) errors.firstName = "Vui lòng nhập tên";
  if (!customer.lastName?.trim()) errors.lastName = "Vui lòng nhập họ";

  if (!customer.email?.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!customer.phone?.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^[0-9]{10,11}$/.test(customer.phone.replace(/\s/g, ""))) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  // Validate địa chỉ giao hàng
  if (!customer.provinces_code)
    errors.provinces_code = "Vui lòng chọn tỉnh/thành phố";
  if (!customer.districts_code)
    errors.districts_code = "Vui lòng chọn quận/huyện";
  if (!customer.wards_code) errors.wards_code = "Vui lòng chọn phường/xã";
  if (!customer.address?.trim()) errors.address = "Vui lòng nhập địa chỉ";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Gửi đơn hàng đến server
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @returns {Promise<Object>} - Kết quả từ API
 */
export const submitOrder = async (orderData) => {
  try {
    // Validate dữ liệu trước khi gửi đến server
    const validationResult = validateOrder(orderData);
    if (!validationResult.isValid) {
      return {
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: validationResult.errors,
        validationError: true,
      };
    }

    // Gửi đơn hàng đến server
    const response = await api.post("/orders", orderData);

    return {
      success: true,
      message: "Đặt hàng thành công",
      data: response.data,
    };
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);

    // Xử lý các lỗi từ API
    if (error.response) {
      // Lỗi từ server (4xx, 5xx)
      const { data, status } = error.response;

      if (status === 422) {
        // Lỗi validation từ server
        return {
          success: false,
          message: data.message || "Dữ liệu không hợp lệ",
          errors: data.errors || {},
          validationError: true,
        };
      }

      return {
        success: false,
        message: data.message || "Có lỗi xảy ra khi đặt hàng",
        serverError: true,
      };
    }

    // Lỗi kết nối hoặc lỗi không xác định
    return {
      success: false,
      message: "Không thể kết nối đến máy chủ",
      connectionError: true,
    };
  }
};

/**
 * Tính phí vận chuyển dựa trên địa chỉ
 * @param {Object} addressData - Thông tin địa chỉ
 * @returns {Promise<number>} - Phí vận chuyển
 */
export const calculateShippingFee = async (addressData) => {
  try {
    const {
      provinces_code,
      districts_code,
      wards_code,
      product_weight_id,
      quantity,
    } = addressData;

    if (
      !provinces_code ||
      !districts_code ||
      !wards_code ||
      !product_weight_id ||
      !quantity
    ) {
      return 35000; // Phí vận chuyển mặc định
    }

    // Gọi API tính phí vận chuyển
    const response = await api.post("/shipping/calculate", {
      provinces_code: provinces_code,
      districts_code: districts_code,
      wards_code: wards_code,
      product_weight_id: product_weight_id,
      quantity: quantity,
    });
    return response.data.success ? response.data : 35000;
  } catch (error) {
    console.error("Lỗi khi tính phí vận chuyển:", error);
    return 35000; // Trả về phí vận chuyển mặc định nếu có lỗi
  }
};
