"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import axios from "axios";
import { getAllProvinces, getDistrictsByProvince, getWardsByDistrict } from "@/services/provinces";
import { submitOrder, calculateShippingFee } from '@/services/orderService';
import { toast } from 'react-hot-toast'; // Giả sử bạn đang sử dụng react-hot-toast để hiển thị thông báo
import { set } from "react-hook-form";

const OrderModal = ({
  isOpen,
  onClose,
  product,
  selectedWeightData,
  quantity,
  setQuantity,
  formatPrice,
}) => {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    provinces_code: "",
    districts_code: "",
    wards_code: "",
    address: "",
    note: "",
  });

  // State for location data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // State for shipping calculation
  const [shippingFee, setShippingFee] = useState(35000);
  const [shipping_verification, setShipping_verification] = useState(false);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm state quản lý thông báo
  const [orderMessage, setOrderMessage] = useState({
    show: false,
    type: '', // 'success' hoặc 'error'
    message: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Handle province change
  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setFormData({
      ...formData,
      provinces_code: provinceId,
      districts_code: "",
      wards_code: "",
    });
    
    // Fetch districts based on provinceId
    if (provinceId) {
      fetchDistricts(provinceId);
    } else {
      setDistricts([]);
    }
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData({
      ...formData,
      districts_code: districtId,
      wards_code: "",
    });
    
    // Fetch wards based on districtId
    if (districtId) {
      fetchWards(districtId);
    } else {
      setWards([]);
    }
  };

  // Hàm fetch districts - sửa đổi
  const fetchDistricts = async (provinceId) => {
    try {
      setDistricts([]); // Clear districts while loading
      const districtsData = await getDistrictsByProvince(provinceId);
      // Xử lý dữ liệu trả về theo cấu trúc của API của bạn
      setDistricts(districtsData.map(district => ({
        id: district.code,
        name: district.name
      })));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận huyện:", error);
      // Fallback
      setDistricts([
        { id: `${provinceId}-01`, name: "Quận 1" },
        { id: `${provinceId}-02`, name: "Quận 2" },
        { id: `${provinceId}-03`, name: "Quận 3" },
      ]);
    }
  };

  // Hàm fetch wards - sửa đổi
  const fetchWards = async (districtId) => {
    try {
      setWards([]); // Clear wards while loading
      const wardsData = await getWardsByDistrict(districtId);
      // Xử lý dữ liệu trả về theo cấu trúc của API của bạn
      setWards(wardsData.map(ward => ({
        id: ward.code,
        name: ward.name
      })));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường xã:", error);
      // Fallback
      setWards([
        { id: `${districtId}-01`, name: "Phường 1" },
        { id: `${districtId}-02`, name: "Phường 2" },
        { id: `${districtId}-03`, name: "Phường 3" },
      ]);
    }
  };

  // Calculate order summary
  const calculateSummary = () => {
    if (!selectedWeightData) return { subtotal: 0, shipping: 0, total: 0 };
    
    const subtotal = selectedWeightData.discounted_price * quantity;
    return {
      subtotal,
      shipping: shippingFee,
      total: subtotal + shippingFee,
    };
  };

  const summary = calculateSummary();

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName.trim()) errors.lastName = "Vui lòng nhập họ";
    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!formData.provinces_code) errors.provinces_code = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.districts_code) errors.districts_code = "Vui lòng chọn quận/huyện";
    if (!formData.wards_code) errors.wards_code = "Vui lòng chọn phường/xã";
    if (!formData.address.trim()) errors.address = "Vui lòng nhập địa chỉ";
    
    return errors;
  };

  // Form submission - bổ sung reset dữ liệu khi thành công
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Lấy thông tin tên tỉnh/thành, quận/huyện, phường/xã từ các danh sách đã có
    const selectedProvince = provinces.find(p => p.id === formData.provinces_code);
    const selectedDistrict = districts.find(d => d.id === formData.districts_code);
    const selectedWard = wards.find(w => w.id === formData.wards_code);
    
    // Tạo payload đầy đủ để gửi đi
    const orderPayload = {
      product_id: product?.id,
      product_weight_id: selectedWeightData?.id,
      quantity,
      shipping_fee: shippingFee,
      shipping_verification,
      total: summary.total,
      customer: {
        ...formData,
        // Bổ sung tên tỉnh/thành, quận/huyện, phường/xã
        province_name: selectedProvince?.name || '',
        district_name: selectedDistrict?.name || '',
        ward_name: selectedWard?.name || '',
      },
    };
    
    // Gửi đơn hàng sử dụng service
    const result = await submitOrder(orderPayload);
    
    if (result.success) {
      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        provinces_code: "",
        districts_code: "",
        wards_code: "",
        address: "",
        note: "",
      });
      
      // Reset errors
      setFormErrors({});
      
      // Reset các trường liên quan khác
      setDistricts([]);
      setWards([]);
      
      // Reset shipping fee về mặc định
      setShippingFee(35000);
      setShipping_verification(false);
      
      // Hiển thị thông báo thành công
      toast.success('Đặt hàng thành công!');
      showModalMessage('success', 'Đơn hàng của bạn đã được gửi thành công!');
      
      // Đóng modal sau 1.5 giây để người dùng kịp nhìn thấy thông báo thành công
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      // Xử lý các loại lỗi khác nhau
      if (result.validationError) {
        // Hiển thị chi tiết lỗi validation từ server
        const serverErrors = result.errors || {};
        
        // Áp dụng các lỗi từ server vào form errors để hiển thị chi tiết
        setFormErrors(prev => ({
          ...prev,
          ...serverErrors,
        }));
        
        // Hiển thị thông báo tổng quát
        toast.error('Vui lòng kiểm tra lỗi trong form');
        
        // Hiển thị từng lỗi cụ thể
        if (Object.keys(serverErrors).length > 0) {
          Object.values(serverErrors).forEach(errorMsg => {
            if (typeof errorMsg === 'string') {
              toast.error(errorMsg);
            } else if (Array.isArray(errorMsg) && errorMsg.length > 0) {
              toast.error(errorMsg[0]);
            }
          });
        }
        
        // Hiển thị thông báo trong modal nếu cần
        showModalMessage('error', 'Đơn hàng có các thông tin không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        // Lỗi server hoặc kết nối
        toast.error(result.message || 'Có lỗi xảy ra khi đặt hàng');
        showModalMessage('error', result.message || 'Có lỗi xảy ra khi đặt hàng');
      }
    }
  } catch (error) {
    console.error("Error submitting order:", error);
    toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    showModalMessage('error', 'Có lỗi xảy ra, vui lòng thử lại sau');
  } finally {
    setIsSubmitting(false);
  }
};

  // Hàm hiển thị thông báo trong modal (nếu bạn muốn hiển thị thông báo bên trong modal thay vì toast)
  const showModalMessage = (type, message) => {
    setOrderMessage({
      show: true,
      type,
      message
    });
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
      setOrderMessage(prev => ({...prev, show: false}));
    }, 5000);
  };

  // Fetch provinces when component mounts
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await getAllProvinces();
        // Xử lý dữ liệu trả về theo cấu trúc của API của bạn, điều chỉnh nếu cần
        setProvinces(provincesData.map(province => ({
          id: province.code,
          name: province.name
        })));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
        // Fallback to mock data
        setProvinces([
          { id: "01", name: "Hà Nội" },
          { id: "02", name: "Hồ Chí Minh" },
          { id: "03", name: "Đà Nẵng" },
        ]);
      }
    };
    
    fetchProvinces();
  }, []);

  // Calculate shipping fee when address changes
  useEffect(() => {
    const updateShippingFee = async () => {
      if (formData.provinces_code && formData.districts_code && formData.wards_code && selectedWeightData?.id && quantity) {
        setIsCalculatingShipping(true);
        
        try {
          // Sử dụng service để tính phí vận chuyển
          const response = await calculateShippingFee({
            provinces_code: formData.provinces_code,
            districts_code: formData.districts_code,
            wards_code: formData.wards_code,
            product_weight_id: selectedWeightData.id,
            quantity,
          });
        
          
          setShippingFee(response.shipping_fee);
          setShipping_verification(response.verification);
        } catch (error) {
          console.error('Lỗi khi tính phí vận chuyển:', error);
          // Fallback về giá trị mặc định
          setShippingFee(35000);
        } finally {
          setIsCalculatingShipping(false);
        }
      }
    };
    
    updateShippingFee();
  }, [formData.provinces_code, formData.districts_code, formData.wards_code, selectedWeightData, quantity]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      
      
      <div className="relative bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Product image as background inside modal */}
        {product?.image && (
          <div className="absolute inset-0 z-0 opacity-5">
            <Image
              src={product.image}
              alt=""
              fill
              className="object-cover"
              quality={20}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/90"></div>
          </div>
        )}
        
        {/* Close button (absolute positioned) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-1.5 text-gray-800 shadow-lg hover:bg-gray-100 transition-all"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>
        
        {/* Content with higher z-index to appear above the background */}
        <div className="overflow-y-auto max-h-[90vh] relative z-1">
          <div className="p-6 pt-10 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-semibold text-[#53382C]">
                Đặt hàng sản phẩm
              </h2>
              
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-[#53382C] border-b border-gray-200 pb-2">
                  Thông tin liên hệ
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all`}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all`}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-[#53382C] border-b border-gray-200 pb-2">
                  Địa chỉ nhận hàng
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="province"
                      name="provinces_code"  // Thay đổi từ "province" thành "provinces_code"
                      value={formData.provinces_code}
                      onChange={handleProvinceChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.provinces_code ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all appearance-none bg-white`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: `right 0.5rem center`,
                        backgroundRepeat: `no-repeat`,
                        backgroundSize: `1.5em 1.5em`,
                        paddingRight: `2.5rem`
                      }}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {provinces.map(province => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.provinces_code && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.provinces_code}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="district"
                      name="districts_code"  // Thay đổi từ "district" thành "districts_code"
                      value={formData.districts_code}
                      onChange={handleDistrictChange}
                      required
                      disabled={!formData.provinces_code}
                      className={`w-full px-3 py-2 border ${formErrors.districts_code ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all appearance-none bg-white ${!formData.provinces_code ? 'opacity-60 cursor-not-allowed' : ''}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: `right 0.5rem center`,
                        backgroundRepeat: `no-repeat`,
                        backgroundSize: `1.5em 1.5em`,
                        paddingRight: `2.5rem`
                      }}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.districts_code && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.districts_code}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="ward"
                      name="wards_code"  // Thay đổi từ "ward" thành "wards_code"
                      value={formData.wards_code}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.districts_code}
                      className={`w-full px-3 py-2 border ${formErrors.wards_code ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all appearance-none bg-white ${!formData.districts_code ? 'opacity-60 cursor-not-allowed' : ''}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: `right 0.5rem center`,
                        backgroundRepeat: `no-repeat`,
                        backgroundSize: `1.5em 1.5em`,
                        paddingRight: `2.5rem`
                      }}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map(ward => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.wards_code && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.wards_code}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Số nhà, tên đường <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C] transition-all`}
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú (nếu có)
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C]"
                      placeholder="Ghi chú thêm về đơn hàng..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
            
            {/* Right side - Order summary */}
            <div className="bg-[#53382C]/5 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-[#53382C] border-b border-gray-200 pb-3 mb-4">
                Thông tin đơn hàng
              </h3>
              
              {product && (
                <div className="flex gap-4 bg-white p-3 rounded-lg shadow-sm">
                  {/* Product image */}
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-grow">
                    <h4 className="font-medium text-[#53382C]">{product.name}</h4>
                    {selectedWeightData && (
                      <p className="text-sm text-gray-600">
                        Trọng lượng: {selectedWeightData.weight}
                      </p>
                    )}
                    {selectedWeightData && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#53382C] font-medium">
                          {formatPrice(selectedWeightData.discounted_price)} đ
                        </p>
                        <p className="text-xs text-gray-500 line-through">
                          {formatPrice(selectedWeightData.original_price)} đ
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Quantity selector */}
              <div className="mt-6 bg-white p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <label className="font-medium text-[#53382C]">Số lượng:</label>
                  <div className="flex items-center border border-gray-300 rounded-md h-8">
                    <button
                      type="button"
                      className="w-8 flex items-center justify-center text-[#53382C] hover:bg-gray-100 transition-colors h-full rounded-l-md"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-medium text-[#53382C] border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="w-8 flex items-center justify-center text-[#53382C] hover:bg-gray-100 transition-colors h-full rounded-r-md"
                      onClick={() => setQuantity(prev => prev + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Cost summary */}
              <div className="mt-6 space-y-3 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(summary.subtotal)} đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {isCalculatingShipping ? (
                      <span className="text-gray-500 italic">Đang tính...</span>
                    ) : (
                      `${formatPrice(summary.shipping)} đ`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-[#53382C] pt-3 border-t border-gray-200 text-lg">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(summary.total)} đ</span>
                </div>
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full mt-6 px-5 py-3 bg-[#53382C] text-white rounded-md inline-flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3d291e]'} transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận đặt hàng"
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Bằng cách nhấn "Xác nhận đặt hàng", bạn đồng ý với các <a href="#" className="text-[#53382C] underline">điều khoản và điều kiện</a> của chúng tôi
              </p>

              {/* Thêm phần hiển thị thông báo (nếu bạn muốn hiển thị thông báo trong modal) */}
              {orderMessage.show && (
                <div className={`mt-4 p-3 rounded-md ${
                  orderMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {orderMessage.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;