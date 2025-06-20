// src/components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, colorClass = 'text-blue-600' }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;