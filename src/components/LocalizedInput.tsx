import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation } from '@/contexts/LocationContext';

interface LocalizedInputProps {
  type: 'phone' | 'nationalId' | 'text';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const LocalizedInput: React.FC<LocalizedInputProps> = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error
}) => {
  const { country, formatPhoneNumber, validateNationalId } = useLocation();

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (type) {
      case 'phone':
        return country.phoneFormat;
      case 'nationalId':
        return country.nationalIdFormat;
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (type === 'phone') {
      // Allow only digits and basic formatting
      const cleaned = inputValue.replace(/[^\d+\s-()]/g, '');
      onChange(cleaned);
    } else if (type === 'nationalId') {
      // Allow alphanumeric and basic formatting
      const cleaned = inputValue.replace(/[^A-Za-z0-9\s-]/g, '');
      onChange(cleaned);
    } else {
      onChange(inputValue);
    }
  };

  const getValidationStatus = () => {
    if (!value) return null;
    
    if (type === 'phone') {
      const digits = value.replace(/\D/g, '');
      const expectedLength = country.phoneFormat.replace(/[^X]/g, '').length;
      return digits.length === expectedLength;
    } else if (type === 'nationalId') {
      return validateNationalId(value);
    }
    
    return true;
  };

  const isValid = getValidationStatus();
  const showValidation = value && type !== 'text';

  return (
    <div className="space-y-2">
      <Label htmlFor={type} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {type === 'phone' && (
          <span className="text-xs text-gray-500 ml-2">({country.name})</span>
        )}
      </Label>
      
      <div className="relative">
        <Input
          id={type}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          className={`w-full ${
            showValidation
              ? isValid
                ? 'border-green-500 focus:ring-green-500'
                : 'border-red-500 focus:ring-red-500'
              : ''
          }`}
          required={required}
        />
        
        {showValidation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {type === 'phone' && value && (
        <p className="text-xs text-gray-500">
          Formatted: {formatPhoneNumber(value)}
        </p>
      )}
      
      {type === 'nationalId' && (
        <p className="text-xs text-gray-500">
          Format: {country.nationalIdFormat}
        </p>
      )}
    </div>
  );
};