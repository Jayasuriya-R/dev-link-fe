import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RoadMapPrompt } from "../utils/constants";
import { Target, Clock, CheckCircle2, AlertCircle, Trophy, X, AlarmClockCheck } from "lucide-react";
import { addRoadMap } from "../Store/roadMapSlice";

/**
 * PhaseCard Component
 * Displays a single phase in the roadmap timeline
 */
const PhaseCard = ({ phase, index, isEven }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <li>
        <div className="timeline-middle">
          <div className="bg-primary text-primary-content rounded-full p-1">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div
          className={`${
            isEven ? "timeline-start md:text-end" : "timeline-end"
          } mb-10`}
        >
          {/* Card */}
          <div 
            onClick={() => setIsOpen(true)}
            className="card bg-base-200 shadow-md hover:shadow-lg text-center transition-all cursor-pointer hover:scale-[1.02]"
          >
            <div className="card-body p-4">
              <div className="flex items-center gap-2">
                <time className="font-mono italic text-sm font-semibold text-warning">
                  {phase?.title}
                </time>
              </div>
              <h3 className="text-lg font-semibold mt-1 flex items-center gap-2">
                {phase?.phaseTitle}
              </h3>
            </div>
          </div>
        </div>

        <hr className="bg-primary/20" />
      </li>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card bg-base-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="card-body">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  <div>
                    <time className="font-mono italic text-sm font-semibold text-warning block">
                      {phase?.title}
                    </time>
                    <h3 className="text-2xl font-bold mt-1">
                      {phase?.phaseTitle}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="divider my-2"></div>

              {/* Bullets */}
              {phase?.bullets?.length > 0 && (
                <ul className="space-y-3 text-base mb-6">
                  {phase.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Outcome */}
              {phase?.outcome && (
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-start gap-3">
                    <Trophy className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-success text-xs uppercase tracking-wide mb-2">
                        Outcome
                      </p>
                      <p className="text-base">{phase.outcome}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="mt-6">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * RoadMapHeader Component
 * Displays the roadmap role and description
 */
const RoadMapHeader = ({ role, description }) => {
  return (
    <div className="card bg-base-100 shadow-lg mb-8">
      <div className="card-body">
        <h2 className="card-title lg:text-2xl text-lg text-center font-bold flex items-center gap-2">
          <AlarmClockCheck className="w-5 h-5 text-primary" />
          {role || "Your Learning Path"}
        </h2>
        {description && (
          <>
            <div className="divider my-2"></div>
            <p className="text-base-content/80">{description}</p>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * RoadMap Component
 * Main component that fetches and displays a personalized learning roadmap
 */
const RoadMap = () => {
  const [roadmap, setRoadMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()

  const curSkills = useSelector(
    (state) => state.auth?.currentUser?.skills || []
  );
  const missingSkills = useSelector(
    (state) => state.skillAnalysisData?.text?.missingSkills || []
  );

  const roadMapData = useSelector(state => state.roadMap);

  const missingSkillsArray = missingSkills.map((s) => s.skill);

  useEffect(() => {
    if (curSkills.length > 0 || missingSkillsArray.length > 0) {
      if (Object.entries(roadMapData).length === 0) {
        fetchRoadMapData();
      } else {
        setRoadMap(roadMapData);
      }
    }
  }, []);

  /**
   * Fetches roadmap data from the Groq API based on current and missing skills
   */
  const fetchRoadMapData = async () => {
    setLoading(true);
    setError(null);

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
                content: RoadMapPrompt,
              },
              {
                role: "user",
                content: `user skills are ${curSkills.join(
                  ","
                )} and their missing skills are ${missingSkillsArray.join(
                  ","
                )}`,
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

      // Clean up response - remove markdown code blocks
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(responseText);
      setRoadMap(parsed);
      dispatch(addRoadMap(parsed))
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg font-medium">
          Generating your personalized roadmap...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        role="alert"
        className="alert alert-error max-w-2xl mx-auto shadow-lg"
      >
        <AlertCircle className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Error loading roadmap</h3>
          <div className="text-sm">{error}</div>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={fetchRoadMapData}>
          Retry
        </button>
      </div>
    );
  }

  // No Data State
  if (!roadmap.phases && !loading) {
    return (
      <div
        role="alert"
        className="alert alert-warning max-w-2xl mx-auto shadow-lg"
      >
        <AlertCircle className="w-6 h-6" />
        <span>
          No roadmap available. Please complete the skill analysis first.
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-2 max-w-6xl">
      {/* Header Section */}
      <RoadMapHeader role={roadmap?.role} description={roadmap?.description} />

      {/* Timeline Section */}
      {roadmap?.phases && roadmap.phases.length > 0 ? (
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {roadmap.phases.map((phase, index) => (
            <PhaseCard
              key={index}
              phase={phase}
              index={index}
              isEven={index % 2 === 0}
            />
          ))}
        </ul>
      ) : (
        <div className="text-center p-8">
          <p className="text-base-content/60">No phases to display</p>
        </div>
      )}

      {/* Footer Stats */}
      {roadmap?.phases && roadmap.phases.length > 0 && (
        <div className="stats shadow-lg w-full mt-8">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Target className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Phases</div>
            <div className="stat-value text-primary">
              {roadmap.phases.length}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="stat-title">Target Role</div>
            <div className="stat-value text-lg">{roadmap?.role || "N/A"}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadMap;
