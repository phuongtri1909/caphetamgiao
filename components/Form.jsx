"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { User, PhoneIcon, ArrowRightIcon, MessageSquare } from "lucide-react";
import { toast } from 'react-hot-toast';
import { submitContactForm } from "@/services/contactService";

const Form = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    note: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ""
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Vui lòng nhập họ tên";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!formData.note.trim()) {
      newErrors.note = "Vui lòng nhập nội dung yêu cầu";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await submitContactForm(formData);
      
      // Reset form after successful submission
      setFormData({
        full_name: "",
        phone: "",
        note: ""
      });
      
      // Show success message
      toast.success(response.message || "Gửi thông tin liên hệ thành công!");
      
    } catch (error) {
      // Show error message
      toast.error(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
      {/* Input full_name */}
      <div className="relative flex flex-col">
        <div className="relative flex items-center">
          <Input 
            type="text" 
            id="full_name" 
            placeholder="Họ và Tên" 
            value={formData.full_name}
            onChange={handleChange}
            className={errors.full_name ? "border-red-300 pr-10" : "pr-10"}
          />
          <User className="absolute right-6" size={20} />
        </div>
        {errors.full_name && (
          <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
        )}
      </div>
      
      {/* Input phone */}
      <div className="relative flex flex-col">
        <div className="relative flex items-center">
          <Input 
            type="tel" 
            id="phone" 
            placeholder="Số điện thoại/Zalo" 
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "border-red-300 pr-10" : "pr-10"}
          />
          <PhoneIcon className="absolute right-6" size={20} />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>
      
      {/* Textarea note */}
      <div className="relative flex flex-col">
        <div className="relative">
          <Textarea 
            id="note" 
            placeholder="Yêu cầu hợp tác hoặc mua hàng..." 
            value={formData.note}
            onChange={handleChange}
            className={errors.note ? "border-red-300 pr-10" : "pr-10"}
          />
          <MessageSquare className="absolute top-4 right-6" size={20} />
        </div>
        {errors.note && (
          <p className="text-red-500 text-xs mt-1">{errors.note}</p>
        )}
      </div>
      
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-x-1 max-w-[166px]"
      >
        {isSubmitting ? (
          <>
            <span className="animate-pulse">Đang gửi...</span>
          </>
        ) : (
          <>
            Liên Hệ Ngay!
            <ArrowRightIcon size={20} />
          </>
        )}
      </Button>
    </form>
  );
};

export default Form;