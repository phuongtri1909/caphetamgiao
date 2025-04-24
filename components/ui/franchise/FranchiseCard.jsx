import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactFormModal from "@/components/ui/franchise/ContactFormModal";
import { truncateHTML } from '@/lib/utils';

const FranchiseCard = ({ franchise, variants }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Parse details from CKEditor content
  const renderDetails = () => {
    if (!franchise.details) return null;

    try {
      // If details is already an array, use it directly
      if (Array.isArray(franchise.details)) {
        return franchise.details;
      }
      
      // If details is an object with features array
      if (franchise.details.features && Array.isArray(franchise.details.features)) {
        return franchise.details.features;
      }
      
      // Try to parse JSON if it's a string
      const parsedDetails = typeof franchise.details === 'string' 
        ? JSON.parse(franchise.details) 
        : franchise.details;
        
      if (Array.isArray(parsedDetails)) {
        return parsedDetails;
      }
      
      if (parsedDetails.features && Array.isArray(parsedDetails.features)) {
        return parsedDetails.features;
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing franchise details:", error);
      return [];
    }
  };

  const details = renderDetails();

  // Handle card click (navigation to detail page)
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on the contact button
    if (e.target.closest('button[data-prevent-navigation]')) {
      return;
    }
    
    router.push(`/nhuongquyen/${franchise.slug}`);
  };

  // Stop propagation for dialog button click
  const handleContactClick = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  return (
    <>
      <motion.div
        variants={variants}
        className={`bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full cursor-pointer group ${isHovered ? 'border-primary' : ''}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`relative bg-primary/10 p-8 text-center transition-all duration-300 
            ${isHovered ? 'bg-primary/20 pb-10' : ''}`}
        >
          <p className="text-muted-foreground text-primary">
            {franchise.name}
          </p>
          <h3 className={`text-2xl font-bold text-primary transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
            {franchise.name_package}
          </h3>
        </div>
        
        <div className="flex-1">
          {details && details.length > 0 && (
            <ul className="space-y-3 text-center">
              {details.map((feature, idx) => (
                <motion.li 
                  key={idx} 
                  className="group/item border-b border-gray-200 py-3 px-2 !mt-0 first:bg-gray-100 first:border-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  
                  <div 
                    className="transition-colors group-hover/item:text-primary"
                    dangerouslySetInnerHTML={{ __html: feature }}
                  />
                </motion.li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="py-3 mt-auto text-center">
          <Button 
            data-prevent-navigation
            onClick={handleContactClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground group-hover:bg-primary/90"
          >
            <Phone className="mr-2 h-4 w-4" />
            Liên hệ tư vấn
          </Button>
        </div>
      </motion.div>

      {/* Contact Form Modal */}
      <ContactFormModal 
  isOpen={isDialogOpen}
  onClose={() => setIsDialogOpen(false)} 
  franchiseName={franchise.name_package}
  franchiseId={franchise.id}
  franchiseCode={franchise.code}
/>
    </>
  );
};

export default FranchiseCard;