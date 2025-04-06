"use client";
import Link from "next/link";
import { Button } from "./ui/button";

// import swiper react components
import { Swiper, SwiperSlide } from "swiper/react";

// import swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

// components
import ProjectCard from "@/components/ProjectCard";

const projectData = [
  {
    image: "/work/3.png",
    category: "Robusta",
    name: "Robusta Đặc Sản Tâm Giao - Ô Liu",
    description:
      "Cà phê Robusta hảo hạng với hương vị đậm đà, rang ô liu đặc biệt.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/4.png",
    category: "Moka - Robusta - Culi",
    name: "Coffee For Tourists (Moka - Robusta - Culi)",
    description:
      "Sự kết hợp tinh tế giữa Moka, Robusta và Culi, dành cho người yêu cà phê đậm chất.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/2.png",
    category: "Arabica",
    name: "Arabica Truyền Thống - Ô Liu",
    description: "Cà phê Arabica với hương vị thanh thoát, hậu vị ngọt dịu.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/1.png",
    category: "Robusta - Culi - Arabica",
    name: "Tinh Hoa Đại Ngàn(Robusta-Culi-Arabica)",
    description:
      "Một sự hòa quyện hoàn hảo giữa Robusta mạnh mẽ, Culi béo ngậy và Arabica thanh lịch.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/3.png",
    category: "Robusta 80% - Arabica 20%",
    name: "Robusta 80% - Arabica 20% - Ô Liu",
    description:
      "Tỷ lệ pha trộn hoàn hảo giữa Robusta đậm đà và Arabica thanh nhẹ, phù hợp với mọi gu thưởng thức.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/4.png",
    category: "Hòa Tan",
    name: "Cà Phê Hòa Tan Sấy Lạnh",
    description:
      "Cà phê hòa tan chất lượng cao, sấy lạnh giữ trọn hương vị nguyên bản.",
    link: "/",
    github: "/",
  },
];

const Work = () => {
  return (
    <section className="relative mb-12 xl:mb-48">
      <div className="container mx-auto">
        {/* text */}
        <div className="max-w-[400px] mx-auto xl:mx-0 text-center xl:text-left mb-12 xl:h-[400px] flex flex-col justify-center items-center xl:items-start">
          <h2 className="section-title mb-4">Sản Phẩm Mới</h2>
          <p className="subtitle mb-8">
            Sản phẩm mới, chất lượng vượt trội, đột phá trải nghiệm.
          </p>
          <Link href="/projects">
            <Button>Tất Cả Sản Phẩm</Button>
          </Link>
        </div>
        {/* slider */}
        <div className="xl:max-w-[1000px] xl:absolute right-0 top-0">
          <Swiper
            className="h-[480px]"
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
            }}
            spaceBetween={30}
            modules={[Pagination]}
            pagination={{ clickable: true }}
          >
            {/* show only the first 4  for the slides */}
            {projectData.slice(0, 6).map((project, index) => {
              return (
                <SwiperSlide key={index}>
                  <ProjectCard project={project} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Work;
