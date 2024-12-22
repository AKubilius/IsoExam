import React from "react";
import { Button } from "@mui/material";
import { postRequest } from "../Api/Api"; // Ensure this is correct

interface DownloadButtonProps {
  riskAddressed: number;
  checkedControls: { [key: string]: boolean };
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ riskAddressed, checkedControls }) => {
  const handleDownload = async () => {
    try {
      const requestBody = {
        risk: riskAddressed,
        checkedControls,
      };

      // Make the API call using postRequest
      const response = await postRequest("api/Upload/export", requestBody, "blob");

      // Create a blob from the response data and download it
      const blob = new Blob([response], {
        type: "application/pdf",
      });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = "UserAnswersReport.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link element
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <Button variant="contained" color="primary" sx={{ marginTop: "10px" }} onClick={handleDownload}>
      Parsisiųsti ataskaitą
    </Button>
  );
};

export default DownloadButton;
