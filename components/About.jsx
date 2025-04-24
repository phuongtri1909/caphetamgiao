"use client";
import { useState, useEffect, useRef } from "react";
import DevImg from "./DevImg";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategories } from "@/services/categoryService";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  User2,
  MailIcon,
  HomeIcon,
  PhoneCall,
  GraduationCap,
  Calendar,
  Briefcase,
} from "lucide-react";

const infoData = [
  {
    icon: <User2 size={20} />,
    text: "Lê Hoài Thanh",
  },
  {
    icon: <PhoneCall size={20} />,
    text: "0909900706 ",
  },
  {
    icon: <MailIcon size={20} />,
    text: "hoaithanh953@gmail.com",
  },
  {
    icon: <Calendar size={20} />,
    text: "Thành Lập 2024-08-05",
  },
  {
    icon: <GraduationCap size={20} />,
    text: "Tâm Giao Coffee",
  },
  {
    icon: <HomeIcon size={20} />,
    text: "Tỉnh Đắk Lắk, Việt Nam",
  },
];

const qualificationData = [
  {
    title: "education",
    data: [
      {
        university: "Trường Đại học Kinh tế",
        qualification: "Cử nhân Quản trị Kinh doanh",
        years: "2012 - 2016",
      },
      {
        university: "Học viện Logistics & Vận tải",
        qualification: "Chuyên sâu về Quản lý Vận tải",
        years: "2017 - 2019",
      },
      {
        university: "Học viện Cà phê & Chế biến",
        qualification: "Nghiên cứu & Phát triển Sản phẩm Cà phê",
        years: "2020 - 2022",
      },
    ],
  },
  {
    title: "experience",
    data: [
      {
        company: "Doanh nghiệp vận tải tư nhân",
        role: "Nhà sáng lập & điều hành",
        years: "2021 - 2023",
      },
      {
        company: "Chuyển hướng sang ngành cà phê",
        role: "Nghiên cứu & phát triển thị trường",
        years: "2023 - 2024",
      },
      {
        company: "Tâm Giao Coffee",
        role: "Nhà sáng lập & điều hành",
        years: "2024 - Nay",
      },
    ],
  },
];

const skillData = [
  {
    title: "skills",
    data: [
      { name: "Rang xay cà phê chất lượng" },
      { name: "Phát triển nhượng quyền bền vững" },
      { name: "Đào tạo & hỗ trợ đối tác" },
      { name: "Nâng cao trải nghiệm khách hàng" },
    ],
  },
  {
    title: "tools",
    data: [
      {
        imgPath: "/about/vscode.png",
      },
      {
        imgPath: "/about/notion.png",
      },
      {
        imgPath: "/about/figma.png",
      },

      {
        imgPath: "/about/wordpress.png",
      },
    ],
  },
];

