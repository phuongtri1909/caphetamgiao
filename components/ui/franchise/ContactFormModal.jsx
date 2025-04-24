"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-hot-toast';
import { getAllProvinces, getDistrictsByProvince, getWardsByDistrict } from "@/services/provinces";
import { submitFranchiseContact } from "@/services/franchiseService";

const ContactFormModal = ({ 
  isOpen, 
  onClose, 
  franchiseName, // Tên gói nhượng quyền
  franchiseId,   // ID gói nhượng quyền để gửi lên server
  franchiseCode, // Mã gói nhượng quyền
}) => {
  // Form data state
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

  // Form state
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState({
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

  // Fetch districts
  const fetchDistricts = async (provinceId) => {
    try {
      setDistricts([]); // Clear districts while loading
      const districtsData = await getDistrictsByProvince(provinceId);
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

  // Fetch wards
  const fetchWards = async (districtId) => {
    try {
      setWards([]); // Clear wards while loading
      const wardsData = await getWardsByDistrict(districtId);
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

  // Form validation
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

  // Handle form submission
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
      
      // Construct payload
      const payload = {
        franchise_id: franchiseId,
        franchise_code: franchiseCode,
        ...formData,
        // Thêm tên địa chỉ
        province_name: selectedProvince?.name || '',
        district_name: selectedDistrict?.name || '',
        ward_name: selectedWard?.name || '',
      };
      
      // Call the API to submit the contact form
      const response = await submitFranchiseContact(payload);
      
      // Show success feedback
      showFeedback('success', response.message || 'Thông tin của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ trong thời gian sớm nhất!');
      
      // Reset form
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
      
      setDistricts([]);
      setWards([]);
      
      // Notify with toast
      toast.success('Gửi yêu cầu tư vấn thành công!');
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showFeedback('error', error.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
      toast.error('Gửi yêu cầu không thành công.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show feedback message
  const showFeedback = (type, message) => {
    setFormFeedback({
      show: true,
      type,
      message
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setFormFeedback(prev => ({...prev, show: false}));
    }, 5000);
  };

  // Fetch provinces when component mounts
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await getAllProvinces();
        // Xử lý dữ liệu trả về theo cấu trúc của API
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
    
    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

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
      <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
        {/* Close button (absolute positioned) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-1.5 text-gray-800 shadow-lg hover:bg-gray-100 transition-all"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>
        
        <div className="overflow-y-auto max-h-[90vh] relative z-1">
          <div className="p-6 pt-10 md:p-8">
            {/* Form header */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#53382C]">
                Đăng ký tư vấn {franchiseName}
              </h2>
              
              {/* Display feedback message */}
              {formFeedback.show && (
                <div className={`p-3 rounded-md ${
                  formFeedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {formFeedback.message}
                </div>
              )}
              
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
                  Thông tin địa điểm
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="province"
                      name="provinces_code"
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
                      name="districts_code"
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
                      name="wards_code"
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
                      Yêu cầu tư vấn (nếu có)
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#53382C]"
                      placeholder="Nhập yêu cầu hoặc câu hỏi của bạn về gói nhượng quyền..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Franchise code - hidden */}
              <input type="hidden" name="franchiseCode" value={franchiseCode || ''} />
              
              {/* Submit button */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#53382C] text-[#53382C] rounded-md hover:bg-[#53382C]/10 transition-colors"
                >
                  Hủy
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-[#53382C] text-white rounded-md inline-flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3d291e]'} transition-colors`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi yêu cầu tư vấn"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormModal;