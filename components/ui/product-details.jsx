"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Coffee,
  Thermometer,
} from "lucide-react";

const ProductDetails = ({ product, className = "" }) => {
  const [expanded, setExpanded] = useState(false);

  // Xác định chiều dài tối đa trước khi cắt nội dung
  const maxLength = 300;
  const isTextLong =
    product.description && product.description.length > maxLength;

  // Nội dung hiển thị (cắt ngắn nếu cần)
  const displayText =
    !expanded && isTextLong
      ? product.description.substring(0, maxLength) + "..."
      : product.description;

  return (
    <div className={`rounded-lg ${className}`}>
      <h2 className="text-xl font-semibold mb-6 text-center">
        THÔNG TIN CHI TIẾT
      </h2>

      <div className="space-y-8">
        {/* Phần thông tin chi tiết */}
        <div className="space-y-6">
          {/* Thông tin chung */}
          <div className="prose prose-sm max-w-none">
            <p
              className={`text-gray-700 ${
                !expanded && isTextLong ? "line-clamp-5" : ""
              }`}
            >
              {displayText}
            </p>
          </div>
        </div>

        {/* Nút xem thêm - di chuyển xuống cuối */}
        {isTextLong && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#53382C] font-medium flex items-center py-2 px-4 border border-[#53382C] rounded-md hover:bg-[#53382C]/5 transition-colors"
            >
              {expanded ? (
                <>
                  Thu gọn <ChevronUp size={16} className="ml-1" />
                </>
              ) : (
                <>
                  Xem thêm <ChevronDown size={16} className="ml-1" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
