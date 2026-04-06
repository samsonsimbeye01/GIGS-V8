import React from 'react';

interface StatCardProps {
    label: string;
    value: number | string;
    trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend }) => {
    return (
        <div className={`stat-card ${trend}`}> 
            <h2>{label}</h2>
            <p>{value}</p>
            <span className={`trend ${trend}`}>{trend === 'up' ? '↑' : '↓'}</span>
        </div>
    );
};

export default StatCard;