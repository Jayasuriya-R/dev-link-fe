import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { setLoading } from "../Store/authSlice";
import { Base_URL } from "../utils/constants";
import { setConnections } from "../Store/connectionSlice";
import EmojiPicker from "emoji-picker-react";

const Messaging = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const params = useParams();
  const socketRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const connection = useSelector((state) => state.connection);
  const targetChat = connection.find(
    (user) => user && user._id === params.targetUserId
  );
  const targetUserId = targetChat?._id;
  const currentUserId = currentUser?._id;

  useEffect(() => {
    setSelectedChat(targetChat);
  }, [targetChat]);

  useEffect(() => {
    if (connection.length === 0) {
      fetchConnections();
    }
  },[]);

  useEffect(() => {
    if (!currentUserId) {
      console.log("❌ No currentUserId, skipping socket connection");
      return;
    }

    console.log("🔌 Creating socket connection for user:", currentUserId);
    const socket = createSocketConnection();
    socketRef.current = socket;

    // Listen for connection events
    socket.on("connect", () => {
      console.log("✅ Socket connected with ID:", socket.id);

      // Register user with their ID
      socket.emit("register", { userId: currentUserId });
      console.log("📝 Registered user:", currentUserId);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    // Handle incoming messages
    const handleReceiveMessage = ({ newMsg, senderId, firstName }) => {
      console.log("📩 Received message:", {
        text: newMsg.text,
        from: firstName,
        senderId: senderId,
        timestamp: new Date().toISOString(),
      });

      // Add message to the correct chat using senderId
      setMessages((prev) => {
        const updated = {
          ...prev,
          [senderId]: [...(prev[senderId] || []), newMsg],
        };
        console.log("💾 Updated messages state for senderId:", senderId);
        return updated;
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      console.log("🔌 Cleaning up socket connection");
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [currentUserId]); // Only depend on currentUserId, not targetUserId

  const handleSendMessage = () => {
    if (message.trim() && selectedChat && socketRef.current) {
      const newMsg = {
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: "me",
      };

      console.log("📤 Sending message:", {
        from: currentUserId,
        to: selectedChat._id,
        text: newMsg.text,
        socketConnected: socketRef.current.connected,
      });

      // Emit message using the stored socket reference
      socketRef.current.emit("sendMessage", {
        currentUserId,
        targetUserId: selectedChat._id,
        newMsg,
        firstName: currentUser.firstName,
      });

      // Update local state immediately for instant feedback
      setMessages((prev) => ({
        ...prev,
        [selectedChat._id]: [...(prev[selectedChat._id] || []), newMsg],
      }));

      setMessage("");
    } else {
      console.warn("⚠️ Cannot send message:", {
        hasMessage: !!message.trim(),
        hasSelectedChat: !!selectedChat,
        hasSocket: !!socketRef.current,
        socketConnected: socketRef.current?.connected,
      });
    }
  };

  const handleSelectChat = (con) => {
    console.log("💬 Selected chat:", con._id, con.firstName);
    setSelectedChat(con);
    setShowSidebar(false);
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    setSelectedChat(null);
  };

  const fetchConnections = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(Base_URL + "/user/connection", {
        withCredentials: true,
      });
      console.log("Connections fetched:", response.data);
      dispatch(setConnections(response.data.data));
      dispatch(setLoading(false));
    } catch (err) {
      console.log("Error fetching connections:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredConnections = connection.filter(
    (con) =>
      con && con.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[70vh] w-11/12 rounded-2xl bg-gray-50 overflow-hidden">
      {/* Sidebar - Responsive */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex w-full md:w-96 bg-white border-r border-gray-200 flex-col`}
      >
        {/* User Profile Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
                src={currentUser?.photoUrl}
                alt={currentUser?.firstName}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900 text-sm md:text-base">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 md:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-sm bg-gray-100 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConnections.map((con) => (
            <div
              key={con._id}
              onClick={() => handleSelectChat(con)}
              className={`flex items-center gap-3 p-3 md:p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                selectedChat?._id === con._id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover"
                  src={con?.photoUrl}
                  alt={con?.firstName}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h2 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                    {con?.firstName} {con?.lastName}
                  </h2>
                  <span className="text-xs text-gray-500 ml-2">
                    {messages[con._id]?.[messages[con._id].length - 1]?.time ||
                      ""}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {messages[con._id]?.[messages[con._id].length - 1]?.text ||
                    "Start chatting..."}
                </p>
              </div>
              {con.unread > 0 && (
                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">
                    {con.unread}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area - Responsive */}
      <div
        className={`${
          !showSidebar ? "flex" : "hidden"
        } md:flex flex-1 flex-col`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative">
                    <img
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                      src={selectedChat?.photoUrl}
                      alt={selectedChat?.firstName}
                    />
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm md:text-base text-gray-900">
                      {selectedChat?.firstName} {selectedChat?.lastName}
                    </h2>
                  </div>
                </div>
                <div className="flex gap-1 md:gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 bg-gray-50">
              {messages[selectedChat._id]?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "me" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-md px-3 md:px-4 py-2 rounded-2xl ${
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

              {(!messages[selectedChat._id] ||
                messages[selectedChat._id].length === 0) && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Send a message to {selectedChat.firstName} to get started
                  </p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3 relative">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex">
                  <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex">
                  <Smile
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-10 left-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(emojiObject) =>
                        setMessage((prev) => prev + emojiObject.emoji)
                      }
                      style={{
                        height: "350px",
                        width: "350px",
                      }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm bg-gray-100 text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2.5 md:p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg">
              <Send className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Welcome to Messages
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-md px-4">
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
