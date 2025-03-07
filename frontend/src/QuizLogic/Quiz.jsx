import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../components/Store"; // Import Zustand store
import Nav from "../components/Nav";

const API_KEY = "w9MCe67fIaMN4PT4koycxNt6ae50XVXG"; // Replace with your key
const API_URL = "https://api.mistral.ai/v1/chat/completions";

const QuizApp = () => {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);

  const navigate = useNavigate();

  const categories = useAuthStore((state) => state.categories);
  const difficulty = useAuthStore((state) => state.difficulty);
  const optionsCount = useAuthStore((state) => state.optionsCount);
  const questionCount = useAuthStore((state) => state.questionCount);
  const timePerQuestion = useAuthStore((state) => state.timePerQuestion);

  // Fetch quiz questions from the API
  const fetchQuiz = async () => {
    if (categories.length === 0) {
      alert("Please select at least one category!");
      return;
    }

    setLoading(true);
    const categoryString = categories.join(", ");

    const prompt = `
      Generate a ${difficulty} level multiple-choice quiz with ${questionCount} questions.
      Each question should have ${optionsCount} answer options.
      The quiz should be based on these categories: ${categoryString}.
      The time limit for each question is ${timePerQuestion} seconds.
      Provide a JSON response with "question", "options", and "correct_answer" fields, without extra text.
    `;

    try {
      const response = await axios.post(
        API_URL,
        {
          model: "mistral-large-2411",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      let rawContent = response.data.choices[0]?.message?.content?.trim();
      if (!rawContent) {
        console.error("API response is empty or incorrect:", response.data);
        return;
      }

      // Extract JSON part (between the first '[' and last ']')
      const startIdx = rawContent.indexOf("[");
      const endIdx = rawContent.lastIndexOf("]");
      if (startIdx === -1 || endIdx === -1) {
        console.error("JSON not found in response:", rawContent);
        return;
      }
      const jsonContent = rawContent.substring(startIdx, endIdx + 1);

      try {
        const questions = JSON.parse(jsonContent);
        setQuiz(questions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]); // Reset any previous answers
        console.log("Parsed Quiz:", questions);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError, "Extracted JSON:", jsonContent);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }

    setLoading(false);
  };

  // Initialize or reset the timer for each question
  useEffect(() => {
    if (quiz.length > 0) {
      setRemainingTime(timePerQuestion);
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto move to next question if time is up
            handleNextQuestion();
            return timePerQuestion;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, quiz, timePerQuestion]);

  // Save the selected answer for the current question
  const handleOptionSelect = (option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  // Move to the next question or finish the quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      let correctCount = 0;
      quiz.forEach((q, i) => {
        if (selectedAnswers[i] === q.correct_answer) {
          correctCount++;
        }
      });
      const percentage = (correctCount / quiz.length) * 100;
      navigate("/score", {
        state: { score: percentage, total: quiz.length, correct: correctCount },
      });
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {quiz.length === 0 ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Quiz Configuration</h2>
              <div className="mb-8 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Selected Categories:</span> {categories.join(", ") || "None"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Difficulty:</span> {difficulty}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Options per Question:</span> {optionsCount}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Total Questions:</span> {questionCount}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Time per Question:</span> {timePerQuestion}s
                </p>
              </div>
              <button
                onClick={fetchQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
              >
                {loading ? "Loading..." : "Generate Quiz"}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Question {currentQuestionIndex + 1} of {quiz.length}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Time Remaining: <span className="font-semibold">{remainingTime}s</span>
                  </div>
                </div>
                <p className="text-xl text-gray-800 mb-6">{quiz[currentQuestionIndex].question}</p>
                <div className="grid gap-4">
                  {quiz[currentQuestionIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(opt)}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors 
                        ${selectedAnswers[currentQuestionIndex] === opt ? "bg-indigo-200 border-indigo-600" : "bg-white hover:bg-gray-50"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] == null}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {currentQuestionIndex === quiz.length - 1 ? "Submit Quiz" : "Next Question"}
                </button>
              </div>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">
                  {currentQuestionIndex + 1} / {quiz.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizApp;
