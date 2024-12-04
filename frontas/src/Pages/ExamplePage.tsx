import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2'; // Assuming you are using Chart.js
import Question from '../Components/Question/Questions'; // Your Question component
import { getRequest,api } from '../Components/Api/Api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend);
interface Answer {
  policyDefined: string;
  controlImplemented: string;
  controlAutomated: string;
  controlReported: string;
}

interface Question {
  id: number;
  detail: string;
  nistCategory: string;
  implementationGroups: string;
  group:number;
  sensorBaseline: string;
  isBlocked:boolean;
}

const ExamplePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [activeGroup, setActiveGroup] = useState<number>(1); // State to track the active group
  const [riskPercentages, setRiskPercentages] = useState({
    riskAddressed: 0,
    riskAccepted: 100,
  });

  // Fetch questions from the API when the component mounts
  // Fetch questions from the API when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("api/Question");
        const fetchedQuestions: Question[] = response.data;
        console.log("Fetched Questions:", fetchedQuestions);

        // Initialize answers with the same length as fetched questions
        const initialAnswers = fetchedQuestions.map(() => ({
          policyDefined: '',
          controlImplemented: '',
          controlAutomated: '',
          controlReported: '',
        }));
        setAnswers(initialAnswers);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

 // Function to update an answer
 const updateAnswer = (index: number, field: keyof Answer, value: string) => {
  if (index < 0 || index >= answers.length) {
    console.error("Index out of bounds when updating answer");
    return;
  }

  const updatedAnswers = [...answers];
  updatedAnswers[index][field] = value;
  setAnswers(updatedAnswers);
};
    


  // Function to calculate scores based on the answer values
  const calculateScores = () => {
    let totalScore = 0;
    const totalQuestions = answers.length;

    answers.forEach((answer) => {
      // Policy Defined
      let policyScore = 0;
      if (answer.policyDefined === "No Policy") policyScore = 0;
      else if (answer.policyDefined === "Informal Policy") policyScore = 0.25;
      else if (answer.policyDefined === "Partial Written Policy") policyScore = 0.5;
      else if (answer.policyDefined === "Written Policy") policyScore = 0.75;
      else if (answer.policyDefined === "Approved Written Policy") policyScore = 1;

      // Control Implemented
      let controlScore = 0;
      if (answer.controlImplemented === "Not Implemented") controlScore = 0;
      else if (answer.controlImplemented === "Parts of Policy Implemented") controlScore = 0.25;
      else if (answer.controlImplemented === "Implemented on Some Systems") controlScore = 0.5;
      else if (answer.controlImplemented === "Implemented on Most Systems") controlScore = 0.75;
      else if (answer.controlImplemented === "Implemented on All Systems") controlScore = 1;

      // Control Automated
      let automatedScore = 0;
      if (answer.controlAutomated === "Not Automated") automatedScore = 0;
      else if (answer.controlAutomated === "Parts of Policy Automated") automatedScore = 0.25;
      else if (answer.controlAutomated === "Automated on Some Systems") automatedScore = 0.5;
      else if (answer.controlAutomated === "Automated on Most Systems") automatedScore = 0.75;
      else if (answer.controlAutomated === "Automated on All Systems") automatedScore = 1;

      // Control Reported
      let reportedScore = 0;
      if (answer.controlReported === "Not Reported") reportedScore = 0;
      else if (answer.controlReported === "Parts of Policy Reported") reportedScore = 0.25;
      else if (answer.controlReported === "Reported on Some Systems") reportedScore = 0.5;
      else if (answer.controlReported === "Reported on Most Systems") reportedScore = 0.75;
      else if (answer.controlReported === "Reported on All Systems") reportedScore = 1;

      // Sum the scores for the current answer
      totalScore += policyScore + controlScore + automatedScore + reportedScore;
    });

    // Calculate total possible score
    const maxScore = totalQuestions * 4; // Since there are 4 categories per question

    // Calculate Risk Addressed and Risk Accepted percentages
    const riskAddressed = (totalScore / maxScore) * 100;
    const riskAccepted = 100 - riskAddressed;

    // Update the state with calculated percentages
    setRiskPercentages({
      riskAddressed: Math.round(riskAddressed),
      riskAccepted: Math.round(riskAccepted),
    });
  };

  // Use useEffect to recalculate scores when answers change
  useEffect(() => {
    calculateScores();
  }, [answers]);

  // Example graph data using the calculated risk percentages
  const graphData = {
    labels: ['Risk Addressed', 'Risk Accepted'],
    datasets: [
      {
        data: [riskPercentages.riskAddressed, riskPercentages.riskAccepted],
        backgroundColor: ['green', 'red'],
      },
    ],
  };



 // Function to set the active question group
 const handleGroupChange = (groupNumber: number) => {
  setActiveGroup(groupNumber);
};

// Filter questions based on the active group
const filteredQuestions = questions.filter(question => {
  const groupsArray = question.group === activeGroup;
  return groupsArray;
});

  return (   
    
    <Box sx={{ padding: 4 }}>
       <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Choose a Question Group
      </Typography>

      {/* Render Buttons for Each Group */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        {Array.from({ length: 17 }, (_, index) => (
          <Grid item key={index}>
            <Button
              variant={activeGroup === index + 1 ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleGroupChange(index + 1)}
            >
              Group {index + 1}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Questions for Group {activeGroup}
      </Typography>

       {/* Render Graph */}
       <Box height={500}>
      <Pie data={graphData}/>
      </Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Answer Questions
      </Typography>

      {/* Render Questions */}
      {filteredQuestions.map((question, index) => (
        <Question
        key={question.id}
        questionId={question.id}
        questionText={question.detail}
        nistCategory={question.nistCategory}
        implementationGroups={question.implementationGroups}
        isBlocked={question.isBlocked}
        policyDefined={answers[index]?.policyDefined || ''}
        controlImplemented={answers[index]?.controlImplemented || ''}
        controlAutomated={answers[index]?.controlAutomated || ''}
        controlReported={answers[index]?.controlReported || ''}
        onAnswerChange={(field: keyof Answer, value: string) => updateAnswer(index, field, value)}
      />
      ))}

      {/* Button to manually trigger save (if needed) */}
      <Button variant="contained" color="primary" onClick={() => console.log('Save logic here')}>
        Save Answers
      </Button>
    </Box>
  );
};

export default ExamplePage;
