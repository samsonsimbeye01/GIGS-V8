import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jobCategories } from '@/utils/jobCategories';

interface JobCategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const JobCategorySelector: React.FC<JobCategorySelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select job category",
  required = false
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {Object.entries(jobCategories).map(([key, category]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default JobCategorySelector;