"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast

const ContactFormModal = ({ 
  isOpen, 
  onClose, 
  franchiseName, // Tên gói nhượng quyền
  franchiseId,   // ID gói nhượng quyền để gửi lên server
}) => {
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    message: "",
  });

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

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Vui lòng nhập họ tên";
    
    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    
    if (!formData.location.trim()) errors.location = "Vui lòng nhập địa điểm dự kiến";
    
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
      // Construct payload
      const payload = {
        franchise_id: franchiseId,
        ...formData
      };
      
      // Here you would make an API call to submit the contact request
      // For example:
      // const response = await submitFranchiseContact(payload);
      
      // For now, simulate a successful submission after 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success feedback
      showFeedback('success', 'Thông tin của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ trong thời gian sớm nhất!');
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        location: "",
        message: "",
      });
      
      // Notify with toast
      toast.success('Gửi yêu cầu tư vấn thành công!');
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showFeedback('error', 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
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
      <div className="relative bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-auto shadow-2xl">
        {/* Close button (absolute positioned) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-1.5 text-gray-800 shadow-lg hover:bg-gray-100 transition-all"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="p-6 pb-2 text-center border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#53382C]">
            Đăng ký tư vấn {franchiseName}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vui lòng điền thông tin để chúng tôi có thể liên hệ và tư vấn về gói nhượng quyền
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Feedback message */}
          {formFeedback.show && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              formFeedback.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {formFeedback.message}
            </div>
          )}
          
          {/* Name field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'border-red-300 focus-visible:ring-red-500' : ''}
              required
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
            )}
          </div>
          
          {/* Phone field */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0912345678"
              value={formData.phone}
              onChange={handleInputChange}
              className={formErrors.phone ? 'border-red-300 focus-visible:ring-red-500' : ''}
              required
            />
            {formErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
            )}
          </div>
          
          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? 'border-red-300 focus-visible:ring-red-500' : ''}
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
            )}
          </div>
          
          {/* Location field */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Địa điểm dự kiến mở cửa hàng <span className="text-red-500">*</span>
            </label>
            <Input
              id="location"
              name="location"
              placeholder="Quận/Huyện, Tỉnh/Thành phố"
              value={formData.location}
              onChange={handleInputChange}
              className={formErrors.location ? 'border-red-300 focus-visible:ring-red-500' : ''}
              required
            />
            {formErrors.location && (
              <p className="mt-1 text-xs text-red-500">{formErrors.location}</p>
            )}
          </div>
          
          {/* Message field */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Yêu cầu tư vấn
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Nhập yêu cầu hoặc câu hỏi của bạn về gói nhượng quyền này..."
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#53382C] text-[#53382C] hover:bg-[#53382C]/10"
            >
              Hủy
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#53382C] hover:bg-[#3d291e] text-white"
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
                "Gửi yêu cầu"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;