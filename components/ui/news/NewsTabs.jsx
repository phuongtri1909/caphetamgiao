import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NewsTabs = ({ currentTab, onTabChange }) => {
  return (
    <Tabs
      defaultValue={currentTab}
      onValueChange={onTabChange}
      className="w-full max-w-3xl mx-auto"
    >
      <TabsList className="grid grid-cols-3 h-auto p-1 bg-muted rounded-lg">
        <TabsTrigger
          value="all"
          className="py-3 rounded-3xl text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted-foreground/20"
        >
          Tất cả bài viết
        </TabsTrigger>
        <TabsTrigger
          value="featured"
          className="py-3 rounded-3xl text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted-foreground/20"
        >
          Bài viết nổi bật
        </TabsTrigger>
        <TabsTrigger
          value="latest"
          className="py-3 rounded-3xl text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted-foreground/20"
        >
          Bài viết mới nhất
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NewsTabs;