// TEMPORARY MOCK VERSION - Use this for testing UI without backend
// Replace messagesApi.js with this file temporarily, then switch back when backend is ready

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

// Mock data
const mockUsers = [
  { id: 2, username: "john_farmer", email: "john@example.com", role: "farmer" },
  { id: 3, username: "jane_expert", email: "jane@example.com", role: "expert" },
  { id: 4, username: "bob_farmer", email: "bob@example.com", role: "farmer" },
  { id: 5, username: "alice_expert", email: "alice@example.com", role: "expert" },
  { id: 6, username: "tom_farmer", email: "tom@example.com", role: "farmer" },
];

export async function fetchInbox() {
  try {
    const res = await fetch(`${API_URL}/messages/inbox`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch inbox');
    return res.json();
  } catch (error) {
    console.error('Inbox fetch error:', error);
    return [];
  }
}

export async function fetchConversation(userId) {
  try {
    const res = await fetch(`${API_URL}/messages/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch conversation');
    return res.json();
  } catch (error) {
    console.error('Conversation fetch error:', error);
    return [];
  }
}

export async function sendMessage(receiverId, content) {
  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        receiver_id: receiverId,
        content,
      }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  } catch (error) {
    console.error('Send message error:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

// MOCK VERSION - Returns fake data for testing
export async function searchUsers(query, userType = 'all') {
  console.log('🔍 MOCK SEARCH - Searching for:', query, 'Type:', userType);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter mock users
  const filtered = mockUsers.filter(u => {
    const matchesQuery = u.username.toLowerCase().includes(query.toLowerCase()) ||
                        u.email.toLowerCase().includes(query.toLowerCase());
    const matchesType = userType === 'all' || u.role === userType;
    return matchesQuery && matchesType;
  });
  
  console.log('🔍 MOCK SEARCH - Results:', filtered);
  return filtered;
}

// REAL VERSION - Uncomment this and comment out the mock version above when backend is ready
/*
export async function searchUsers(query, userType = 'all') {
  try {
    const params = new URLSearchParams({ q: query });
    if (userType !== 'all') params.append('type', userType);
    
    const url = `${API_URL}/users/search?${params}`;
    console.log('Searching users:', url);
    
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    console.log('Search response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Search failed:', res.status, errorText);
      throw new Error(`Failed to search users: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Search results:', data);
    return data;
  } catch (error) {
    console.error('Search users error:', error);
    return [];
  }
}
*/
