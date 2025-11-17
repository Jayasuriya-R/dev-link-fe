import React, { useRef, useState } from "react";
import { Brain, Send } from "lucide-react";
import { pipeline } from "@xenova/transformers";
import { AiMentorPrompt } from "../utils/constants";
import SkillAnalyse from "./SkillAnalyse";
import { useSelector } from "react-redux";

const AiMentor = () => {
  const [messages, setMessages] = useState([ {
      text: "How can i assist you today",
      type:"message",
      role: "ai",
    }]);
  const [chat, setChat] = useState("");
  const [loading, setLoading] = useState(false)
  const generatorRef = useRef(null);
  const curUser = useSelector((state) => state.auth.currentUser);
console.log(curUser)
  const handleSend = () => {
    const msg = {
      text: chat,
      type:"message",
      role: "user",
    };

    setMessages((prev) => [...prev, msg]);
    setChat("");
    AIResponse();
  };

  const AIResponse = async () => {
    setLoading(true)
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
                content: chat
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
     setLoading(false)
     setMessages((prev) => [...prev, parsed]);

    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  };

  console.log(messages)
  return (
    <div className="w-[1000px]">
      <div className="grid grid-cols-12 gap-x-4">
        <div className="grid col-span-7">
          <div className="card  bg-base-300 shadow-sm">
            <div className="flex space-x-2.5 p-3 border-b-2 border-base-100 bg-base-200 ">
              <Brain className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_#4ade80]" />

              <h2 className="text-3xl font-bold">Mentor</h2>
            </div>
            <div className="card-body">
              <div className="h-[45vh] overflow-y-scroll">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`chat ${m.role !== 'ai' ? "chat-end" : "chat-start"} `}
                  >
                    <div
                      className={`chat-bubble ${
                        m.role !== 'ai' ? "chat-bubble-neutral" : "chat-bubble-primary"
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
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              placeholder="Type here"
              className="input bg-base-100 w-full"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend}
            />
            <button
              className="btn btn-primary btn-md rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
              onClick={handleSend}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid col-span-5">
          <div className="tabs tabs-box p-2">
            <input
              type="radio"
              name="my_tabs_6"
              className="tab checked:bg-primary"
              aria-label="Skill Analysis"
            />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <SkillAnalyse skills={curUser?.skills} />
            </div>

            <input
              type="radio"
              name="my_tabs_6"
              className="tab checked:bg-primary"
              aria-label="Action Items"
              defaultChecked
            />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              Action Items
            </div>
            <input
              type="radio"
              name="my_tabs_6"
              className="tab checked:bg-primary"
              aria-label="Road Map"
              defaultChecked
            />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              Road Map
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMentor;
