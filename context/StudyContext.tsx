import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StudyContextType {
  studyTime: number; // in seconds
  topicsMastered: number;
  incrementTopicsMastered: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from local storage to persist data
  const [studyTime, setStudyTime] = useState(() => {
    const saved = localStorage.getItem('nero_study_time');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [topicsMastered, setTopicsMastered] = useState(() => {
    const saved = localStorage.getItem('nero_topics_mastered');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Timer logic: runs every second to track study time
  useEffect(() => {
    const interval = setInterval(() => {
      setStudyTime(prev => {
        const newValue = prev + 1;
        // Save to local storage periodically (every second here for simplicity, 
        // in production might want to throttle this)
        localStorage.setItem('nero_study_time', newValue.toString());
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const incrementTopicsMastered = () => {
    setTopicsMastered(prev => {
      const newValue = prev + 1;
      localStorage.setItem('nero_topics_mastered', newValue.toString());
      return newValue;
    });
  };

  return (
    <StudyContext.Provider value={{ studyTime, topicsMastered, incrementTopicsMastered }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
};
