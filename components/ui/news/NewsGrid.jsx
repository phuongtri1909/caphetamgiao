import { motion } from "framer-motion";
import NewsCard from "@/components/ui/news/NewsCard";

const NewsGrid = ({ news, containerVariants }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {news.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </motion.div>
  );
};

export default NewsGrid;