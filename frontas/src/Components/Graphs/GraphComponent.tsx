import Box from '@mui/material/Box/Box';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import necessary components
import { calculateMetrics } from "../CalculateMetrics/CalculateMetrics";

// Register the Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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
    console.log(riskPercentages);
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
      <Box height={500}>
        <Pie data={graphData} />
      </Box>
    </Box>
  );
};

export default GraphComponent;
