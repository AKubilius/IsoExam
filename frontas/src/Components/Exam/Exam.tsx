import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { api, makePostRequest } from '../Api/Api';
import GroupSelector from '../GroupSelector/GroupSelector';
import QuestionsList from '../Question/QuestionsList';
import GraphComponent from '../Graphs/GraphComponent';
import SubmitButton from './SubmitButton';
import BarComponent from '../Graphs/BarComponent';
import { useData } from '../DataContext/DataContext';

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



const Exam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [activeGroup, setActiveGroup] = useState<number>(1
  );

  useEffect(() => {
    // Fetch questions and answers, then set them
    setQuestions(questions);
    setAnswers(answers);
  }, []);

   // Handle submit and call the API using makePostRequest
   const submitAnswers = async () => {
    try {
      const response = await makePostRequest("api/Answers", { answers });
console.log(answers);
      if (response) {
        console.log("Exam submitted successfully:", response);
        // Optionally, handle the response (e.g., show success message, redirect, etc.)
      } else {
        console.error("Failed to submit answers");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };
  

  // Load questions from the API and answers from sessionStorage
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("api/Question");
        const fetchedQuestions: Question[] = response.data;
        console.log(fetchedQuestions)
        // Load answers from sessionStorage
        const savedAnswers = sessionStorage.getItem('answers');
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

  // Function to update an answer and save it to sessionStorage
  const updateAnswer = (questionId: number, field: keyof Answer, value: string) => {
    const updatedAnswers = answers.map((answer) =>
      answer.questionId === questionId ? { ...answer, [field]: value } : answer
    );
    setAnswers(updatedAnswers);

    // Save updated answers to sessionStorage
    sessionStorage.setItem('answers', JSON.stringify(updatedAnswers));
  };

  // Function to handle group change
  const handleGroupChange = (groupNumber: number) => {
    setActiveGroup(groupNumber);
  };

  // Filter questions and corresponding answers based on the active group
  const filteredQuestions = questions.filter(question => question.group === activeGroup);
  const filteredAnswers = answers.filter(answer =>
    filteredQuestions.some(question => question.id === answer.questionId)

  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Grupės
      </Typography>
      
      <GroupSelector activeGroup={activeGroup} onGroupChange={handleGroupChange} />
      
      {/* Pass filtered questions and answers to GraphComponent */}
      <GraphComponent questions={filteredQuestions} answers={filteredAnswers} />
      

      {/* Pass filtered questions and answers to QuestionsList */}
      <QuestionsList
        questions={filteredQuestions}
        answers={filteredAnswers}
        onAnswerChange={(index, field, value) =>
          updateAnswer(filteredQuestions[index].id, field, value)
        }
      />
      <SubmitButton onSubmit={submitAnswers}></SubmitButton>
    </Box>
  );
};

export default Exam;
