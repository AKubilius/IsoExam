import React from "react";
import { Button } from "@mui/material";

interface SubmitButtonProps {
  onSubmit: () => void; // Function to handle the submit action
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onSubmit}
      style={{ marginTop: "20px", display: "block" }} // Ensure visibility and spacing
    >
      Submit Answers
    </Button>
  );
};

export default SubmitButton;
