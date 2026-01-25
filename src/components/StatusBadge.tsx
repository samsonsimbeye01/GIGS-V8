import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return { color: 'bg-green-500 text-white', label: 'Open' };
      case 'pending':
        return { color: 'bg-yellow-500 text-white', label: 'Pending' };
      case 'assigned':
        return { color: 'bg-blue-500 text-white', label: 'Assigned' };
      case 'in_progress':
        return { color: 'bg-orange-500 text-white', label: 'In Progress' };
      case 'completed':
        return { color: 'bg-green-600 text-white', label: 'Completed' };
      case 'awaiting_review':
        return { color: 'bg-purple-500 text-white', label: 'Awaiting Review' };
      case 'disputed':
        return { color: 'bg-red-500 text-white', label: 'Disputed' };
      case 'cancelled_by_poster':
        return { color: 'bg-gray-500 text-white', label: 'Cancelled by Poster' };
      case 'cancelled_by_worker':
        return { color: 'bg-gray-500 text-white', label: 'Cancelled by Worker' };
      case 'expired':
        return { color: 'bg-gray-400 text-white', label: 'Expired' };
      case 'flagged':
        return { color: 'bg-red-600 text-white', label: 'Flagged' };
      case 'under_review':
        return { color: 'bg-yellow-600 text-white', label: 'Under Review' };
      case 'archived':
        return { color: 'bg-gray-300 text-gray-700', label: 'Archived' };
      default:
        return { color: 'bg-gray-500 text-white', label: status.replace('_', ' ').toUpperCase() };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`${config.color} ${className}`}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;