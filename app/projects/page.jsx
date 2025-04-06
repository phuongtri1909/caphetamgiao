"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/ProjectCard";

const projectData = [
  {
    image: "/work/3.png",
    category: "Robusta",
    name: "Robusta Đặc Sản Tâm Giao - Ô Liu",
    description:
      "Hương vị đậm đà, rang ô liu độc đáo, dành cho người yêu cà phê nguyên bản.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/4.png",
    category: "Moka - Robusta - Culi",
    name: "Coffee For Tourists - Mộc",
    description:
      "Sự kết hợp tinh tế giữa Moka, Robusta và Culi, mang đến trải nghiệm khó quên.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/2.png",
    category: "Arabica",
    name: "Arabica Truyền Thống - Ô Liu",
    description:
      "Cà phê Arabica với hậu vị thanh thoát, thích hợp cho người yêu cà phê nhẹ nhàng.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/1.png",
    category: "Robusta - Culi - Arabica",
    name: "Tinh Hoa Đại Ngàn - Mộc",
    description:
      "Một sự hòa quyện hoàn hảo giữa Robusta mạnh mẽ, Culi béo ngậy và Arabica thanh lịch.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/3.png",
    category: "Robusta 80% - Arabica 20%",
    name: "Cà Phê Quốc Dân - Ô Liu",
    description:
      "Sự cân bằng giữa Robusta đậm đà và Arabica dịu nhẹ, phù hợp với mọi gu thưởng thức.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/4.png",
    category: "Hòa Tan",
    name: "Cà Phê Hòa Tan Sấy Lạnh",
    description:
      "Cà phê hòa tan tiện lợi, giữ trọn hương vị nguyên bản nhờ công nghệ sấy lạnh hiện đại.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/1.png",
    category: "Robusta",
    name: "Robusta Truyền Thống - Mộc",
    description:
      "Hương vị truyền thống với độ đậm đà đặc trưng, dành cho những ai yêu thích vị mạnh của Robusta.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/3.png",
    category: "Arabica",
    name: "Arabica Truyền Thống - Mộc",
    description:
      "Cà phê Arabica nguyên bản với hương vị nhẹ nhàng, hậu vị thanh ngọt.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/2.png",
    category: "Robusta - Culi - Arabica",
    name: "Tinh Hoa Đại Ngàn - Ô Liu",
    description:
      "Một sự hòa quyện tinh tế của ba loại cà phê, mang đến hương vị phong phú và đậm đà.",
    link: "/",
    github: "/",
  },
];

// Lọc danh mục duy nhất ngay khi lấy dữ liệu
const uniqueCategories = [
  "all projects",
  ...Array.from(new Set(projectData.map((item) => item.category.trim()))),
];

const Projects = () => {
  const [category, setCategory] = useState("all projects");

  // Lọc project theo category đã chọn
  const filteredProjects =
    category === "all projects"
      ? projectData
      : projectData.filter((project) => project.category.trim() === category);

  return (
    <section className="min-h-screen pt-12">
      <div className="container mx-auto">
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
          Sản Phẩm
        </h2>
        {/* Tabs */}
        <Tabs defaultValue={category} className="mb-24 xl:mb-48">
          {/* Danh mục trượt ngang trên mobile */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-4 mb-12 mx-auto md:border dark:border-none px-4">
              {uniqueCategories.map((cat, index) => (
                <TabsTrigger
                  key={index}
                  value={cat}
                  onClick={() => setCategory(cat)}
                  className="capitalize px-4 py-2 md:w-auto whitespace-nowrap"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {/* Tabs Content */}
          <div className="text-lg xl:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <TabsContent key={index} value={category}>
                <ProjectCard project={project} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
