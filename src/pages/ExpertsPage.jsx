import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchExperts } from '../features/experts/expertsSlice';
import ExpertCard from '../components/ExpertCard';

// expert component that displays all experts with search and filter functionality
  const ExpertsPage = () => {
  const dispatch = useAppDispatch();
  const { list: experts, loading } = useAppSelector(state => state.experts); 
  const { user } = useAppSelector(state => state.auth);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    dispatch(fetchExperts());
    // Fetch specialties from backend
    fetch(`${import.meta.env.VITE_API_URL}/experts/specialties`)
      .then(res => res.json())
      .then(data => setSpecialties(data.specialties || []))
      .catch(err => console.error('Failed to fetch specialties:', err));
  }, [dispatch]);

  const filteredExperts = experts.filter(e => {
    const matchesSearch = search ? (e.name.toLowerCase().includes(search.toLowerCase()) || e.title?.toLowerCase().includes(search.toLowerCase())) : true;
    const matchesLocation = location ? e.location?.toLowerCase().includes(location.toLowerCase()) : true;
    const matchesSpecialty = specialty ? e.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase())) : true;
    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  // extract unique locations for filter dropdown
  const locations = [...new Set(experts.map(e => e.location).filter(Boolean))];

  const handleFollow = (expertId) => {
    console.log('Follow expert:', expertId);
    // TODO: Implement follow functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/agricultural_expert_page.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
        <div className="relative z-10 text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/agricultural_expert_page.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Agricultural Experts
          </h1>
          <p className="text-xl text-gray-600">
            Connect with certified agricultural experts and get professional advice
          </p>
        </div>
        
        <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Search experts..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className=" galss bg-white/50 text-gray-700 w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
            />
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <select 
              value={specialty} 
              onChange={(e) => setSpecialty(e.target.value)} 
              className="px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Specialties</option>
              {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
            <button 
              onClick={() => { setSearch(''); setLocation(''); setSpecialty(''); }} 
              className="px-4 py-3 glass bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 "
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            Showing {filteredExperts.length} of {experts.length} experts
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} onFollow={handleFollow} currentUserId={user?.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertsPage;
