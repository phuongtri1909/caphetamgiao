// components/ui/option-button.jsx
import React from 'react';

const OptionButton = ({ 
  label, 
  isSelected = false, 
  onClick,
  className = '',
}) => {
  return (
    <span 
      className={`
        
        ${isSelected 
          ? 'border-2 border-[#53382C] bg-[#53382C]/10 font-medium text-[#53382C] ' 
          : 'border border-[#cccccc] hover:bg-gray-50'
        }
        rounded-md text-[16px] px-3 py-1.5 cursor-pointer transition-colors
        ${className}
      `}
      onClick={onClick}
    >
      {label}
    </span>
  );
};

export default OptionButton;