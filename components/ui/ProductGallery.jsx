"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductGallery = ({
  images = [],
  autoplayDelay = 3000, // 3 giây mặc định
  autoplay = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayTimerRef = useRef(null);
  
  // Đảm bảo luôn có ít nhất một hình ảnh
  const allImages = images.length > 0 ? images : ["/placeholder-image.jpg"];
  
  // Số thumbnails hiển thị cố định là 3 (ô thứ 4 dành cho +n)
  const visibleThumbnailCount = 3;
  
  // Tính số lượng hình ảnh còn lại nếu hơn 4 ảnh
  const remainingCount = allImages.length > 4 ? allImages.length - 3 : 0;
  
  // Hình ảnh cho thumbnails - chỉ hiển thị tối đa 3 ảnh đầu tiên
  const thumbnailImages = allImages.slice(0, visibleThumbnailCount);

  // Xử lý autoplay
  useEffect(() => {
    if (autoplay && allImages.length > 1) {
      const startAutoplay = () => {
        autoplayTimerRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
        }, autoplayDelay);
      };
      
      startAutoplay();
      
      // Dừng autoplay khi unmount
      return () => {
        if (autoplayTimerRef.current) {
          clearInterval(autoplayTimerRef.current);
        }
      };
    }
  }, [autoplay, autoplayDelay, allImages.length]);
  
  // Dừng autoplay khi hover
  const pauseAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };
  
  // Tiếp tục autoplay khi không hover
  const resumeAutoplay = () => {
    if (autoplay && allImages.length > 1) {
      pauseAutoplay(); // Đảm bảo không có interval trùng lặp
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
      }, autoplayDelay);
    }
  };

  // Di chuyển đến hình ảnh tiếp theo
  const nextSlide = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền
    pauseAutoplay();
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    resumeAutoplay();
  };

  // Di chuyển đến hình ảnh trước đó
  const prevSlide = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền
    pauseAutoplay();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    resumeAutoplay();
  };

  // Hiển thị một hình ảnh cụ thể
  const showSlide = (index) => {
    pauseAutoplay();
    setCurrentIndex(index);
    resumeAutoplay();
  };

  // Hiển thị hình ảnh còn lại khi click vào "+n"
  const showRemainingImages = () => {
    // Hiển thị hình kế tiếp sau 3 hình đầu
    showSlide(3);
  };

  return (
    <div 
      className={`space-y-3 ${className}`}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Main Image */}
      <div className="relative h-[350px] lg:h-[544px] rounded-lg overflow-hidden border-[12px] border-white bg-white shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        {/* Nút điều hướng trái phải */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 z-20 shadow-md transition-all"
          onClick={prevSlide}
          aria-label="Previous image"
          type="button"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 z-20 shadow-md transition-all"
          onClick={nextSlide}
          aria-label="Next image"
          type="button"
        >
          <ChevronRight size={24} />
        </button>

        {/* Hiển thị ảnh chính */}
        <div className="w-full h-full relative">
          {allImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={img}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === currentIndex}
              />
            </div>
          ))}
        </div>
        
        {/* Chỉ số hình ảnh hiện tại */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
          {currentIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails cố định 4 ô */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {/* 3 thumbnails đầu tiên */}
          {thumbnailImages.map((img, index) => (
            <div
              key={index}
              className={`
                relative h-20 rounded-md overflow-hidden cursor-pointer
                border-[4px] border-white bg-white shadow-md
                ${index === currentIndex 
                  ? "ring-2 ring-primary ring-offset-1" 
                  : "opacity-80 hover:opacity-100"
                }
                transition-all
              `}
              onClick={() => showSlide(index)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}

          {/* Ô thứ 4 hiển thị "+n" nếu có nhiều hình */}
          {remainingCount > 0 && (
            <div
              className="relative h-20 rounded-md overflow-hidden cursor-pointer border-[4px] border-white bg-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-md transition-all"
              onClick={showRemainingImages}
            >
              <span className="text-lg font-medium text-gray-700">+{remainingCount}</span>
            </div>
          )}
          
          {/* Nếu chỉ có 4 ảnh, hiển thị thumbnail thứ 4 */}
          {allImages.length === 4 && (
            <div
              className={`
                relative h-20 rounded-md overflow-hidden cursor-pointer
                border-[4px] border-white bg-white shadow-md
                ${3 === currentIndex 
                  ? "ring-2 ring-primary ring-offset-1" 
                  : "opacity-80 hover:opacity-100"
                }
                transition-all
              `}
              onClick={() => showSlide(3)}
            >
              <Image
                src={allImages[3]}
                alt={`Thumbnail 4`}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;