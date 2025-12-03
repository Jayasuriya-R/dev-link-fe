import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ClipboardList,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import QuizPopup from "./QuizPopup";
import { skillAnalysisPrompt } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addAnalysedData } from "../Store/skillAnalyseSlice";

const SkillAnalyse = ({ skills }) => {
  const [skillAnalysis, setSkillAnalysis] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const analysedData = useSelector((state) => state.skillAnalysisData);

  useEffect(() => {
    if (skills && skills.length > 0) {
      if (Object.entries(analysedData).length === 0) {
        SkillAnalysis_quiz();
      } else {
        setSkillAnalysis(analysedData);
      }
    }
  }, [skills]);

  const SkillAnalysis_quiz = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
                content: skillAnalysisPrompt,
              },
              {
                role: "user",
                content: skills.join(", "),
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
      setSkillAnalysis(parsed);
      dispatch(addAnalysedData(parsed));
    } catch (err) {
      console.error("Error fetching skill analysis:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe access to nested data
  const greeting = skillAnalysis?.text?.greeting || skillAnalysis?.greeting;
  const profession =
    skillAnalysis?.text?.profession || skillAnalysis?.profession;
  const missingSkills =
    skillAnalysis?.text?.missingSkills || skillAnalysis?.missingSkills || [];
  const quiz = skillAnalysis?.text?.quiz || skillAnalysis?.quiz || [];

  return (
    <>
      <div className="flex flex-col gap-4 pb-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="text-sm text-base-content/70">
                Analyzing your skills...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to analyze skills: {error}</span>
          </div>
        )}

        {/* Greeting Card */}
        {greeting && !isLoading && (
          <div className="alert bg-gradient-to-r  from-primary/10 to-secondary/10 border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              {profession && (
                <p className="text-sm text-base-content/70">{profession}</p>
              )}
              <h3 className="font-semibold">{greeting}</h3>
            </div>
          </div>
        )}

        {/* Current Skills Collapse */}
        <div className="collapse collapse-arrow bg-base-300 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <input type="radio" name="skills-accordion" />
          <div className="collapse-title font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Current Skills
            <span className="badge badge-success badge-sm ml-auto">
              {skills?.length || 0}
            </span>
          </div>
          <div className="collapse-content">
            <div className="flex flex-wrap gap-2 pt-2 max-h-40 overflow-y-auto pr-1">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div
                    key={index}
                    className="badge lg:badge-lg badge:sm badge-success gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {skill}
                  </div>
                ))
              ) : (
                <p className="text-sm text-base-content/60">
                  No skills added yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Missing Skills Collapse */}
        {!isLoading && (
          <div className="collapse collapse-arrow bg-base-300 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
            <input type="radio" name="skills-accordion" />
            <div className="collapse-title  font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Skills to Level Up
              {missingSkills.length > 0 && (
                <span className="badge badge-warning lg:badge-sm badge-xs ml-auto">
                  {missingSkills.length} recommended
                </span>
              )}
            </div>
            <div className="collapse-content">
              <div className="space-y-3 pt-2 max-h-64 overflow-y-auto pr-1">
                {missingSkills.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-base-100 rounded-lg border border-base-200 hover:border-warning/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {item.skill}
                        </h4>
                        <p className="text-xs text-base-content/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {!isLoading && quiz.length > 0 && (
          <>
            <div className="divider text-xs">Test Your Knowledge</div>

            <div
              className="group cursor-pointer p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => {
                document.getElementById("quiz-modal").showModal();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    Take a Quick {quiz.length}-Question Quiz
                  </h3>
                  <p className="text-xs text-base-content/70">
                    Test your knowledge and discover areas for improvement
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Stats Card Accordion */}
        {!isLoading &&
          skills &&
          skills.length > 0 &&
          missingSkills.length > 0 && (
            <div className="collapse collapse-arrow bg-base-300 border border-base-200 shadow-sm hover:shadow-md transition-all">
              <input type="radio" name="skills-accordion" />

              <div className="collapse-title font-semibold flex items-center gap-2">
                📊 Stats Overview
                <span className="badge badge-primary badge-sm ml-auto">
                  {Math.round(
                    (skills.length / (skills.length + missingSkills.length)) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="collapse-content">
                <div className="stats stats-vertical flex justify-evenly shadow bg-base-200 max-h-64 overflow-y-auto rounded-lg">
                  <div className="stat place-items-center py-3">
                    <div className="stat-title text-xs">Current Skills</div>
                    <div className="stat-value text-xl text-success">
                      {skills.length}
                    </div>
                  </div>

                  <div className="stat place-items-center py-3">
                    <div className="stat-title text-xs">To Learn</div>
                    <div className="stat-value text-xl text-warning">
                      {missingSkills.length}
                    </div>
                  </div>

                  <div className="stat place-items-center py-3">
                    <div className="stat-title text-xs">Completion</div>
                    <div className="stat-value text-xl text-primary">
                      {Math.round(
                        (skills.length /
                          (skills.length + missingSkills.length)) *
                          100
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Quiz Modal */}
      {quiz.length > 0 && (
        <dialog id="quiz-modal" className="modal">
          <QuizPopup questions={quiz} />
        </dialog>
      )}
    </>
  );
};

export default SkillAnalyse;
