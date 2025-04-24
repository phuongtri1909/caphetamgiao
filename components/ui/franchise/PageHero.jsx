import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PageHero = ({ 
  backgroundImage, 
  title, 
  description = null, 
  ctaText = null, 
  ctaLink = null, 
  overlay = "bg-black/60",
  hideDefaultCta = false,
  customContent = null
}) => {
  return (
    <section className={`relative h-[50vh] md:h-[60vh] bg-cover bg-center ${backgroundImage}`}>
      <div className={`absolute inset-0 ${overlay}`}></div>
      <div className="container mx-auto h-full flex flex-col justify-center items-center relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl lg:text-4xl font-bold text-white mb-6 max-w-3xl leading-relaxed"
        >
          {title}
        </motion.h1>
        
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {description}
          </motion.p>
        )}

        {!hideDefaultCta && ctaText && ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href={ctaLink}>
                {ctaText}
              </Link>
            </Button>
          </motion.div>
        )}

        {customContent}
      </div>
    </section>
  );
};

export default PageHero;