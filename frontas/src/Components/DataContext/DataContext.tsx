import React, { createContext, useContext, useState, ReactNode } from "react";

interface DataProviderProps {
  children: ReactNode; // Define children as ReactNode
}

interface Question {
    id: number;
    detail: string;
    nistCategory: string;
    group: number;
    implementationGroups: string;
    sensorBaseline: string;
  }
  
  interface Answer {
    questionId: number;
    policyDefined: string;
    controlImplemented: string;
    controlAutomated: string;
    controlReported: string;
  }
  

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  return (
    <DataContext.Provider value={{ questions, answers, setQuestions, setAnswers }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
