import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  lastPage, 
  onPageChange 
}) => {
  if (lastPage <= 1) return null;
  
  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-primary text-primary hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Trước
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: lastPage }, (_, i) => i + 1)
            .filter(page => {
              // Show first page, last page, current page, and pages around current page
              return (
                page === 1 || 
                page === lastPage || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .map((page, index, array) => {
              // Add ellipsis between non-consecutive page numbers
              if (index > 0 && array[index - 1] !== page - 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="px-2">...</span>
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => onPageChange(page)}
                      className={
                        currentPage === page
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "border-primary text-primary hover:bg-primary/10"
                      }
                      size="sm"
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => onPageChange(page)}
                  className={
                    currentPage === page
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "border-primary text-primary hover:bg-primary/10"
                  }
                  size="sm"
                >
                  {page}
                </Button>
              );
            })}
        </div>

        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="border-primary text-primary hover:bg-primary/10"
        >
          Tiếp
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;