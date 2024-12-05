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
  policyDefined = "Nėra politikos", // Default value to the first MenuItem
  controlImplemented = "Neįgyvendinta", // Default value to the first MenuItem
  controlAutomated = "Neautomatizuota", // Default value to the first MenuItem
  controlReported = "Nepranešta", // Default value to the first MenuItem
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
      // Green statuses
      case "Nėra politikos":
        case "Neįgyvendinta":
        case "Neautomatizuota":
        case "Nepranešta":
        return "#ff5252"; // Bright red

      // Orange statuses
      case "Neformali politika":
    case "Dalis politikos įgyvendinta":
    case "Dalis politikos automatizuota":
    case "Dalis politikos pranešta":
        return "#ffa726"; // Darker orange

      // Yellow statuses (darker)
      case "Iš dalies parašyta politika":
        case "Įgyvendinta kai kuriose sistemose":
        case "Automatizuota kai kuriose sistemose":
        case "Pranešta kai kuriose sistemose":
        
        return "#fdd835"; // Darker yellow

      // Light Green statuses (darker)
      case "Parašyta politika":
    case "Įgyvendinta daugumoje sistemų":
    case "Automatizuota daugumoje sistemų":
    case "Pranešta daugumoje sistemų":
        return "#66bb6a"; // Darker light green

      // Green statuses
      case "Patvirtinta parašyta politika":
        case "Įgyvendinta visose sistemose":
        case "Automatizuota visose sistemose":
        case "Pranešta visose sistemose":
    
        return "#43a047"; // Green

      // Default color for unknown statuses
      default:
        return "gray";
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        title={`Teiginys ${questionId}`}
        onClick={toggleAccordion}
        sx={{ cursor: "pointer", backgroundColor: "#f5f5f5" }}
      />
      <Collapse in={expanded}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            {questionText}
          </Typography>

          {/* Policy Defined Dropdown */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id={`policy-defined-label-${questionId}`}>Politika apibrėžta</InputLabel>
            <Select
              labelId={`policy-defined-label-${questionId}`}
              value={policyDefined || "Nėra politikos"} // Default value if empty
              label="Policy Defined"
              onChange={(event: SelectChangeEvent<string>) =>
                onAnswerChange("policyDefined", event.target.value)
              }
            >
              <MenuItem value="Nėra politikos">Nėra politikos</MenuItem>
              <MenuItem value="Neformali politika">Neformali politika</MenuItem>
              <MenuItem value="Iš dalies parašyta politika">Iš dalies parašyta politika</MenuItem>
              <MenuItem value="Parašyta politika">Parašyta politika</MenuItem>
              <MenuItem value="Patvirtinta parašyta politika">Patvirtinta parašyta politika</MenuItem>
            </Select>
          </FormControl>


          {/* Control Implemented Dropdown */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id={`control-implemented-label-${questionId}`}>Valdymas įgyvendintas</InputLabel>
            <Select
              labelId={`control-implemented-label-${questionId}`}
              value={controlImplemented || "Neįgyvendinta"} // Default value if empty
              label="Control Implemented"
              onChange={(event: SelectChangeEvent<string>) =>
                onAnswerChange("controlImplemented", event.target.value)
              }
            >

              <MenuItem value="Neįgyvendinta">Neįgyvendinta</MenuItem>
              <MenuItem value="Dalis politikos įgyvendinta">Dalis politikos įgyvendinta</MenuItem>
              <MenuItem value="Įgyvendinta kai kuriose sistemose">Įgyvendinta kai kuriose sistemose</MenuItem>
              <MenuItem value="Įgyvendinta daugumoje sistemų">Įgyvendinta daugumoje sistemų</MenuItem>
              <MenuItem value="Įgyvendinta visose sistemose">Įgyvendinta visose sistemose</MenuItem>
            </Select>
          </FormControl>
 
          {/* Control Automated Dropdown */} 
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id={`control-automated-label-${questionId}`}>Valdymas automatizuotas</InputLabel>
            <Select
              labelId={`control-automated-label-${questionId}`}
              value={controlAutomated || "Neautomatizuota"} // Default value if empty
              label="Control Automated"
              onChange={(event: SelectChangeEvent<string>) =>
                onAnswerChange("controlAutomated", event.target.value)
              }
              disabled={isBlocked} // Disable dropdown if blocked
            >

              <MenuItem value="Neautomatizuota">Neautomatizuota</MenuItem>
              <MenuItem value="Dalis politikos automatizuota">Dalis politikos automatizuota</MenuItem>
              <MenuItem value="Automatizuota kai kuriose sistemose">Automatizuota kai kuriose sistemose</MenuItem>
              <MenuItem value="Automatizuota daugumoje sistemų">Automatizuota daugumoje sistemų</MenuItem>
              <MenuItem value="Automatizuota visose sistemose">Automatizuota visose sistemose</MenuItem>
            </Select>
          </FormControl>
    
          {/* Control Reported Dropdown */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id={`control-reported-label-${questionId}`}>Valdymas praneštas</InputLabel>
            <Select
              labelId={`control-reported-label-${questionId}`}
              value={controlReported || "Nepranešta"} // Default value if empty
              label="Control Reported"
              onChange={(event: SelectChangeEvent<string>) =>
                onAnswerChange("controlReported", event.target.value)
              }
              disabled={isBlocked} // Disable dropdown if blocked
            >

              <MenuItem value="Nepranešta">Nepranešta</MenuItem>
              <MenuItem value="Dalis politikos pranešta">Dalis politikos pranešta</MenuItem>
              <MenuItem value="Pranešta kai kuriose sistemose">Pranešta kai kuriose sistemose</MenuItem>
              <MenuItem value="Pranešta daugumoje sistemų">Pranešta daugumoje sistemų</MenuItem>
              <MenuItem value="Pranešta visose sistemose">Pranešta visose sistemose</MenuItem>
            </Select>
          </FormControl>

          {/* Status Chips */}
          <div style={{ marginTop: 10 }}>
            <Chip
              label={policyDefined || "Nėra politikos"} // Default value if not set
              sx={{
                backgroundColor: getStatusColor(policyDefined || "Nėra politikos"), // Ensure default color
                color: "white",
                marginRight: 1,
              }}
            />
            <Chip
              label={controlImplemented || "Neįgyvendinta"} // Default value if not set
              sx={{
                backgroundColor: getStatusColor(controlImplemented || "Neįgyvendinta"), // Ensure default color
                color: "white",
                marginRight: 1,
              }}
            />
            <Chip
              label={controlAutomated || "Neautomatizuota"} // Default value if not set
              sx={{
                backgroundColor: getStatusColor(controlAutomated || "Neautomatizuota"), // Ensure default color
                color: "white",
                marginRight: 1,
              }}
            />
            <Chip
              label={controlReported || "Nepranešta"} // Default value if not set
              sx={{
                backgroundColor: getStatusColor(controlReported || "Nepranešta"), // Ensure default color
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