const About = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  
  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching coffee categories:", error);
        // Fallback data in case of error
        setCategories([
          { name: "Robusta" },
          { name: "Arabica" },
          { name: "Culi" },
          { name: "Moka" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Function to handle scrolling the categories container
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getData = (arr, title) => {
    return arr.find((item) => item.title === title);
  };

  return (
    <section className="xl:h-[860px] pb-12 xl:py-24">
      <div className="container mx-auto">
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
          Giới Thiệu
        </h2>
        <div className="flex flex-col xl:flex-row">
          {/* image */}
          <div className="hidden xl:flex flex-1 relative">
            <DevImg
              containerStyles="bg-about_shape_light dark:bg-about_shape_dark w-[505px] h-[505px] bg-no-repeat relative"
              imgSrc="/about/developer.png"
            />
          </div>
          {/* tabs */}
          <div className="flex-1">
            <Tabs defaultValue="personal">
              <TabsList className="w-full grid xl:grid-cols-3 xl:max-w-[520px] xl:border dark:border-none">
                <TabsTrigger className="w-[162px] xl:w-auto" value="personal">
                  Giới Thiệu
                </TabsTrigger>
                <TabsTrigger
                  className="w-[162px] xl:w-auto"
                  value="qualifications"
                >
                  Hành Trình
                </TabsTrigger>
                <TabsTrigger className="w-[162px] xl:w-auto" value="skills">
                  Lợi Thế
                </TabsTrigger>
              </TabsList>
              {/* tabs content */}
              <div className="text-lg mt-12 xl:mt-8">
                {/* personal */}
                <TabsContent value="personal">
                  <div className="text-center xl:text-left">
                    <h3 className="h3 mb-4">
                      Chất lượng vượt trội suốt hành trình khởi nghiệp
                    </h3>
                    <p className="subtitle max-w-xl mx-auto xl:mx-0">
                      Tôi chuyên tâm mang đến những ly cà phê nguyên chất, đậm
                      đà, lan tỏa tinh thần Việt qua từng trải nghiệm thưởng
                      thức.
                    </p>
                    {/* icons */}
                    <div className="grid xl:grid-cols-2 gap-4 mb-12">
                      {infoData.map((item, index) => {
                        return (
                          <div
                            className="flex items-center gap-x-4 mx-auto xl:mx-0"
                            key={index}
                          >
                            <div className="text-primary">{item.icon}</div>
                            <div>{item.text}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* coffee categories */}
                    <div className="flex flex-col gap-y-2">
                      <div className="text-primary flex items-center justify-between">
                        <div>Loại Cà Phê</div>
                        {categories.length > 3 && (
                          <div className="flex items-center gap-x-2">
                            <button 
                              onClick={() => scroll('left')}
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              aria-label="Cuộn sang trái"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button 
                              onClick={() => scroll('right')}
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              aria-label="Cuộn sang phải"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="border-b border-border"></div>
                      <div 
                        className="flex gap-x-3 overflow-x-auto scrollbar-hide py-2" 
                        ref={scrollContainerRef}
                        style={{ scrollBehavior: 'smooth' }}
                      >
                        {loading ? (
                          <div className="text-gray-500 italic">Đang tải loại cà phê...</div>
                        ) : categories.length > 0 ? (
                          categories.map((category, index) => (
                            <div 
                              key={index} 
                              className="px-3 py-1 bg-primary/10 text-primary rounded-2xl whitespace-nowrap"
                            >
                              {category.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500">Chưa có loại cà phê nào</div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* qualifications */}
                <TabsContent value="qualifications">
                  <div>
                    <h3 className="h3 mb-8 text-center xl:text-left">
                      Hành Trình Tâm Giao Coffee
                    </h3>
                    {/* experience & education wrapper */}
                    <div className="grid md:grid-cols-2 gap-y-8">
                      {/* experience */}
                      <div className="flex flex-col gap-y-6">
                        <div className="flex gap-x-4 items-center text-[22px] text-primary">
                          <Briefcase />
                          <h4 className="capitalize font-medium">
                            {getData(qualificationData, "experience").title}
                          </h4>
                        </div>
                        {/* list */}
                        <div className="flex flex-col gap-y-8">
                          {getData(qualificationData, "experience").data.map(
                            (item, index) => {
                              const { company, role, years } = item;
                              return (
                                <div className="flex gap-x-8 group" key={index}>
                                  <div className="h-[84px] w-[1px] bg-border relative ml-2">
                                    <div className="w-[11px] h-[11px] rounded-full bg-primary absolute -left-[5px] group-hover:translate-y-[84px] transition-all duration-500"></div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-xl leading-none mb-2">
                                      {company}
                                    </div>
                                    <div className="text-lg leading-none text-muted-foreground mb-4">
                                      {role}
                                    </div>
                                    <div className="text-base font-medium">
                                      {years}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      {/* education */}
                      <div className="flex flex-col gap-y-6">
                        <div className="flex gap-x-4 items-center text-[22px] text-primary">
                          <GraduationCap size={28} />
                          <h4 className="capitalize font-medium">
                            {getData(qualificationData, "education").title}
                          </h4>
                        </div>
                        {/* list */}
                        <div className="flex flex-col gap-y-8">
                          {getData(qualificationData, "education").data.map(
                            (item, index) => {
                              const { university, qualification, years } = item;
                              return (
                                <div className="flex gap-x-8 group" key={index}>
                                  <div className="h-[84px] w-[1px] bg-border relative ml-2">
                                    <div className="w-[11px] h-[11px] rounded-full bg-primary absolute -left-[5px] group-hover:translate-y-[84px] transition-all duration-500"></div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-xl leading-none mb-2">
                                      {university}
                                    </div>
                                    <div className="text-lg leading-none text-muted-foreground mb-4">
                                      {qualification}
                                    </div>
                                    <div className="text-base font-medium">
                                      {years}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* skills */}
                <TabsContent value="skills">
                  <div className="text-center xl:text-left">
                    <h3 className="h3 mb-8">Thế Mạnh Của Tâm Giao Coffee</h3>
                    {/* skills */}
                    <div className="mb-16">
                      <h4 className="text-xl font-semibold mb-2">Lợi Thế</h4>
                      <div className="border-b border-border mb-4"></div>
                      {/* skill list */}
                      <div>
                        {getData(skillData, "skills").data.map(
                          (item, index) => {
                            const { name } = item;
                            return (
                              <div
                                className="w-2/4 text-center xl:text-left mx-auto xl:mx-0"
                                key={index}
                              >
                                <div className="font-medium">{name}</div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    {/* tools */}
                    <div>
                      <h4 className="text-xl font-semibold mb-2 xl:text-left">
                        Đối Tác
                      </h4>
                      <div className="border-b border-border mb-4"></div>
                      {/* tool list */}
                      <div className="flex gap-x-8 justify-center xl:justify-start">
                        {getData(skillData, "tools").data.map((item, index) => {
                          const { imgPath } = item;
                          return (
                            <div key={index}>
                              <Image
                                src={imgPath}
                                width={48}
                                height={48}
                                alt=""
                                priority
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
