import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import Nav from '../components/Nav';

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve score details from navigate state:
  // { score: number, total: number, correct: number }
  const { score, total, correct } = location.state || {};

  // If score details aren't provided, ask user to take the quiz first
  if (score === undefined || total === undefined || correct === undefined) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Score Available</h1>
        <p className="text-gray-600 mb-4">Please take the quiz before viewing your score.</p>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Quiz
        </button>
      </div>
    );
  }

  // Determine grade based on score percentage
  let grade = '';
  if (score >= 90) grade = 'O';
  else if (score >= 80) grade = 'E';
  else if (score >= 70) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'F';

  return (
    <>
    <Nav />
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Score Summary */}
      <div className="p-6 bg-white border rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CheckBadgeIcon className="w-6 h-6 text-indigo-600" />
          Your Quiz Score
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">Correct Answers</p>
            <p className="text-2xl font-semibold text-gray-800">{correct}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">Total Questions</p>
            <p className="text-2xl font-semibold text-gray-800">{total}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">Score Percentage</p>
            <p className="text-2xl font-semibold text-gray-800">{score.toFixed(2)}%</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-xs font-medium text-indigo-600 mb-1">Grade</p>
            <p className="text-2xl font-semibold text-indigo-600">{grade}</p>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="text-center">
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    </div>
    </>
  );
};

export default ScorePage;
