import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Box from "@mui/material/Box";
import { calculateMetrics } from "../CalculateMetrics/CalculateMetrics";
import AverageTable from "./AverageTable";
import { Typography } from "@mui/material";

interface AverageGraphProps {
  answers: Answer[];
}

interface Answer {
    policyDefined: string;
    controlImplemented: string;
    controlAutomated: string;
    controlReported: string;
  }
  

const AverageGraph: React.FC<AverageGraphProps> = ({ answers }) => {
  const [fieldAverages, setFieldAverages] = useState({
    policyDefined: 0,
    controlImplemented: 0,
    controlAutomated: 0,
    controlReported: 0,
  });

  useEffect(() => {
    const { fieldAverages } = calculateMetrics(answers);
    setFieldAverages(fieldAverages);
  }, [answers]);

  const graphData = {
    labels: ["Metrics"], // Single label because we are using multiple datasets
    datasets: [
      {
        label: "Politika apibrėžta",
        data: [fieldAverages.policyDefined * 100], // Convert to percentage
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Cyan color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Valdymas įgyvendintas",
        data: [fieldAverages.controlImplemented * 100], // Convert to percentage
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Red color
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Valdymas automatizuotas",
        data: [fieldAverages.controlAutomated * 100], // Convert to percentage
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Valdymas praneštas",
        data: [fieldAverages.controlReported * 100], // Convert to percentage
        backgroundColor: "rgba(255, 206, 86, 0.6)", // Yellow color
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6">Vidurkio grafikas</Typography>
      </Box>
      <Box height={500} display="flex">
        <Bar
          data={graphData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true, // Show legend for individual bars
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 20,
                title: { display: true, text: "Procentai (%)" },
              },
              x: {
                title: { display: true },
                ticks: {
                  display: false, // Hide x-axis ticks because we use multiple datasets
                },
              },
            },
          }}
        />
        <AverageTable fieldAverages={fieldAverages} />
      </Box>
    </Box>
  );
  
};

export default AverageGraph;
