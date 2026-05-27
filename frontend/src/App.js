import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaDownload, FaFilter, FaRedo, FaGlobe, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import PostCard from './components/PostCard';
import FilterSidebar from './components/FilterSidebar';
import StatsBar from './components/StatsBar';

const API_URL = 'https://passport-scraper.onrender.com/api';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    platform: '', category: '', region: '', sentiment: '', sortBy: 'date'
  });
  const [stats, setStats] = useState({
    totalPosts: 0, platforms: 0, platformStats: {}, categoryStats: {}, lastUpdated: null
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      const params = { page: 0, size: 100 };
      if (filters.platform) params.platform = filters.platform;
      if (filters.category) params.category = filters.category;
      if (filters.region) params.region = filters.region;
      if (filters.sentiment) params.sentiment = filters.sentiment;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      
      const response = await axios.get(`${API_URL}/posts`, { params, timeout: 10000 });
      setPosts(response.data.posts || []);
      setLastUpdated(new Date(response.data.lastUpdated));
      setBackendOnline(true);
    } catch (err) {
      console.error('API Error:', err.message);
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setError('Backend server is not running.');
        setBackendOnline(false);
      } else {
        setBackendOnline(true);
        setError(null);
      }
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`, { timeout: 10000 });
      setStats(response.data);
    } catch (err) {
      console.error('Stats Error:', err.message);
    }
  }, []);

  useEffect(() => {
    loadPosts();
    loadStats();
    const interval = setInterval(() => {
      loadPosts();
      loadStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadPosts, loadStats]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) { loadPosts(); return; }
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/search`, {
        params: { keyword: searchTerm, page: 0, size: 100 },
        timeout: 10000
      });
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error('Search error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`, {
        params: filters, responseType: 'blob', timeout: 10000
      });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passport-posts.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg">
                <FaGlobe className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Passport Monitor</h1>
                <p className="text-xs text-gray-500">Real-time social media intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium ${
                backendOnline === true ? 'bg-green-50 text-green-700' : 
                backendOnline === false ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  backendOnline === true ? 'bg-green-500 animate-pulse' : 
                  backendOnline === false ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                {backendOnline === true ? 'Connected' : backendOnline === false ? 'Backend Offline' : 'Connecting...'}
              </div>
              {lastUpdated && (
                <span className="text-xs text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
              <button onClick={loadPosts} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition" title="Refresh">
                <FaRedo className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition font-medium">
                <FaDownload /> Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <StatsBar stats={stats} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-amber-800 text-sm">{error}</p>
              <p className="text-amber-600 text-xs mt-1">
                API: {API_URL}/posts
              </p>
            </div>
            <button onClick={() => setError(null)} className="text-amber-500 hover:text-amber-700">
              <FaTimes />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search passport posts..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm" />
            </div>
            <button onClick={handleSearch} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm transition">Search</button>
            <button onClick={() => setShowFilters(!showFilters)} className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium text-sm transition ${showFilters ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        {showFilters && <FilterSidebar filters={filters} setFilters={setFilters} />}

        {loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading posts...</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-gray-600 font-medium">No posts yet</p>
            <p className="text-gray-400 text-sm mt-2">Posts will appear as RSS feeds are scraped</p>
            <button onClick={loadPosts} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Refresh Now</button>
          </div>
        )}

        {posts.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">Showing {posts.length} posts</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
