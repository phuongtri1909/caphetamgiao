"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/ProjectCard";

const projectData = [
  {
    image: "/work/3.png",
    category: "Cá Nhân",
    name: "Mô hình tiêu chuẩn",
    description:
      "Quy trình bài bản, nguồn nguyên liệu chất lượng, hỗ trợ setup và vận hành hiệu quả.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/4.png",
    category: "Doanh Nghiệp",
    name: "Mô hình kiosk",
    description:
      "Thiết kế nhỏ gọn, tối ưu chi phí đầu tư, phù hợp với vị trí có lưu lượng khách cao.",
    link: "/",
    github: "/",
  },
  {
    image: "/work/2.png",
    category: "Ngân Sách Lớn",
    name: "Mô hình không gian",
    description:
      "Kết hợp quán cà phê với sách, coworking space hoặc các mô hình sáng tạo khác.",
    link: "/",
    github: "/",
  },
];

// remove category duplicates
const uniqueCategories = [
  "all projects",
  ...new Set(projectData.map((item) => item.category)),
];

const Projects = () => {
  const [categories, setCategories] = useState(uniqueCategories);
  const [category, setCategory] = useState("all projects");

  const filteredProjects = projectData.filter((project) => {
    // if category is 'all projects' return all projects, else filter by category
    return category === "all projects"
      ? project
      : project.category === category;
  });

  return (
    <section className="min-h-screen pt-12">
      <div className="container mx-auto">
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
          Nhượng Quyền
        </h2>
        {/* tabs */}
        <Tabs defaultValue={category} className="mb-24 xl:mb-48">
          <TabsList className="w-full grid h-full md:grid-cols-4 lg:max-w-[640px] mb-12 mx-auto md:border dark:border-none">
            {categories.map((category, index) => {
              return (
                <TabsTrigger
                  onClick={() => setCategory(category)}
                  value={category}
                  key={index}
                  className="capitalize w-[162px] md:w-auto"
                >
                  {category}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {/* tabs content */}
          <div className="text-lg xl:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => {
              return (
                <TabsContent value={category} key={index}>
                  <ProjectCard project={project} />
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
