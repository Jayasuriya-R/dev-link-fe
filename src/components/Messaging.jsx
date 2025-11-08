import React, { useEffect, useState } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Messaging = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const params = useParams();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const connection = useSelector((state) => state.connection);

  const targetChat = connection.find(
    (user) => user._id === params.targetUserId
  );
  useEffect(() => {
    setSelectedChat(targetChat);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMsg = {
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: "me",
      };

      setMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
      }));
      setMessage("");
    }
  };

  const filteredConnections = connection.filter((con) =>
    con.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[72vh] w-10/12 m-0 bg-gray-50 rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
                src={currentUser?.photoUrl}
                alt={currentUser?.firstName}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
              <p className="text-xs text-green-600">Active now</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConnections.map((con) => (
            <div
              key={con._id}
              onClick={() => setSelectedChat(con)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                selectedChat?._id === con._id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={con?.photoUrl}
                  alt={con?.firstName}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {con?.firstName} {con?.lastName}
                  </h2>
                  <span className="text-xs text-gray-500 ml-2">10 AM</span>
                </div>
                <p className="text-sm text-gray-600 truncate">Hi there..</p>
              </div>
              {con.unread > 0 && (
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">
                    {con.unread}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={selectedChat?.photoUrl}
                      alt={selectedChat?.firstName}
                    />
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedChat?.firstName} {selectedChat?.lastName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedChat.online ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages[selectedChat.id]?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "me" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === "me"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {(!messages[selectedChat.id] ||
                messages[selectedChat.id].length === 0) && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-500">
                    Send a message to {selectedChat.firstName} to get started
                  </p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Send className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Messages
            </h2>
            <p className="text-gray-500 max-w-md">
              Select a conversation from the sidebar to start chatting with your
              connections
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
