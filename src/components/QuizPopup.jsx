import { X } from "lucide-react";
import React, { useState } from "react";

const QuizPopup = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = () => {
    if (selected === null) return;

    if (selected === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    if (current === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrent((prev) => prev + 1);
    }

    setSelected(null);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };


  // Proficiency logic
  let proficiency = "";
  if (score <= 4) proficiency = "Beginner 🚧";
  else if (score <= 7) proficiency = "Intermediate ⚡";
  else proficiency = "Advanced 🚀";

  return (
      <div className="bg-base-300 lg:w-[500px] w-[350px] p-6 rounded-xl shadow-lg relative">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 btn btn-sm btn-circle"
          onClick={() => document.getElementById("quiz-modal").close()}
        >
          <X className="w-5 h-5 hover:scale-110 transition cursor-pointer" />
        </button>

        {/* Quiz Finished Screen */}
        {finished ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Quiz Completed 🎉</h2>
            <p className="text-lg">
              Your Score: <span className="font-semibold">{score}/10</span>
            </p>
            <p className="text-xl">Proficiency: {proficiency}</p>

            {/* Suggestions */}
            <p className="mt-4">
              {proficiency === "Beginner 🚧" &&
                "Focus on your fundamentals. Revisit core concepts and try small coding challenges daily."}
              {proficiency === "Intermediate ⚡" &&
                "You're doing great! Improve consistency and try building slightly complex projects."}
              {proficiency === "Advanced 🚀" &&
                "Strong skills! Start contributing to open-source, architecture design, and mentorship."}
            </p>

            <button className="btn btn-primary mt-4" onClick={restartQuiz}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Question */}
            <h2 className="text-xl font-semibold mb-2">
              Question {current + 1} / {questions.length}
            </h2>
            <p className="mb-4">{questions[current].question}</p>

            {/* Options */}
            <div className="space-y-2">
              {questions[current].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(index)}
                  className={`btn btn-block ${
                    selected === index ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              className="btn btn-secondary btn-lg w-full mt-5"
              onClick={handleAnswer}
            >
              {current === questions.length - 1 ? "Finish Quiz" : "Next"}
            </button>
          </>
        )}
      </div>
  );
};

export default QuizPopup;
