import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from '../components/ExpertCard';
import { expertsService } from '../services/expertsService';

// expert component that displays all experts with search and filter functionality
const ExpertsPage = () => {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]); // stores the complete list of experts from API
  const [loading, setLoading] = useState(true); // track data is being fetched from the server
  const [filtered, setFiltered] = useState([]); // stores the filtered results displayed on screen
  const [search, setSearch] = useState(''); // stores search query typed by the user
  const [location, setLocation] = useState(''); // store selected location filter
  const [specialty, setSpecialty] = useState(''); // store selected specialty filter

  // fetch all experts on mount and only rund once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await expertsService.getExperts();
        setExperts(data);
      } catch (err) {
        console.error('Failed to load experts:', err);
        setExperts([]); // use empty array if API fails
      } finally {
        setLoading(false); // stop loading spinner
      }
    };
    fetchData();
  }, []);

  // re-filter experts whenever search/filter values change
  useEffect(() => {
    let result = experts;
    // filter by name or title
    if (search) {
      result = result.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase()) || 
        e.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    // filter by location
    if (location) {
      result = result.filter(e => e.location?.toLowerCase().includes(location.toLowerCase()));
    }
    // filter by specialty
    if (specialty) {
      result = result.filter(e => 
        e.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }
    setFiltered(result);
  }, [experts, search, location, specialty]);

  // handles follow/unfollow for an expert when button clicks
  const handleFollow = async (id) => {
    const expert = experts.find(e => e.id === id);
    try {
      await (expert.is_following ? expertsService.unfollowExpert(id) : expertsService.followExpert(id));
      // updates follow status in state
      setExperts(prev => prev.map(e => e.id === id ? { ...e, is_following: !e.is_following } : e));
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  // extract unique locations and specialties for filter dropdowns
  const locations = [...new Set(experts.map(e => e.location).filter(Boolean))];
  const specialties = [...new Set(experts.flatMap(e => e.specialties || []))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
           className="flex items-center gap-2 text-green-600 dark:text-green-600 hover:text-green-700 mb-3"
        >
          Back
        </button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Agricultural Experts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with certified agricultural experts and get professional advice
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Search experts..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white" 
            />
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <select 
              value={specialty} 
              onChange={(e) => setSpecialty(e.target.value)} 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Specialties</option>
              {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
            <button 
              onClick={() => { setSearch(''); setLocation(''); setSpecialty(''); }} 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filtered.length} of {experts.length} experts
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} onFollow={handleFollow} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertsPage;
