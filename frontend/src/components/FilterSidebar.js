import React from 'react';

const platforms = ['Reddit', 'Google News', 'Times of India', 'The Hindu', 'NDTV', 'BBC News', 'Government'];
const categories = [
  'Application Process', 'Passport Renewal', 'Appointment Booking', 
  'Tatkal Service', 'Visa Related', 'Travel Issues',
  'Government Announcements', 'Scams and Fraud', 'Police Verification', 'Personal Experiences'
];
const regions = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Singapore', 'Global'];
const sentiments = ['Positive', 'Negative', 'Neutral'];
const sortOptions = [
  { value: 'date', label: 'Date (Newest)' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'relevance', label: 'Relevance' },
];

export default function FilterSidebar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filter & Sort Posts</h3>
        <button onClick={() => setFilters({ platform: '', category: '', region: '', sentiment: '', sortBy: 'date' })} 
                className="text-sm text-blue-600 hover:text-blue-800">
          Reset all
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <select value={filters.platform} onChange={(e) => handleChange('platform', e.target.value)} 
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 outline-none">
          <option value="">All Platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        
        <select value={filters.category} onChange={(e) => handleChange('category', e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 outline-none">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <select value={filters.region} onChange={(e) => handleChange('region', e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 outline-none">
          <option value="">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        
        <select value={filters.sentiment} onChange={(e) => handleChange('sentiment', e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 outline-none">
          <option value="">All Sentiments</option>
          {sentiments.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <select value={filters.sortBy} onChange={(e) => handleChange('sortBy', e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 outline-none">
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}