import React, { useState, useMemo } from 'react';
import type { Assessment } from '../types';
import { IconCheckCircle } from './Icons';

interface AssessmentFormProps {
  assessment: Assessment;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ assessment }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers({ ...answers, [questionIndex]: value });
    setScore(null); // Reset score if answers change
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setScore(totalScore);
  };

  const result = useMemo(() => {
    if (score === null) return null;
    return assessment.scoring.find(
      ({ range }) => score >= range[0] && score <= range[1]
    );
  }, [score, assessment.scoring]);
  
  const allQuestionsAnswered = Object.keys(answers).length === assessment.questions.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900">{assessment.title}</h1>
        <p className="mt-2 text-slate-600">{assessment.description}</p>
        
        <div className="mt-6 p-4 themed-alert-warning rounded-r-lg">
            <p className="font-bold">Important Disclaimer</p>
            <p className="text-sm">{assessment.disclaimer}</p>
        </div>

        <div className="mt-8 space-y-8">
          {assessment.questions.map((q, index) => (
            <fieldset key={index} className="p-4 border border-slate-200 rounded-lg">
              <legend className="text-lg font-semibold text-slate-800 mb-4">{index + 1}. {q.text}</legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {q.options.map((option) => (
                  <label key={option.value} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${answers[index] === option.value ? 'bg-primary-light ring-2 ring-primary' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option.value}
                      checked={answers[index] === option.value}
                      onChange={() => handleAnswerChange(index, option.value)}
                      className="w-4 h-4 text-primary bg-slate-200 border-slate-300 focus:ring-primary"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-700">{option.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        
        <div className="mt-8 text-center">
            <button
                onClick={calculateScore}
                disabled={!allQuestionsAnswered}
                className="bg-primary text-white font-bold py-3 px-8 rounded-full bg-primary-hover disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
                Calculate Score
            </button>
        </div>

        {result && score !== null && (
          <div className="mt-8 p-6 bg-primary-light border-l-4 border-primary rounded-r-lg animate-fade-in">
            <div className="flex items-start">
              <IconCheckCircle className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-primary-text">Your Result</h3>
                <p className="text-xl mt-2">Total Score: <span className="font-extrabold">{score}</span></p>
                <p className="text-xl">Severity Level: <span className="font-extrabold">{result.level}</span></p>
                <p className="mt-4 text-primary-text">{result.interpretation}</p>
              </div>
            </div>
          </div>
        )}
        
        <p className="mt-8 text-xs text-center text-slate-500">{assessment.sourceInfo} Cutoffs and interpretations should be validated for specific populations and contexts. This is a reference implementation.</p>

      </div>
    </div>
  );
};

export default AssessmentForm;