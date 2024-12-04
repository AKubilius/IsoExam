import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface FieldAverages {
  policyDefined: number;
  controlImplemented: number;
  controlAutomated: number;
  controlReported: number;
}

const AverageTable: React.FC<{ fieldAverages: FieldAverages }> = ({ fieldAverages }) => {
  const rows = [
    { field: "Policy Defined", value: `${(fieldAverages.policyDefined * 5).toFixed(2)}` },
    { field: "Control Implemented", value: `${(fieldAverages.controlImplemented * 5).toFixed(2)}` },
    { field: "Control Automated", value: `${(fieldAverages.controlAutomated * 5).toFixed(2)}` },
    { field: "Control Reported", value: `${(fieldAverages.controlReported * 5).toFixed(2)}` },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Field</strong></TableCell>
            <TableCell align="right"><strong>Average</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.field}>
              <TableCell>{row.field}</TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AverageTable;
