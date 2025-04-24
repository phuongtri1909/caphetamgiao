import { Button } from "@/components/ui/button";
import Link from "next/link";

const ErrorDisplay = ({ 
  message, 
  onRetry = null,
  backLink = null,
  backLinkText = "Quay lại"
}) => {
  return (
    <div className="text-center py-10">
      <p className="text-red-500">{message}</p>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Thử lại
          </Button>
        )}
        
        {backLink && (
          <Button
            asChild
            variant={onRetry ? "outline" : "default"}
            className={onRetry 
              ? "border-primary text-primary hover:bg-primary/10" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }
          >
            <Link href={backLink}>{backLinkText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;