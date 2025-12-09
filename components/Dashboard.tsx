import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Layers, ArrowRight, Brain, Clock } from 'lucide-react';
import { useStudyContext } from '../context/StudyContext';

export const Dashboard: React.FC = () => {
  const { studyTime, topicsMastered } = useStudyContext();

  // Helper to format seconds into readable string
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${seconds}s`; // Show seconds if less than a minute
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Student</h1>
        <p className="text-slate-500 text-lg">Ready to expand your knowledge today?</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Topics Mastered", value: topicsMastered.toString(), icon: Brain, color: "bg-emerald-100 text-emerald-600" },
          { label: "Study Time", value: formatTime(studyTime), icon: Clock, color: "bg-blue-100 text-blue-600" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-slate-800 pt-4">Start Learning</h2>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          to="/explain"
          title="Deep Dive"
          description="Get comprehensive explanations for any complex topic suited to your level."
          icon={BookOpen}
          color="indigo"
        />
        <FeatureCard 
          to="/quiz"
          title="Quiz Master"
          description="Generate instant multiple-choice quizzes to test your knowledge retention."
          icon={GraduationCap}
          color="violet"
        />
        <FeatureCard 
          to="/flashcards"
          title="Flashcard Forge"
          description="Create study sets instantly to memorize key terms and definitions."
          icon={Layers}
          color="pink"
        />
      </div>

      {/* Recent Activity (Mock) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { title: "Photosynthesis Explanation", type: "Deep Dive", time: "2 hours ago" },
            { title: "World War II Quiz", type: "Quiz (80%)", time: "Yesterday" },
            { title: "Spanish Vocabulary", type: "Flashcards", time: "2 days ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  {item.type.includes("Quiz") ? <GraduationCap size={18} /> : item.type.includes("Dive") ? <BookOpen size={18} /> : <Layers size={18} />}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.type}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ to: string, title: string, description: string, icon: any, color: string }> = ({ 
  to, title, description, icon: Icon, color 
}) => {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    pink: "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
  };

  return (
    <Link to={to} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 flex-grow">{description}</p>
      <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:gap-2 transition-all">
        Try now <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
    </Link>
  );
};