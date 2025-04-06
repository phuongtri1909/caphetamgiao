"use client";

import Image from "next/image";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import swiper react components
import { Swiper, SwiperSlide } from "swiper/react";

// import swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

const reviewsData = [
  {
    avatar: "/reviews/avatar-1.png",
    name: "Nguyễn Tuyết Giao",
    job: "Chủ quán cà phê",
    review:
      "Tâm Giao Coffee cung cấp nguồn nguyên liệu chất lượng cao, giúp tôi yên tâm phát triển quán mà không lo về chất lượng sản phẩm.",
  },
  {
    avatar: "/reviews/avatar-2.png",
    name: "Trần Thị Mai",
    job: "Nhà thiết kế nội thất",
    review:
      "Không gian của Tâm Giao Coffee mang lại cảm giác ấm cúng và gần gũi, rất phù hợp cho những buổi gặp gỡ hoặc làm việc.",
  },
  {
    avatar: "/reviews/avatar-3.png",
    name: "Trần Thanh Tâm",
    job: "Nhà sáng lập startup",
    review:
      "Tôi thường chọn Tâm Giao Coffee làm nơi gặp gỡ đối tác. Không gian thoải mái, cà phê ngon, dịch vụ chuyên nghiệp.",
  },
  {
    avatar: "/reviews/avatar-4.png",
    name: "Phạm Hồng Ánh",
    job: "Giảng viên đại học",
    review:
      "Cà phê đậm vị, thơm ngon, rất phù hợp với những người yêu thích hương vị nguyên bản như tôi.",
  },
  {
    avatar: "/reviews/avatar-5.png",
    name: "Đặng Quốc Huy",
    job: "Kỹ sư phần mềm",
    review:
      "Tâm Giao Coffee không chỉ có cà phê ngon mà còn có môi trường yên tĩnh, rất phù hợp để làm việc và sáng tạo.",
  },
  {
    avatar: "/reviews/avatar-6.png",
    name: "Bùi Thanh Trúc",
    job: "Biên tập viên",
    review:
      "Tôi yêu thích những buổi sáng tại Tâm Giao Coffee. Cà phê ngon, nhân viên thân thiện và không gian thoáng đãng.",
  },
];

const Reviews = () => {
  return (
    <section className="mb-12 xl:mb-32">
      <div className="container mx-auto">
        <h2 className="section-title mb-12 text-center mx-auto">Reviews</h2>
        {/* slider */}
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1400: { slidesPerView: 3 },
          }}
          spaceBetween={30}
          modules={[Pagination]}
          pagination={{
            clickable: true,
          }}
          className="h-[350px]"
        >
          {reviewsData.map((person, index) => {
            return (
              <SwiperSlide key={index}>
                <Card className="bg-tertiary dark:bg-secondary/40 p-8 min-h-[300px]">
                  <CardHeader className="p-0 mb-10">
                    <div className="flex items-center gap-x-4">
                      {/* image */}
                      <Image
                        src={person.avatar}
                        width={70}
                        height={70}
                        alt=""
                        priority
                      />
                      {/* name */}
                      <div className="flex flex-col">
                        <CardTitle>{person.name}</CardTitle>
                        <p>{person.job}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardDescription className="text-lg text-muted-foreground">
                    {person.review}
                  </CardDescription>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;
