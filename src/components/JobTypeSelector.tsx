import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jobCategories } from '@/utils/jobCategories';

interface JobTypeSelectorProps {
  categoryKey: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const JobTypeSelector: React.FC<JobTypeSelectorProps> = ({
  categoryKey,
  value,
  onValueChange,
  placeholder = "Select job type",
  required = false
}) => {
  const category = jobCategories[categoryKey as keyof typeof jobCategories];
  
  if (!category) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select a category first" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {category.jobs.map((job, index) => (
          <SelectItem key={index} value={job.type}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{job.type}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {job.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default JobTypeSelector;