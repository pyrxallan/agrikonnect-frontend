import { useState } from "react";
import Inbox from "../components/messaging/Inbox";
import ChatView from "../components/messaging/ChatView";
import UserSearch from "../components/messaging/UserSearch";

export default function Messages() {
  const [activeUser, setActiveUser] = useState(null);
  const [activeUserName, setActiveUserName] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleSelectUser = (user) => {
    setActiveUser(user.id);
    setActiveUserName(user.username || `${user.first_name} ${user.last_name}`);
  };

  const handleInboxSelect = (userId, userName) => {
    setActiveUser(userId);
    setActiveUserName(userName);
  };

  return (
    <div className="h-screen flex bg-background">
      <Inbox 
        onSelect={handleInboxSelect} 
        activeUserId={activeUser}
        onNewChat={() => setShowSearch(true)}
      />
      <ChatView userId={activeUser} userName={activeUserName} />
      
      {showSearch && (
        <UserSearch
          onSelectUser={handleSelectUser}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}
