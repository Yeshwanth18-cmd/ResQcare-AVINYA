import React from 'react';
import { Link } from 'react-router-dom';

const AssessmentCard: React.FC<{ to: string; title: string; description: string; }> = ({ to, title, description }) => (
  <Link to={to} className="block bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <h3 className="text-2xl font-bold text-blue-600">{title}</h3>
    <p className="mt-2 text-slate-600">{description}</p>
    <div className="mt-6 text-blue-700 font-semibold">
      Start Screener &rarr;
    </div>
  </Link>
);


const Assessments: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Health Screeners</h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
        These confidential screening tools can help you understand your feelings better. They are not a diagnosis but can be a helpful starting point.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <AssessmentCard 
            to="/assessments/phq-9" 
            title="Depression Screener (PHQ-9)" 
            description="A 9-question tool to screen for symptoms of depression over the last two weeks."
        />
        <AssessmentCard 
            to="/assessments/gad-7" 
            title="Anxiety Screener (GAD-7)" 
            description="A 7-question tool to screen for symptoms of generalized anxiety disorder."
        />
      </div>
    </div>
  );
};

export default Assessments;