import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaDownload, FaFilter, FaRedo, FaGlobe, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import PostCard from './components/PostCard';
import FilterSidebar from './components/FilterSidebar';
import StatsBar from './components/StatsBar';

const API_URL = 'http://localhost:8080/api';

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
  const [backendOnline, setBackendOnline] = useState(false);

  // Fetch posts from backend
  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      const params = { page: 0, size: 100, ...filters };
      const response = await axios.get(`${API_URL}/posts`, { params, timeout: 5000 });
      setPosts(response.data.posts || []);
      setLastUpdated(new Date(response.data.lastUpdated));
      setBackendOnline(true);
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setError('Backend server is not running. Please start the Spring Boot application.');
        setBackendOnline(false);
      } else {
        setError('Error loading posts: ' + err.message);
      }
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const loadStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`, { timeout: 5000 });
      setStats(response.data);
    } catch (err) {
      // Silently fail for stats
    }
  }, []);

  // Initial load and auto-refresh
  useEffect(() => {
    loadPosts();
    loadStats();
    
    const interval = setInterval(() => {
      loadPosts();
      loadStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadPosts, loadStats]);

  // Search handler
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPosts();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/search`, {
        params: { keyword: searchTerm, page: 0, size: 100 },
        timeout: 5000
      });
      setPosts(response.data.posts || []);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Export handler
  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`, {
        params: filters,
        responseType: 'blob',
        timeout: 10000
      });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passport-posts-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed. Make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
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
              {/* Backend Status */}
              <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium ${
                backendOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {backendOnline ? 'Connected' : 'Backend Offline'}
              </div>
              
              {/* Last Updated */}
              {lastUpdated && (
                <span className="text-xs text-gray-400">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              
              {/* Refresh */}
              <button onClick={loadPosts} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition" title="Refresh data">
                <FaRedo className={loading ? 'animate-spin' : ''} />
              </button>
              
              {/* Export */}
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition font-medium">
                <FaDownload /> Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar stats={stats} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-amber-800 text-sm">{error}</p>
              {!backendOnline && (
                <p className="text-amber-600 text-xs mt-2">
                  Run: <code className="bg-amber-100 px-2 py-0.5 rounded">cd backend && mvn spring-boot:run</code>
                </p>
              )}
            </div>
            <button onClick={() => setError(null)} className="text-amber-500 hover:text-amber-700">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search passport posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>
            <button onClick={handleSearch} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm transition">
              Search
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium text-sm transition ${
                showFilters ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter /> Filters
              {Object.values(filters).some(v => v) && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {Object.values(filters).filter(v => v).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && <FilterSidebar filters={filters} setFilters={setFilters} />}

        {/* Loading State */}
        {loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading posts from RSS feeds...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && backendOnline && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-gray-600 font-medium">Fetching RSS feeds...</p>
            <p className="text-gray-400 text-sm mt-2">Posts will appear as RSS feeds are scraped</p>
            <p className="text-gray-400 text-xs mt-1">Auto-refreshes every 30 seconds</p>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{posts.length}</span> posts
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
