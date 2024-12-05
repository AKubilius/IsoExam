import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BarComponent from "../Graphs/BarComponent";
import { useData } from "../DataContext/DataContext";
import { api } from "../Api/Api";
import AverageGraph from "../Graphs/AverageComponent";
import { Box } from "@mui/material";

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
  


const GraphPage: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
  
    console.log(answers)
    console.log(questions)
    useEffect(() => {
      // Fetch questions and answers, then set them
      setQuestions(questions);
      setAnswers(answers);
    }, []);
  
    useEffect(() => {
        const fetchQuestions = async () => {
          try {
            const response = await api.get("api/Question");
            const fetchedQuestions: Question[] = response.data;
    
            // Load answers from sessionStorage
            const savedAnswers = sessionStorage.getItem('answers');
            console.log(savedAnswers);
            let initialAnswers: Answer[];
    
            if (savedAnswers) {
              // If there are saved answers, use them
              initialAnswers = JSON.parse(savedAnswers);
            } else {
              // Otherwise, initialize answers with empty values
              initialAnswers = fetchedQuestions.map((question) => ({
                questionId: question.id,
                policyDefined: '',
                controlImplemented: '',
                controlAutomated: '',
                controlReported: '',
              }));
            }
            setAnswers(initialAnswers);
            setQuestions(fetchedQuestions);
          } catch (error) {
            console.error("Error fetching questions:", error);
          }
        };
    
        fetchQuestions();
      }, []);

  return (
    <Box>
      <BarComponent questions={questions} answers={answers} />
      <AverageGraph answers={answers}/>
      
    </Box>
  );
};

export default GraphPage;
