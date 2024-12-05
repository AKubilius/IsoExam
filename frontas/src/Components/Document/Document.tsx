import { Box, Checkbox, Container, FormControlLabel, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DownloadButton from "../FileUpload/DownloadButton";
import { calculateMetrics } from "../CalculateMetrics/CalculateMetrics";

export default function Documents() {
  const controls = [
    "Avarinio atkūrimo planai",
    "Atsarginių kopijų politika",
    "Duomenu klasifikavimo ir valdymo procedūros",
    "Duomenu klasifikavimo politika",
    "Informacijos saugos politika",
    "Kokybės politika",
    "Konfigūracijų valdymo politika",
    "Prieigų valdymo politika",
    "Reikalavimai trečiosioms šalims politika",
    "Pažeidžiamumų valdymo politika",
    "Rizikos registras",
    "Rolių ir atsakomybių politika",
    "Saugių sistemų kūrimo politika",
    "Taikomumo pareiškimo politika",
  ];

  interface Answer {
    questionId: number;
    policyDefined: string;
    controlImplemented: string;
    controlAutomated: string;
    controlReported: string;
  }

  const [checkedControls, setCheckedControls] = useState<{ [key: string]: boolean }>(
    controls.reduce((acc, control) => ({ ...acc, [control]: false }), {})
  );

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [risk, setRisk] = useState<number>(0);

  const handleCheckChange = (control: string) => {
    setCheckedControls((prev) => ({
      ...prev,
      [control]: !prev[control],
    }));
  };

  useEffect(() => {
    setAnswers(answers);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Load answers from sessionStorage
        const savedAnswers = sessionStorage.getItem("answers");

        if (savedAnswers) {
          // If there are saved answers, use them
          const initialAnswers: Answer[] = JSON.parse(savedAnswers);
          const { riskPercentages } = calculateMetrics(initialAnswers);
          const { riskAddressed } = riskPercentages; // Destructure riskAddressed
          setRisk(riskAddressed);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <Paper sx={{ padding: 2, maxWidth: 600, margin: "auto", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h6" align="center" gutterBottom>
        CIS Kontrolės Sąrašas
      </Typography>
      <Box>
        {controls.map((control) => (
          <FormControlLabel
            key={control}
            control={
              <Checkbox
                checked={checkedControls[control]}
                onChange={() => handleCheckChange(control)}
                color="primary"
              />
            }
            label={<Typography>{control}</Typography>}
            sx={{
              marginBottom: 1,
              display: "flex", // Ensure inline alignment
              flexDirection: "row", // Ensure checkbox and label are in a row
              alignItems: "center",
            }}
          />
        ))}
      </Box>

      <DownloadButton riskAddressed={risk} checkedControls={checkedControls} />
    </Paper>
  );
}
