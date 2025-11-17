import React, { useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { Send } from "lucide-react";
import { systemPrompt } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../Store/aiChatSlice";

const AiChat = () => {
  const messages = useSelector((state) => state.aiChat);
  const loggedInUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const dialogEl = document.getElementById("my-modal");
    const scrollToBottom = () => {
      setTimeout(
        () => chatRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    };
    dialogEl.addEventListener("click", scrollToBottom);
    return () => dialogEl.removeEventListener("click", scrollToBottom);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    dispatch(addMessage({ user: true, text: userMessage }));
    setInput("");
    setLoading(true);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        // 🔥 Using Groq API
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
                  content: `${systemPrompt}

You are chatting with ${loggedInUser.firstName}. Here's their profile:
- Bio: ${loggedInUser.shortDescription}
- Skills: ${loggedInUser.skills.join(", ")}

Use this context to personalize your responses and provide relevant advice.`,
                },
                {
                  role: "user",
                  content: userMessage,
                },
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `API Error: ${response.status} - ${
              errorData.error?.message || response.statusText
            }`
          );
        }

        const data = await response.json();
        const responseText = data.choices[0].message.content;

        dispatch(addMessage({ user: false, text: responseText }));
        break; // Success, exit loop
      } catch (error) {
        attempt++;
        console.error(`AI Error (Attempt ${attempt}):`, error);

        if (error.message?.includes("429") && attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.pow(2, attempt) * 1000;
          dispatch(
            addMessage({
              user: false,
              text: `⏳ Rate limit hit. Retrying in ${waitTime / 1000}s...`,
            })
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else if (attempt >= maxRetries) {
          dispatch(
            addMessage({
              user: false,
              text: "⚠️ Sorry, I'm having trouble responding right now. Please try again in a moment.",
            })
          );
          break;
        } else {
          dispatch(
            addMessage({
              user: false,
              text: `⚠️ Error: ${error.message}`,
            })
          );
          break;
        }
      } finally {
        if (attempt >= maxRetries || attempt === 0) {
          setLoading(false);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-25 left-10 ">
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
            <div className="flex items-center justify-between p-3 border-b-2 border-base-100">
              <h3 className="font-bold text-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent ">
                DevMate 🤖⚡
              </h3>
              <button
                onClick={() => document.getElementById("my-modal").close()}
              >
                <X className="w-5 h-5 hover:scale-110 transition cursor-pointer" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
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
              ))}

              {loading && (
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-primary">
                    <span className="loading loading-dots loading-xs"></span>
                  </div>
                </div>
              )}

              {/* 👇 LAST ELEMENT FOR AUTO-SCROLL */}
              <div ref={chatRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-base-200 border-t rounded-b-2xl border-base-300 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="input input-bordered input-md flex-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="btn btn-primary btn-md rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-transform disabled:opacity-50"
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
