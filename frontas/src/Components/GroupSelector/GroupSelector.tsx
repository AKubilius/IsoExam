import React from 'react';
import { Grid, Button } from '@mui/material';

interface GroupSelectorProps {
  activeGroup: number;
  onGroupChange: (groupNumber: number) => void;
}

const groupTitles = [
  "CIS Control #1: Inventory and Control of Enterprise Assets",
  "CIS Control #2: Inventory and Control of Software Assets",
  "CIS Control #3: Data Protection",
  "CIS Control #4: Secure Configuration of Enterprise Assets and Software",
  "CIS Control #5: Account Management",
  "CIS Control #6: Access Control Management",
  "CIS Control #7: Continuous Vulnerability Management",
  "CIS Control #8: Audit Log Management",
  "CIS Control #9: Email and Web Browser Protections",
  "CIS Control #10: Malware Defenses",
  "CIS Control #11: Data Recovery",
  "CIS Control #12: Network Infrastructure Management",
  "CIS Control #13: Network Monitoring and Defense",
  "CIS Control #14: Security Awareness and Skills Training",
  "CIS Control #15: Service Provider Management",
  "CIS Control #16: Application Software Security",
  "CIS Control #17: Incident Response Management",
  "CIS Control #18: Penetration Testing",
];

const GroupSelector: React.FC<GroupSelectorProps> = ({ activeGroup, onGroupChange }) => {
  return (
    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
      {groupTitles.map((title, index) => (
        <Grid item key={index}>
          <Button
            variant={activeGroup === index + 1 ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => onGroupChange(index + 1)}
          >
            {title}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default GroupSelector;
