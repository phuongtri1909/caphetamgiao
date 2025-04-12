import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="mx-2" size={14} />
          )}
          
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;