import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarComponentProps {
  questions: Question[];
  answers: Answer[];
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

const BarComponent: React.FC<BarComponentProps> = ({ questions, answers }) => {
  const [barData, setBarData] = useState<any>({ labels: [], datasets: [] });

  const calculateGroupData = () => {
    // Group questions by their group ID
    const groups = questions.reduce((acc, question) => {
      acc[question.group] = acc[question.group] || [];
      acc[question.group].push(question.id);
      return acc;
    }, {} as Record<number, number[]>);

    // Calculate Control Implemented % for each group
    const groupPercentages = Object.entries(groups).map(([group, questionIds]) => {
      const totalQuestions = questionIds.length;

      // Get answers for the current group
      const groupAnswers = answers.filter(answer => questionIds.includes(answer.questionId));

      // Count how many answers have "Implemented on All Systems"
      const fullyImplementedCount = groupAnswers.filter(
        answer => answer.controlImplemented === "Implemented on All Systems"
      ).length;

      // Calculate percentage
      const percentage = (fullyImplementedCount / totalQuestions) * 100;

      return { group: `CSC # ${group}`, percentage };
    });

    // Set data for the bar chart
    setBarData({
      labels: groupPercentages.map(item => item.group),
      datasets: [
        {
          label: 'Control Implemented (%)',
          data: groupPercentages.map(item => item.percentage),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    calculateGroupData();
  }, [questions, answers]);

  return (
    <Box>
      <h3>Control Implementation Percentage by Group</h3>
      <Box height={500}>
        <Bar
          data={barData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Percentage (%)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Groups',
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default BarComponent;
