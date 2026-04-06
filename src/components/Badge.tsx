import React from 'react';

interface BadgeProps {
  variant: 'brand' | 'teal' | 'amber' | 'green' | 'red' | 'gray';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  const variantClasses = {
    brand: 'bg-blue-500 text-white',
    teal: 'bg-teal-500 text-white',
    amber: 'bg-amber-500 text-black',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
    gray: 'bg-gray-500 text-white',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]}`}> 
      {children}
    </span>
  );
};

export default Badge;