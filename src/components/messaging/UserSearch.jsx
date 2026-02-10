import { useState, useEffect } from "react";
import { searchUsers, fetchAllUsers } from "../../services/messagesApi";

export default function UserSearch({ onSelectUser, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [userType, setUserType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all users on mount
  useEffect(() => {
    const loadAllUsers = async () => {
      setLoading(true);
      const data = await fetchAllUsers(userType);
      setResults(data || []);
      setLoading(false);
    };
    loadAllUsers();
  }, [userType]);

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) {
      // Reload all users when search is cleared
      const loadAllUsers = async () => {
        setLoading(true);
        const data = await fetchAllUsers(userType);
        setResults(data || []);
        setLoading(false);
      };
      loadAllUsers();
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      console.log('Searching for:', query, 'Type:', userType);
      const data = await searchUsers(query, userType);
      console.log('Received data:', data);
      setResults(data || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, userType]);

  const handleSelect = (user) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary">Search Users</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search farmers or experts..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              autoFocus
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            {["all", "farmer", "expert"].map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  userType === type
                    ? "bg-secondary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {type === "all" ? " Users" : "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
              <p className="text-xs mt-1">Check console for details</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium">All Users</p>
              <p className="text-sm mt-1">Select a user to start chatting</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/10 cursor-pointer transition-all border border-transparent hover:border-secondary/30"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {user.first_name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text">{user.first_name} {user.last_name}</p>
                      {user.role && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "expert"
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary/20 text-secondary"
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </div>
                    {user.email && (
                      <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                    )}
                  </div>

                  {/* Action Icon */}
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
