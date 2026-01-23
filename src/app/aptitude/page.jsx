"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { evaluateResponses } from "@/utils/evaluateResponses";
import { useAssessment } from "@/app/context/AssessmentContext";

const AptitudeTest = () => {
  const router = useRouter();
  const { setUserProfile } = useAssessment();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());

  // ✅ Fetch Questions
useEffect(() => {
  fetch("http://localhost:5000/api/questions")
    .then(res => {
      if (!res.ok) {
        throw new Error("API failed");
      }
      return res.json();
    })
    .then(data => setQuestions(data))
    .catch(err => {
      console.error("Fetch error:", err);
    });
}, []);


  // ✅ Group Questions by Section
  const sections = useMemo(() => {
    if (!questions.length) return [];
    return Object.values(
      questions.reduce((acc, q) => {
        acc[q.section] ??= { title: q.section, questions: [] };
        acc[q.section].questions.push(q);
        return acc;
      }, {})
    );
  }, [questions]);

  if (!sections.length) {
    return <div className="p-6">Loading questions...</div>;
  }

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const isPersonalityQuestion =
    typeof currentQuestion.options[0] === "object";

  // ✅ Progress
  const totalQuestions = sections.reduce(
    (sum, sec) => sum + sec.questions.length,
    0
  );

  const totalAnswered = Object.keys(answers).length;
  const overallProgress = Math.round(
    (totalAnswered / totalQuestions) * 100
  );

  const sectionProgress = sections.map(section => {
    const completed = section.questions.filter(
      q => answers[q.id] !== undefined
    ).length;
    return {
      title: section.title,
      percentage: Math.round(
        (completed / section.questions.length) * 100
      )
    };
  });

  // ✅ Answer Handler
  const handleAnswerSelect = index => {
    setSelectedOption(index);

    const value = isPersonalityQuestion
      ? currentQuestion.options[index].label
      : index;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    setSkippedQuestions(prev => {
      const copy = new Set(prev);
      copy.delete(currentQuestion.id);
      return copy;
    });
  };

  // ✅ Navigation
  const handleNext = () => {
    if (selectedOption === null) return;
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < currentSection.questions.length) {
      setCurrentQuestionIndex(i => i + 1);
    } else if (currentSectionIndex + 1 < sections.length) {
      setCurrentSectionIndex(i => i + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1];
      setCurrentSectionIndex(i => i - 1);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
    }
  };

  const handleNotSure = () => {
    setSkippedQuestions(prev => new Set(prev).add(currentQuestion.id));
    setSelectedOption(null);
    handleNext();
  };

  // ✅ Submit
const handleSubmit = () => {
  const userProfile = evaluateResponses(answers);

  console.log("SUBMIT CLICKED");
  console.log("PROFILE:", userProfile);

  // ✅ SAVE RESULT LOCALLY
  localStorage.setItem(
    "aptitudeResult",
    JSON.stringify(userProfile)
  );

  // ✅ NAVIGATE TO RESULTS PAGE
  router.push("/results");
};



  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <h1 className="text-4xl font-semibold mb-1">Aptitude Test</h1>
      <p className="text-gray-500 mb-4">
        {sections.length} Sections · {totalQuestions} Questions
      </p>

{/* Section Banner */}
      <div className="flex justify-center items-center gap-4 bg-gradient-to-r from-teal-200 to-sky-200 rounded-xl px-6 py-4 mb-4">
            <img
                src="/aptitude/logical.png"
                alt="Test Icon"
                className="w-12 h-12 object-contain"
            />
            <div className="text-center">
                <h2 className="text-3xl font-semibold">{currentSection.title}</h2>
                <p className="text-lg">Section {currentSectionIndex + 1}</p>
            </div>
            </div>      

      {/* Progress Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-full h-8 bg-gray-200 rounded-full">
          <div
            className="h-8 bg-gradient-to-r from-teal-300 to-sky-600 rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <span className="font-semibold">{overallProgress}%</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Sections Panel */}
        <div className="lg:col-span-1 border rounded-xl p-4 h-[45vh] overflow-y-auto">
          <h3 className="font-semibold mb-3">Sections</h3>

          {sections.map((section, sIndex) => (
            <details key={section.title} open={sIndex === currentSectionIndex} className="mb-4">
              <summary className="cursor-pointer font-medium">
                {section.title}
              </summary>

              <div className="grid grid-cols-5 gap-2 mt-3">
                {section.questions.map((q, qIndex) => {
                  const answered = answers[q.id] !== undefined;
                  const skipped = skippedQuestions.has(q.id);

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentSectionIndex(sIndex);
                        setCurrentQuestionIndex(qIndex);
                        setSelectedOption(
                          typeof answers[q.id] === "number"
                            ? answers[q.id]
                            : null
                        );
                      }}
                      className={`h-8 w-8 rounded text-sm font-medium
                        ${answered ? "bg-green-400 text-white"
                        : skipped ? "bg-yellow-400 text-black"
                        : "bg-gray-200"} hover:scale-105 transition-transform`}
                    >
                      {qIndex + 1}
                    </button>
                  );
                })}
              </div>
            </details>
          ))}
        </div>

        {/* Question */}
        <div className="lg:col-span-3 border rounded-xl p-6 h-[45vh] overflow-y-auto">
          <h3 className="font-semibold mb-4">
            {currentQuestion.question}
          </h3>

          {currentQuestion.options.map((option, i) => (
            <label key={i} className="flex gap-2 mb-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedOption === i}
                onChange={() => handleAnswerSelect(i)}
              />
              <span>
                {isPersonalityQuestion ? option.label : option}
              </span>
            </label>
          ))}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePrevious}
              className="w-1/3 py-3 bg-gray-200 rounded-xl"
            >
              ← Previous
            </button>

            <button
              onClick={handleNotSure}
              className="w-1/3 py-3 bg-yellow-300 rounded-xl"
            >
              Not Sure
            </button>

            <button
              onClick={handleNext}
              className="w-1/3 py-3 bg-gradient-to-r from-teal-200 to-sky-200 rounded-xl"
            >
              Next →
            </button>
          </div>

        {currentSectionIndex === sections.length - 1 &&
          currentQuestionIndex === currentSection.questions.length - 1 && (
            <button
              onClick={handleSubmit}
              className="mt-3 w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
            >
              Submit Test
            </button>
          )}          
        </div>

        {/* Skill Progress */}
        <div className="lg:col-span-1 bg-sky-100 rounded-xl p-4 space-y-4 h-[40vh] overflow-y-auto">

          {sectionProgress.map(sec => (
            <div key={sec.title}>
              <div className="flex justify-between text-sm mt-4">
                <span>{sec.title}</span>
                <span>{sec.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-white rounded-full mt-2">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${sec.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;
