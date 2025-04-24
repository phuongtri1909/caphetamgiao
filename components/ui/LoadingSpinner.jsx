const LoadingSpinner = ({ size = "medium" }) => {
    const sizeClasses = {
      small: "h-8 w-8",
      medium: "h-12 w-12", 
      large: "h-16 w-16"
    };
    
    const heightClass = sizeClasses[size] || sizeClasses.medium;
    
    return (
      <div className="flex justify-center items-center py-20">
        <div className={`animate-spin rounded-full ${heightClass} border-t-2 border-b-2 border-primary`}></div>
      </div>
    );
  };
  
  export default LoadingSpinner;