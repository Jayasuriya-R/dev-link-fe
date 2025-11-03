import React from "react";
import { MessageCircle, X } from "lucide-react";
import { Send } from "lucide-react";
import { input } from "framer-motion/client";
import { systemPrompt } from "../utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AiChat = () => {
  const [messages, setMessage] = React.useState([
    { user: false, text: "How can I assist you today?" },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState("");
  console.log("api key", import.meta.env.VITE_GEMINI_API_KEY);
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleSend = async () => {
    setMessage((prev) => [...prev, { user: true, text: input }]);
    setInput("");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent([
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: input }] },
      ]);

      const response = result.response.text();

      setMessage((prev) => [...prev, { user: false, text: response }]);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setMessage((prev) => [
        ...prev,
        { user: false, text: "⚠️ Sorry, I couldn’t respond right now." },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-25 left-10 z-50">
      {/* Tooltip & Chat Button */}
      <div className="tooltip tooltip-top" data-tip="Chat with AI">
        <button
          onClick={() => document.getElementById("my-modal").showModal()}
          className="btn btn-secondary btn-circle p-3 shadow-lg hover:scale-110 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Modal */}
      <dialog id="my-modal" className="modal">
        <div className="relative w-[400px] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div className="card bg-base-300 w-full h-[60vh] sm:h-[40vh] md:h-[500px] shadow-2xl rounded-2xl border border-base-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-base-200">
              <h3 className="font-semibold text-lg">DevBot 🤖</h3>
              <button
                onClick={() => document.getElementById("my-modal").close()}
              >
                <X className="w-5 h-5 hover:scale-110 transition cursor-pointer" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((msg, i) => {
                return (
                  <div
                    key={i}
                    className={`chat ${msg.user ? "chat-end" : "chat-start"}`}
                  >
                    <div
                      className={`chat-bubble ${
                        msg.user ? "chat-bubble-neutral" : "chat-bubble-primary"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-primary">
                    <span className="loading loading-dots loading-xs"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-base-200 border-t border-base-300 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="input input-bordered input-md flex-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                onClick={handleSend}
                className="btn btn-primary btn-md rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AiChat;
