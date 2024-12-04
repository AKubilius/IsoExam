import React from "react";
import { Button } from "@mui/material";
import { getRequest } from "../Api/Api"; // Import the getRequest function

const DownloadButton: React.FC = () => {
    const handleDownload = async () => {
        try {
          // Make the API call using getRequest with responseType: "blob"
          const response = await getRequest("api/Upload/export", "", "blob");
      
          // Create a blob from the response data and download it
          const blob = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const urlBlob = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = urlBlob;
          link.download = "UserAnswersReport.docx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // Clean up the link element
        } catch (error) {
          console.error("Error downloading the file:", error);
        }
      };
      

  return (
    <Button variant="contained" color="primary" onClick={handleDownload}>
      Download Answers as Word
    </Button>
  );
};

export default DownloadButton;
