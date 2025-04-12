import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getFullImageUrl(...path) {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  return `${baseUrl}${path}`;
}

export function truncateHTML(html, maxLength = 100, ellipsis = '...') {
  if (!html) return '';
  
  // Sử dụng phương pháp an toàn cho môi trường client và server
  let text = '';
  
  // Phương pháp cho client-side
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    text = div.textContent || div.innerText || '';
  } else {
    // Phương pháp đơn giản cho server-side (loại bỏ thẻ HTML cơ bản)
    text = html.replace(/<[^>]*>/g, '');
  }
  
  // Cắt chuỗi nếu cần và thêm dấu "..." vào cuối
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + ellipsis;
  }
  
  return text;
}

// Replace the existing formatVietnameseDate function with this improved version
export function formatVietnameseDate(dateString){
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Không có ngày";
    }
    
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Không có ngày";
  }
};