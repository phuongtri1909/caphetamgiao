import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader } from './ui/card';
import { Github, Link2Icon } from 'lucide-react';
import { Badge } from './ui/badge';
import { useState } from 'react';


const ProjectCard = ({ project }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "/work/3.png";
  
  return (
    <Card className='group overflow-hidden relative'>
      <CardHeader className='p-0'>
        {/* image - với container bao bọc */}
        <div className='relative w-full aspect-[4/3] overflow-hidden'>
          <Image
            className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-105'
            src={imageError ? fallbackImage : project.image}
            fill
            alt={project.name || 'Project image'}
            priority
            onError={() => setImageError(true)}
          />
          
          {/* Tag giá ở góc phải trên */}
          {project.price && (
            <div className='absolute top-3 right-3 bg-[#53382C] text-white px-2 py-1 rounded-2xl font-medium text-sm z-20 shadow-md'>
              {project.price}
            </div>
          )}
          
          {/* Overlay khi hover */}
          <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          
          {/* btn links */}
          <div className='absolute inset-0 flex items-center justify-center gap-x-4 z-10'>
            <Link
              href={`/projects/detail/${project.slug}`}
              className='bg-secondary w-[54px] h-[54px] rounded-full flex justify-center items-center scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200'
            >
              <Link2Icon className='text-white' />
            </Link>
          </div>
        </div>
      </CardHeader>
      <div className='h-full px-8 py-6'>
        <Badge className='uppercase text-sm font-medium mb-2 absolute top-4 left-5 z-20'>
          {project.category}
        </Badge>
        <h4 className='h4 mb-1'>{project.name}</h4>
        <p className='text-muted-foreground text-lg'>{project.description}</p>
      </div>
    </Card>
  );
};

export default ProjectCard;