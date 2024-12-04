import React from 'react';
import {
  Collapse,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

// Answer interface
interface Answer {
  policyDefined: string;
  controlImplemented: string;
  controlAutomated: string;
  controlReported: string;
}

interface QuestionProps {
  questionId: number;
  questionText: string;
  nistCategory: string;
  implementationGroups: string;
  policyDefined: string;
  controlImplemented: string;
  controlAutomated: string;
  controlReported: string;
  onAnswerChange: (field: keyof Answer, value: string) => void;
  isBlocked: boolean; // Add IsBlocked property
}




const Question: React.FC<QuestionProps> = ({
  questionId,
  questionText,
  nistCategory,
  implementationGroups,
  policyDefined = "No Policy", // Default value to the first MenuItem
  controlImplemented = "Not Implemented", // Default value to the first MenuItem
  controlAutomated = "Not Automated", // Default value to the first MenuItem
  controlReported = "Not Reported", // Default value to the first MenuItem
  isBlocked,
  onAnswerChange
}) => {
  // State for managing accordion expansion
  const [expanded, setExpanded] = React.useState<boolean>(false);

  // Disable accordion toggle for blocked questions
  const toggleAccordion = () => {
    setExpanded(!expanded);
  };


  // Function to get color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      // Red statuses
      case "No Policy":
      case "Not Implemented":
      case "Not Automated":
      case "Not Reported":
        return "#ff5252"; // Bright red
  
      // Orange statuses
      case "Informal Policy":
      case "Parts of Policy Implemented":
      case "Parts of Policy Automated":
      case "Parts of Policy Reported":
        return "#ffa726"; // Darker orange
  
      // Yellow statuses (darker)
      case "Partial Written Policy":
      case "Implemented on Some Systems":
      case "Automated on Some Systems":
      case "Reported on Some Systems":
        return "#fdd835"; // Darker yellow
  
      // Light Green statuses (darker)
      case "Written Policy":
      case "Implemented on Most Systems":
      case "Automated on Most Systems":
      case "Reported on Most Systems":
        return "#66bb6a"; // Darker light green
  
      // Green statuses
      case "Approved Written Policy":
      case "Implemented on All Systems":
      case "Automated on All Systems":
      case "Reported on All Systems":
        return "#43a047"; // Green
  
      // Default color for unknown statuses
      default:
        return "gray";
    }
  };
  
  

  return (
    <Card sx={{ marginBottom: 2 }}>
    <CardHeader
      title={`Question ${questionId}`}
      subheader={nistCategory}
      onClick={toggleAccordion}
      sx={{ cursor: "pointer", backgroundColor: "#f5f5f5" }}
    />
    <Collapse in={expanded}>
      <CardContent>
        <Typography variant="body1" gutterBottom>
          {questionText}
        </Typography>

        <Typography variant="body2" gutterBottom>
          <strong>Implementation Groups:</strong> {implementationGroups}
        </Typography>

        {/* Policy Defined Dropdown */}
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id={`policy-defined-label-${questionId}`}>Policy Defined</InputLabel>
          <Select
            labelId={`policy-defined-label-${questionId}`}
            value={policyDefined || "No Policy"} // Default value if empty
            label="Policy Defined"
            onChange={(event: SelectChangeEvent<string>) =>
              onAnswerChange("policyDefined", event.target.value)
            }
          >
            <MenuItem value="No Policy">No Policy</MenuItem>
            <MenuItem value="Informal Policy">Informal Policy</MenuItem>
            <MenuItem value="Partial Written Policy">Partial Written Policy</MenuItem>
            <MenuItem value="Written Policy">Written Policy</MenuItem>
            <MenuItem value="Approved Written Policy">Approved Written Policy</MenuItem>
          </Select>
        </FormControl>

        {/* Control Implemented Dropdown */}
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id={`control-implemented-label-${questionId}`}>Control Implemented</InputLabel>
          <Select
            labelId={`control-implemented-label-${questionId}`}
            value={controlImplemented || "Not Implemented"} // Default value if empty
            label="Control Implemented"
            onChange={(event: SelectChangeEvent<string>) =>
              onAnswerChange("controlImplemented", event.target.value)
            }
          >
            <MenuItem value="Not Implemented">Not Implemented</MenuItem>
            <MenuItem value="Parts of Policy Implemented">Parts of Policy Implemented</MenuItem>
            <MenuItem value="Implemented on Some Systems">Implemented on Some Systems</MenuItem>
            <MenuItem value="Implemented on Most Systems">Implemented on Most Systems</MenuItem>
            <MenuItem value="Implemented on All Systems">Implemented on All Systems</MenuItem>
          </Select>
        </FormControl>

        {/* Control Automated Dropdown */}
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id={`control-automated-label-${questionId}`}>Control Automated</InputLabel>
          <Select
            labelId={`control-automated-label-${questionId}`}
            value={controlAutomated || "Not Automated"} // Default value if empty
            label="Control Automated"
            onChange={(event: SelectChangeEvent<string>) =>
              onAnswerChange("controlAutomated", event.target.value)
            }
            disabled={isBlocked} // Disable dropdown if blocked
          >
            <MenuItem value="Not Automated">Not Automated</MenuItem>
            <MenuItem value="Parts of Policy Automated">Parts of Policy Automated</MenuItem>
            <MenuItem value="Automated on Some Systems">Automated on Some Systems</MenuItem>
            <MenuItem value="Automated on Most Systems">Automated on Most Systems</MenuItem>
            <MenuItem value="Automated on All Systems">Automated on All Systems</MenuItem>
          </Select>
        </FormControl>

        {/* Control Reported Dropdown */}
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id={`control-reported-label-${questionId}`}>Control Reported</InputLabel>
          <Select
            labelId={`control-reported-label-${questionId}`}
            value={controlReported || "Not Reported"} // Default value if empty
            label="Control Reported"
            onChange={(event: SelectChangeEvent<string>) =>
              onAnswerChange("controlReported", event.target.value)
            }
            disabled={isBlocked} // Disable dropdown if blocked
          >
            <MenuItem value="Not Reported">Not Reported</MenuItem>
            <MenuItem value="Parts of Policy Reported">Parts of Policy Reported</MenuItem>
            <MenuItem value="Reported on Some Systems">Reported on Some Systems</MenuItem>
            <MenuItem value="Reported on Most Systems">Reported on Most Systems</MenuItem>
            <MenuItem value="Reported on All Systems">Reported on All Systems</MenuItem>
          </Select>
        </FormControl>

         {/* Status Chips */}
<div style={{ marginTop: 10 }}>
  <Chip
    label={policyDefined || "No Policy"} // Default value if not set
    sx={{
      backgroundColor: getStatusColor(policyDefined || "No Policy"), // Ensure default color
      color: "white",
      marginRight: 1,
    }}
  />
  <Chip
    label={controlImplemented || "Not Implemented"} // Default value if not set
    sx={{
      backgroundColor: getStatusColor(controlImplemented || "Not Implemented"), // Ensure default color
      color: "white",
      marginRight: 1,
    }}
  />
  <Chip
    label={controlAutomated || "Not Automated"} // Default value if not set
    sx={{
      backgroundColor: getStatusColor(controlAutomated || "Not Automated"), // Ensure default color
      color: "white",
      marginRight: 1,
    }}
  />
  <Chip
    label={controlReported || "Not Reported"} // Default value if not set
    sx={{
      backgroundColor: getStatusColor(controlReported || "Not Reported"), // Ensure default color
      color: "white",
    }}
  />
</div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Question;


