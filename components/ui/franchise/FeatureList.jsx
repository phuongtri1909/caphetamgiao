import { Check } from "lucide-react";

const FeatureList = ({ features, title, columns = 2 }) => {
  if (!features || features.length === 0) return null;
  
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className={`grid grid-cols-1 ${columns > 1 ? `md:grid-cols-${columns}` : ''} gap-4`}>
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="h-6 w-6 text-primary shrink-0 mr-3 mt-0.5" />
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureList;