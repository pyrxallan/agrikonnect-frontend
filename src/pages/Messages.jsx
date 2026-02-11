import { useState } from "react";
import Inbox from "../components/messaging/Inbox";
import ChatView from "../components/messaging/ChatView";
import UserSearch from "../components/messaging/UserSearch";

export default function Messages() {
  const [activeUser, setActiveUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleSelectUser = (user) => {
    setActiveUser(user.id);
  };

  return (
    <div className="h-screen flex bg-background">
      <Inbox 
        onSelect={setActiveUser} 
        activeUserId={activeUser}
        onNewChat={() => setShowSearch(true)}
      />
      <ChatView userId={activeUser} />
      
      {showSearch && (
        <UserSearch
          onSelectUser={handleSelectUser}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}
