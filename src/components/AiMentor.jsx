import React, { useRef, useState } from "react";
import { Brain, Send } from "lucide-react";
import { pipeline } from "@xenova/transformers";

const AiMentor = () => {
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState("");
  const generatorRef = useRef(null);

  const handleSend = () => {
    const msg = {
      text: chat,
      user: true,
    };

    setMessages((prev) => [...prev, msg]);
    setChat("");
    AIResponse();
  };

  const AIResponse = async () => {
    try {
      // Create pipeline only once
      if (!generatorRef.current) {
        generatorRef.current = await pipeline(
          "text-generation",
          "Xenova/gpt2",
          { progress_callback: (p) => console.log(p) }
        );
      }

      const generator = generatorRef.current;

      const result = await generator(chat, { max_new_tokens: 50 });

      console.log(result);

      const msg = {
        text: result[0].generated_text,
        user: false,
      };

      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-[1000px]">
      <div className="grid grid-cols-12 gap-x-4">
        <div className="grid col-span-5">
          <div className="card w-96 bg-base-300 shadow-sm">
            <div className="flex space-x-2.5 p-3 border-b-2 border-base-100 bg-base-200 ">
              <Brain className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_#4ade80]" />

              <h2 className="text-3xl font-bold">Mentor</h2>
            </div>
            <div className="card-body">
              <div className="h-[45vh] overflow-y-scroll">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`chat ${m.user ? "chat-end" : "chat-start"} `}
                  >
                    <div
                      className={`chat-bubble ${
                        m.user ? "chat-bubble-neutral" : "chat-bubble-primary"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
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
        <div className="grid col-span-7">
          <div className="tabs tabs-box p-2">
            <input
              type="radio"
              name="my_tabs_6"
              className="tab checked:bg-primary"
              aria-label="Skill Analysis"
            />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              Skill Analysis
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMentor;
