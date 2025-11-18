import React, { useRef, useState } from "react";
import { Brain, Send } from "lucide-react";
import { AiMentorPrompt } from "../utils/constants";
import SkillAnalyse from "./SkillAnalyse";
import { useSelector } from "react-redux";
import ActionItems from "./ActionItems";

const AiMentor = () => {
  const [messages, setMessages] = useState([
    {
      text: "How can I assist you today..🚀",
      type: "message",
      role: "ai",
    },
  ]);
  const [chat, setChat] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");
  const curUser = useSelector((state) => state.auth.currentUser);

  const handleSend = () => {
    if (!chat.trim()) return;
    
    const msg = {
      text: chat,
      type: "message",
      role: "user",
    };

    setMessages((prev) => [...prev, msg]);
    const userMessage = chat;
    setChat("");
    AIResponse(userMessage);
  };

  const AIResponse = async (userMessage) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: AiMentorPrompt,
              },
              {
                role: "user",
                content: userMessage,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let responseText = data.choices[0].message.content;

      const parsed = JSON.parse(responseText);
      setLoading(false);
      setMessages((prev) => [...prev, parsed]);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="w-full  p-4 bg-base-100">
      <div className="max-w-[1200px] mx-auto  flex flex-col " style={{ height: 'calc(100vh - 2rem)' }}>
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Left Column - Chat */}
          <div className="col-span-7 flex flex-col min-h-0">
            <div className="card bg-base-300 shadow-sm flex-1 flex flex-col min-h-0">
              {/* Header */}
              <div className="flex space-x-2.5 p-3 border-b-2 border-base-100 bg-base-200 flex-shrink-0">
                <Brain className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_#4ade80]" />
                <h2 className="text-3xl font-bold">Mentor</h2>
              </div>

              {/* Messages - Scrollable */}
              <div className="flex-1 p-4 overflow-y-auto min-h-0">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`chat ${
                      m.role !== "ai" ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div
                      className={`chat-bubble ${
                        m.role !== "ai"
                          ? "chat-bubble-neutral"
                          : "chat-bubble-primary"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">
                      <span className="loading loading-dots loading-xs"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input - Fixed at Bottom */}
              <div className="p-4 pt-0 flex-shrink-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input bg-base-100 w-full"
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    className="btn btn-primary btn-md rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
                    onClick={handleSend}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs */}
          <div className="col-span-5 flex flex-col min-h-0">
            <div className="card bg-base-300 shadow-sm flex-1 flex flex-col min-h-0">
              {/* Tab Headers */}
              <div className="flex border-b-2 p-3 border-base-100 bg-base-200 flex-shrink-0">
                <button
                  className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors ${
                    activeTab === "skills"
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-100"
                  }`}
                  onClick={() => setActiveTab("skills")}
                >
                  Skill Analysis
                </button>
                <button
                  className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors ${
                    activeTab === "actions"
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-100"
                  }`}
                  onClick={() => setActiveTab("actions")}
                >
                  Action Items
                </button>
                <button
                  className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors ${
                    activeTab === "roadmap"
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-100"
                  }`}
                  onClick={() => setActiveTab("roadmap")}
                >
                  Road Map
                </button>
              </div>

              {/* Tab Content - Scrollable */}
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="h-full p-4">
                  {activeTab === "skills" && (
                    <SkillAnalyse skills={curUser?.skills} />
                  )}
                  {activeTab === "actions" && (
                    <div className="h-full overflow-y-auto">
                      <h3 className="text-xl font-bold mb-4">Action Items</h3>
                      <p className="text-base-content/70">
                        <ActionItems/>
                      </p>
                    </div>
                  )}
                  {activeTab === "roadmap" && (
                    <div className="h-full overflow-y-auto">
                      <h3 className="text-xl font-bold mb-4">Road Map</h3>
                      <p className="text-base-content/70">
                        Your learning roadmap will appear here...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMentor;