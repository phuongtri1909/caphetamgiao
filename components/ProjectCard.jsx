import Link from 'next/link';
import Image from 'next/image';
import { Card } from './ui/card';
import { ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fallbackImage = "/work/3.png";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className='group overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 border border-border/40'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image Container */}
        <div className='relative w-full aspect-[4/3] overflow-hidden bg-muted/20'>
          {/* Ảnh sản phẩm */}
          <Image
            className='object-cover w-full h-full transition-all duration-700 group-hover:scale-110'
            src={imageError ? fallbackImage : project.image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={project.name || 'Sản phẩm'}
            priority
            onError={() => setImageError(true)}
          />
          
          {/* Tag giá - Animating in from right */}
          {project.price && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className='absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-full font-medium text-sm z-30 shadow-md'
            >
              {project.price}
            </motion.div>
          )}
          
          {/* Overlay khi hover với blur effect */}
          <div className='absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          
          {/* Category badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <Badge className='uppercase text-xs px-3 py-1 font-medium bg-white/90 text-primary dark:bg-gray-900/90 backdrop-blur-sm transition-all'>
              {project.category}
            </Badge>
          </div>
          
          {/* Action buttons */}
          <div className='absolute inset-0 flex items-center justify-center gap-3 z-20'>
            {/* Chi tiết */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={isHovering ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -15 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0 }}
            >
              <Link
                href={`/projects/detail/${project.slug}`}
                className='bg-white dark:bg-gray-800 w-10 h-10 rounded-full flex justify-center items-center shadow-md hover:bg-primary hover:text-white transition-colors duration-300'
              >
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </motion.div>
            
          </div>
        </div>
        
        {/* Content with fixed height */}
        <div className='flex flex-col p-5 flex-grow'>
          {/* Tên sản phẩm */}
          <Link href={`/projects/detail/${project.slug}`}>
            <h3 className='font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300'>
              {project.name}
            </h3>
          </Link>
          
          {/* Mô tả */}
          <p className='text-muted-foreground text-sm line-clamp-2 h-[40px] mb-1'>
            {project.description}
          </p>
          
          <div className="mt-auto pt-3 flex justify-between items-center">
            <Link 
              href={`/projects/detail/${project.slug}`}
              className="text-xs text-primary font-medium flex items-center hover:underline"
            >
              Xem chi tiết
              <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;