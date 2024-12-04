// GraphComponent.tsx

import Box from '@mui/material/Box/Box';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { calculateMetrics } from "../CalculateMetrics/CalculateMetrics";
interface GraphComponentProps {
  questions: Question[];
  answers: Answer[];
}

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
  group: number;
  sensorBaseline: string;
}

const GraphComponent: React.FC<GraphComponentProps> = ({ questions, answers }) => {
  const [riskPercentages, setRiskPercentages] = useState({
    riskAddressed: 0,
    riskAccepted: 100,
  });

  // Function to calculate scores based on the answer values
  useEffect(() => {
    const { riskPercentages } = calculateMetrics(answers);
    setRiskPercentages(riskPercentages);
  }, [answers]);

  const graphData = {
    labels: ['Risk Addressed', 'Risk Accepted'],
    datasets: [
      {
        data: [riskPercentages.riskAddressed, riskPercentages.riskAccepted],
        backgroundColor: ['green', 'red'],
      },
    ],
  };

  return (
    <Box>
      <h3>Graph Placeholder</h3>
      <p>Number of Questions: {questions.length}</p>
      <Box height={500}>
        <Pie data={graphData} />
      </Box>
    </Box>
  );
};

export default GraphComponent;
