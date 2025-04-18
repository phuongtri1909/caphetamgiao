import { GanttChartSquare, Blocks, Gem } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const servicesData = [
  {
    icon: <GanttChartSquare size={72} strokeWidth={0.8} />,
    title: "Mô Hình Kinh Doanh",
    description:
      "Cung cấp mô hình kinh doanh cà phê chuyên nghiệp, từ vận hành đến tiếp thị, giúp bạn khởi nghiệp thuận lợi.",
  },
  {
    icon: <Blocks size={72} strokeWidth={0.8} />,
    title: "Hỗ Trợ Toàn Diện",
    description:
      "Đào tạo nhân sự, công thức pha chế độc quyền, chiến lược phát triển thương hiệu, tối ưu doanh thu.",
  },
  {
    icon: <Gem size={72} strokeWidth={0.8} />,
    title: "Sản Phẩm Chất Lượng Cao",
    description:
      "Cung cấp nguồn nguyên liệu sạch, cà phê nguyên chất từ vùng trồng đạt chuẩn, đảm bảo hương vị tuyệt hảo.",
  },
];

const Services = () => {
  return (
    <section className="mb-12 xl:mb-36">
      <div className="container mx-auto">
        <h2 className="section-title mb-12 xl:mb-24 text-center mx-auto">
          Nhượng Quyền
        </h2>
        {/* grid items */}
        <div className="grid xl:grid-cols-3 justify-center gap-y-12 xl:gap-y-24 xl:gap-x-8">
          {servicesData.map((item, index) => {
            return (
              <Card
                className="w-full max-w-[424px] h-[300px] flex flex-col pt-16 pb-10 justify-center items-center relative"
                key={index}
              >
                <CardHeader className="text-primary absolute -top-[60px]">
                  <div className="w-[140px] h-[80px] bg-white dark:bg-background flex justify-center items-center">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="mb-4">{item.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
