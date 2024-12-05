import React from 'react';
import { Typography } from '@mui/material';
import Question from './Questions'; // Import your Question component


interface Answer {
  policyDefined: string;
  controlImplemented: string;
  controlAutomated: string;
  controlReported: string;
}

interface QuestionsListProps {
  questions: any[];
  answers: any[];
  onAnswerChange: (index: number, field: keyof Answer, value: string) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({ questions, answers, onAnswerChange }) => {
  return (
    <>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <Question
            key={question.id}
            questionId={question.title}
            questionText={question.detail}
            policyDefined={answers[index]?.policyDefined || ''}
            controlImplemented={answers[index]?.controlImplemented || ''}
            controlAutomated={answers[index]?.controlAutomated || ''}
            controlReported={answers[index]?.controlReported || ''}
            isBlocked={question.IsBlocked} // Pass the IsBlocked flag
            onAnswerChange={(field: keyof Answer, value: string) => onAnswerChange(index, field, value)}
          />
        ))
      ) : (
        <Typography variant="body1">No questions available</Typography>
      )}
    </>
  );
};


export default QuestionsList;
