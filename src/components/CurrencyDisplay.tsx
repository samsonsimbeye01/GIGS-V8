import React from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showIcon?: boolean;
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  amount, 
  className = '', 
  showIcon = true 
}) => {
  const { country } = useLocation();
  
  const formatCurrency = (value: number, currency: string): string => {
    const currencySymbols: Record<string, string> = {
      'NGN': '₦',
      'KES': 'KSh',
      'TZS': 'TSh', // Tanzania Shilling
      'UGX': 'USh',
      'GHS': 'GH₵',
      'ZAR': 'R',
      'EGP': 'E£',
      'MAD': 'MAD',
      'ETB': 'Br',
      'RWF': 'RWF'
    };
    
    const symbol = currencySymbols[currency] || currency;
    return `${symbol} ${value.toLocaleString()}`;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showIcon && <Coins className="w-4 h-4 text-yellow-500" />}
      <span className="font-semibold">
        {formatCurrency(amount, country.currency)}
      </span>
      <Badge variant="outline" className="text-xs">
        {country.currency}
      </Badge>
    </div>
  );
};

export { CurrencyDisplay };
export default CurrencyDisplay;