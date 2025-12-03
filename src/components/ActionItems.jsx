import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionItemPrompt } from "../utils/constants";
import { AlertCircle, CheckCircle2, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { addActionItem } from "../Store/actionItemSlice";

const ActionItemCard = ({ data }) => {
  const [completed, setCompleted] = useState(0);
  const [checkedItems, setCheckedItems] = useState(new Set());
  

  const handleChecked = (e, index) => {
    const newCheckedItems = new Set(checkedItems);
    
    if (e.target.checked) {
      newCheckedItems.add(index);
    } else {
      newCheckedItems.delete(index);
    }
    
    setCheckedItems(newCheckedItems);
    setCompleted(newCheckedItems.size);
  };

  const progressPercentage = data.subtasks.length > 0 
    ? (completed / data.subtasks.length) * 100 
    : 0;

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "badge-success",
      medium: "badge-warning",
      hard: "badge-error"
    };
    return colors[difficulty?.toLowerCase()] || "badge-warning";
  };

  
  return (
    <div className="card w-full max-w-2xl bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h2 className="lg:text-2xl text-lg  font-bold flex-1">{data.title}</h2>
          <span className={`badge ${getDifficultyColor(data.difficulty)} lg:badge-lg badge-sm`}>
            {data.difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-base-content/80 mb-4">{data.description}</p>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-semibold">
              {completed} / {data.subtasks.length} completed
            </span>
          </div>
          <progress
            className="progress progress-warning w-full"
            value={progressPercentage}
            max="100"
          />
        </div>

        {/* Subtasks Collapse */}
        <div className="collapse collapse-plus bg-base-200 rounded-lg mb-3">
          <input type="checkbox" name="subtasks" />
          <div className="collapse-title font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Sub-Tasks ({data.subtasks.length})
          </div>
          <div className="collapse-content max-h-64 overflow-y-auto">
            <div className="space-y-3 pt-2">
              {data.subtasks.map((task, index) => (
                <label
                  key={index}
                  className="flex  items-center gap-3 cursor-pointer hover:bg-base-300 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning mt-1"
                    checked={checkedItems.has(index)}
                    onChange={(e) => handleChecked(e, index)}
                  />
                  <span className={checkedItems.has(index) ? "line-through opacity-60" : ""}>
                    {task.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Collapse */}
        <div className="collapse collapse-plus bg-base-200 rounded-lg mb-3">
          <input type="checkbox" name="resources" />
          <div className="collapse-title font-semibold flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Resources ({data.resources.length})
          </div>
          <div className="collapse-content max-h-64 overflow-y-auto">
            <div className="space-y-2 pt-2">
              {data.resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-2 hover:bg-base-300 rounded transition-colors"
                >
                  <span className="flex-1">{resource.label}</span>
                  <Link
                    to={resource.url}
                    className="btn btn-sm btn-ghost btn-circle"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Link2 className="w-5 h-5 text-success hover:text-success-focus" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Tip */}
        <div role="alert" className="alert alert-info">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{data.ai_tip}</span>
        </div>
      </div>
    </div>
  );
};

const ActionItems = () => {
  const [actionData, setActionData] = useState(null);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const missingSkills = useSelector(
    (state) => state.skillAnalysisData.text.missingSkills
  );

  const actionItemData = useSelector(state => state.actionItem)
  
  const missingSkillsArray = missingSkills.map((s) => s.skill);


  useEffect(() => {
    if (missingSkillsArray.length > 0) {
      if (Object.entries(actionItemData).length === 0) {
        actionItems();
      } else {
        setActionData(actionItemData);
      }
    }
  }, []);

  const actionItems = async () => {
    try {
      setLoading(true)
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
      dispatch(addActionItem(parsed[0]))
      setLoading(false)
    } catch (err) {
      console.error("Error fetching skill analysis:", err);
    } finally {
      setLoading(false)
    }
  };

    if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg font-medium">
          Generating your personalized Action Items...
        </p>
      </div>
    );
  }

  return <div>{actionData && <ActionItemCard data={actionData} />}</div>;
};

export default ActionItems;

