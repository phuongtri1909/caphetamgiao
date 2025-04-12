"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, ChevronDown } from "lucide-react";
import StarRating from "./star-rating";
import { formatVietnameseDate } from "@/lib/utils";

const ProductReviews = ({ reviews, averageRating = 0, className = "" }) => {
  const [activeFilter, setActiveFilter] = useState(0); // 0 = All reviews
  const [visibleCount, setVisibleCount] = useState(3); // Số lượng review hiển thị ban đầu

  // Tính phần trăm đánh giá cho từng mức sao
  const calculateRatingPercents = () => {
    if (!reviews || reviews.length === 0) return Array(5).fill(0);

    const counts = Array(5).fill(0);
    reviews.forEach((review) => {
      const ratingIndex = Math.floor(review.rating) - 1;
      if (ratingIndex >= 0 && ratingIndex < 5) {
        counts[ratingIndex]++;
      }
    });

    return counts.map((count) => Math.round((count / reviews.length) * 100));
  };

  const ratingPercents = calculateRatingPercents();

  // Lọc reviews theo số sao nếu có filter
  const filteredReviews =
    activeFilter === 0
      ? reviews
      : reviews.filter((review) => Math.ceil(review.rating) === activeFilter);

  // Xác định danh sách hiển thị với giới hạn
  const visibleReviews = filteredReviews?.slice(0, visibleCount);

  // Hàm load thêm bình luận
  const loadMoreReviews = () => {
    // Mỗi lần hiển thị thêm 5 bình luận
    setVisibleCount((prevCount) => prevCount + 5);
  };

  // Reset visibleCount khi thay đổi filter
  useEffect(() => {
    setVisibleCount(3);
  }, [activeFilter]);

  return (
    <div className={`rounded-lg ${className}`}>
      <h2 className="text-xl md:text-2xl font-semibold text-[#53382C] mb-6">
        ĐÁNH GIÁ TỪ KHÁCH HÀNG
      </h2>

      {/* Phần tổng hợp đánh giá */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 bg-[#53382C]/5 p-6 rounded-lg">
        {/* Cột điểm đánh giá trung bình */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-[#53382C] mb-2">
            {averageRating.toFixed(1)}
          </div>
          <StarRating
            rating={averageRating}
            color="amber"
            size="large"
            showScore={false}
          />
          <p className="text-gray-600 mt-2">{reviews?.length || 0} đánh giá</p>
        </div>

        {/* Cột phân bố đánh giá */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <button
                className={`text-sm w-12 ${
                  activeFilter === stars
                    ? "font-medium text-[#53382C]"
                    : "text-gray-600"
                }`}
                onClick={() =>
                  setActiveFilter(activeFilter === stars ? 0 : stars)
                }
              >
                {stars} sao
              </button>
              <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${ratingPercents[stars - 1]}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-10">
                {ratingPercents[stars - 1]}%
              </span>
            </div>
          ))}

          {activeFilter !== 0 && (
            <button
              className="text-[#53382C] text-sm mt-2 hover:underline"
              onClick={() => setActiveFilter(0)}
            >
              Xem tất cả đánh giá
            </button>
          )}
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-6">
        {visibleReviews && visibleReviews.length > 0 ? (
          <>
            {visibleReviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  {review.avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={review.avatar}
                        alt={review.userName}
                        width={40}
                        height={40}
                        className="object-cover"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-[#53382C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-[#53382C]" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-[#53382C]">
                      {review.userName}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <StarRating
                        rating={review.rating}
                        color="amber"
                        size="small"
                        showScore={false}
                      />
                      <span className="ml-2">
                        {formatVietnameseDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-[52px]">
                  {review.verified && (
                    <div className="text-green-600 text-xs font-medium mb-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 mr-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Đã mua hàng
                    </div>
                  )}

                  <p className="text-gray-700">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative h-16 w-16 rounded-md overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt={`Review image ${imgIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Nút Xem thêm */}
            {filteredReviews.length > visibleCount && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreReviews}
                  className="flex items-center gap-2 px-5 py-2 border border-[#53382C] text-[#53382C] rounded-md hover:bg-[#53382C]/5 transition-colors"
                >
                  <span>Xem thêm đánh giá</span>
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {filteredReviews.length === 0
              ? "Chưa có đánh giá nào cho sản phẩm này"
              : "Không tìm thấy đánh giá phù hợp với bộ lọc"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
