const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

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
