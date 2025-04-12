"use client";
import React from "react";
import { Star, StarHalf } from "lucide-react";

const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = "default", // "small", "default", "large"
  showScore = true,
  color = "primary",
  className = "",
  readOnly = true,
  onChange,
}) => {
  // Xác định kích thước sao
  const starSizes = {
    small: 14,
    default: 18,
    large: 24,
  };
  
  // Xác định màu sắc
  const colors = {
    primary: "text-primary",
    amber: "text-amber-400",
    yellow: "text-yellow-400",
    gold: "text-amber-500",
    gray: "text-gray-400",
  };

  // Chuyển đổi color prop sang className
  const colorClass = colors[color] || colors.primary;
  
  // Kích thước sao
  const starSize = starSizes[size] || starSizes.default;
  
  // Xử lý khi click vào sao (nếu không readOnly)
  const handleStarClick = (selectedRating) => {
    if (!readOnly && onChange) {
      onChange(selectedRating);
    }
  };

  // Tạo mảng hiển thị sao dựa trên rating
  const renderStars = () => {
    const stars = [];
    
    // Số sao đầy
    const fullStars = Math.floor(rating);
    
    // Phần thập phân để xác định có nửa sao không
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Số sao trống
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
    
    // Thêm sao đầy
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={starSize}
          className={`${colorClass} fill-current`}
          onClick={() => handleStarClick(i + 1)}
        />
      );
    }
    
    // Thêm nửa sao nếu có
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          size={starSize}
          className={`${colorClass} fill-current`}
          onClick={() => handleStarClick(fullStars + 0.5)}
        />
      );
    }
    
    // Thêm sao trống
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={starSize}
          className={`text-gray-300`}
          onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">{renderStars()}</div>
      
      {showScore && (
        <span className="ml-1 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;