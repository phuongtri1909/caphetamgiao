import { Button } from "@/components/ui/button";

const EmptyState = ({ 
  title, 
  description, 
  actionText = null,
  onAction = null
}) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {actionText && onAction && (
        <Button
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;