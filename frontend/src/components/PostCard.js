import React, { useState } from 'react';
import { FaHeart, FaShare, FaComment, FaGlobe, FaReddit, FaNewspaper, FaYoutube } from 'react-icons/fa';
import { translatePost } from '../services/api';

const platformIcons = {
  'Reddit': FaReddit,
  'Google News': FaNewspaper,
  'YouTube': FaYoutube,
  'Times of India': FaNewspaper,
  'The Hindu': FaNewspaper,
  'NDTV': FaNewspaper,
  'BBC News': FaNewspaper,
  'Government': FaGlobe,
};

const platformColors = {
  'Reddit': 'bg-orange-100 text-orange-700',
  'Google News': 'bg-blue-50 text-blue-700',
  'Times of India': 'bg-gray-100 text-gray-700',
  'The Hindu': 'bg-indigo-50 text-indigo-700',
  'NDTV': 'bg-red-50 text-red-700',
  'BBC News': 'bg-red-100 text-red-800',
  'Government': 'bg-green-100 text-green-700',
};

const sentimentColors = {
  'Positive': 'bg-green-100 text-green-800',
  'Negative': 'bg-red-100 text-red-800',
  'Neutral': 'bg-gray-100 text-gray-800',
};

const languages = [
  { code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' },
  { code: 'pa', name: 'Punjabi' }, { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }, { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' }, { code: 'zh-CN', name: 'Chinese' },
  { code: 'ru', name: 'Russian' }, { code: 'ja', name: 'Japanese' },
];

export default function PostCard({ post }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi');

  const Icon = platformIcons[post.platform] || FaGlobe;
  const colorClass = platformColors[post.platform] || 'bg-gray-100 text-gray-700';
  const sentimentClass = sentimentColors[post.sentiment] || 'bg-gray-100 text-gray-800';

  const handleTranslate = async () => {
    if (selectedLang === 'en') {
      setTranslatedText(post.content);
      setShowTranslation(true);
      return;
    }
    try {
      setTranslating(true);
      const result = await translatePost(post.id, selectedLang);
      setTranslatedText(result.translated || post.content);
      setShowTranslation(true);
    } catch (err) {
      setTranslatedText('Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 post-card overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Icon className="text-sm" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{post.author}</h3>
              <p className="text-xs text-gray-500">{post.platform}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sentimentClass}`}>
            {post.sentiment || 'Neutral'}
          </span>
        </div>

        {/* Category Badge */}
        <span className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mb-3">
          {post.category || 'General'}
        </span>

        {/* Title */}
        <h4 className="text-gray-900 font-medium text-sm mb-2 line-clamp-2">
          {post.title}
        </h4>

        {/* Content */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {showTranslation ? translatedText : post.content}
        </p>

        {/* AI Summary */}
        {post.summary && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3 rounded-r-lg">
            <p className="text-xs text-blue-600 font-semibold mb-1">AI Summary</p>
            <p className="text-xs text-blue-700">{post.summary}</p>
          </div>
        )}

        {/* Translation */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <FaGlobe className="text-gray-400 text-xs" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="text-xs border rounded px-2 py-1 flex-1 bg-white"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {translating ? '...' : 'Go'}
            </button>
          </div>
          {showTranslation && (
            <button onClick={() => setShowTranslation(false)} className="text-xs text-blue-600 mt-2 hover:underline">
              Show original
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><FaHeart className="text-red-400" /> {post.likes || 0}</span>
            <span className="flex items-center gap-1"><FaShare className="text-green-400" /> {post.shares || 0}</span>
            <span className="flex items-center gap-1"><FaComment className="text-blue-400" /> {post.comments || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 px-2 py-0.5 rounded">{post.region || 'Global'}</span>
            <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
          </div>
        </div>

        {/* Source Link */}
        {post.url && (
          <a href={post.url} target="_blank" rel="noopener noreferrer" 
             className="text-xs text-blue-500 hover:text-blue-700 mt-2 inline-block hover:underline">
            View original source →
          </a>
        )}
      </div>
    </div>
  );
}