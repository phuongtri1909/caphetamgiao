import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const NewsSearch = ({ 
  onSearch, 
  initialQuery = "", 
  animationDelay = 0.6,
  className = "mt-8 w-full max-w-md" 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: animationDelay }}
      className={className}
    >
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 bg-white/90 placeholder:text-gray-500 text-black border-0 focus-visible:ring-primary"
        />
        <Button
          type="submit"
          className="ml-2 h-12 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[70px]"
        >
          <Search size={20} />
        </Button>
      </form>
    </motion.div>
  );
};

export default NewsSearch;