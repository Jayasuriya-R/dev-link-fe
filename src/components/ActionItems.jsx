import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { actionItemPrompt } from "../utils/constants";

const ActionItemCard = ({ data }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{data.title}</h2>
          <span className="badge badge-xs badge-warning">
            {data.difficulty}
          </span>
        </div>
        <div>
          <p>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

const ActionItems = () => {
  const missingSkills = useSelector(
    (state) => state.skillAnalysisData.text.missingSkills
  );
  const [actionData, setActionData] = useState(null);
  const missingSkillsArray = missingSkills.map((s) => s.skill);

  useEffect(() => {
    if (missingSkillsArray.length > 0) {
      actionItems();
    }
  }, []);

  const actionItems = async () => {
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
                content: actionItemPrompt,
              },
              {
                role: "user",
                content: missingSkillsArray.join(", "),
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

      // Clean up response if needed
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(responseText);
      setActionData(parsed[0]);
    } catch (err) {
      console.error("Error fetching skill analysis:", err);
    } finally {
    }
  };
  return <div>{actionData && <ActionItemCard data={actionData} />}</div>;
};

export default ActionItems;
