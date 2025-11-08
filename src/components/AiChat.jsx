import React, { useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { Send } from "lucide-react";
import { systemPrompt } from "../utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../Store/aiChatSlice";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
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
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  dialogEl.addEventListener("click", scrollToBottom); // fires when opened
  return () => dialogEl.removeEventListener("click", scrollToBottom);
}, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    dispatch(addMessage({ user: true, text: input }));
    setInput("");
    setLoading(true);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
          systemInstruction: systemPrompt,
        });
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are chatting with ${
                    loggedInUser.firstName
                  }, this is a small bio about the user : ${
                    loggedInUser.shortDescription
                  }.
                  Their skills include: ${loggedInUser.skills.join(
                    ", "
                  )}.Use this context to personalize your responses.User's message: ${input}`,
                },
              ],
            },
          ],
        });
        const responseText = result.response.text();
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
        } else {
          dispatch(
            addMessage({
              user: false,
              text: "⚠️ Rate limit exceeded. Please try again in a minute.",
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
