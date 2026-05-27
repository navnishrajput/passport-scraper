import React from 'react';

export default function StatsBar({ stats }) {
  const statItems = [
    { 
      label: 'Total Posts', 
      value: stats.totalPosts || 0, 
      icon: '📊',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Sources', 
      value: stats.platforms || 0, 
      icon: '📡',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: 'Categories', 
      value: Object.keys(stats.categoryStats || {}).length || 0, 
      icon: '🏷️',
      color: 'from-green-500 to-green-600'
    },
    { 
      label: 'Updated', 
      value: stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : '--:--', 
      icon: '🕐',
      color: 'from-orange-500 to-orange-600'
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-gray-50">
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              <div className="text-xs text-gray-500 mt-1">{item.icon} {item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
