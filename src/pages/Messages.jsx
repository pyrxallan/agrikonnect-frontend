import { useState } from "react";
import Inbox from "../components/messaging/Inbox";
import ChatView from "../components/messaging/ChatView";

export default function Messages() {
  const [activeUser, setActiveUser] = useState(null);

  return (
    <div className="h-screen flex bg-background">
      <Inbox onSelect={setActiveUser} activeUserId={activeUser} />
      <ChatView userId={activeUser} />
    </div>
  );
}
