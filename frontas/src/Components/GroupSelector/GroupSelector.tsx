import React from 'react';
import { Grid, Button } from '@mui/material';

interface GroupSelectorProps {
  activeGroup: number;
  onGroupChange: (groupNumber: number) => void;
}

const groupTitles = [
  "CIS Kontrolė #1: Įmonės turto inventorizacija ir kontrolė",
  "CIS Kontrolė #2: Programinės įrangos turto inventorizacija ir kontrolė",
  "CIS Kontrolė #3: Duomenų apsauga",
  "CIS Kontrolė #4: Įmonės turto ir programinės įrangos saugi konfigūracija",
  "CIS Kontrolė #5: Paskyrų valdymas",
  "CIS Kontrolė #6: Prieigos valdymas",
  "CIS Kontrolė #7: Nuolatinis pažeidžiamumų valdymas",
  "CIS Kontrolė #8: Audito žurnalo valdymas",
  "CIS Kontrolė #9: El. pašto ir interneto naršyklių apsauga",
  "CIS Kontrolė #10: Kenkėjiškos programinės įrangos gynyba",
  "CIS Kontrolė #11: Duomenų atkūrimas",
  "CIS Kontrolė #12: Tinklo infrastruktūros valdymas",
  "CIS Kontrolė #13: Tinklo stebėjimas ir apsauga",
  "CIS Kontrolė #14: Saugumo sąmoningumo ugdymas ir įgūdžių mokymai",
  "CIS Kontrolė #15: Paslaugų teikėjų valdymas",
  "CIS Kontrolė #16: Programinės įrangos saugumas",
  "CIS Kontrolė #17: Incidentų reagavimo valdymas",
  "CIS Kontrolė #18: Penetraciniai testai"
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
