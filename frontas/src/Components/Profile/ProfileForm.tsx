import React from 'react';
import { Box, IconButton, Typography, TextField, Button, Container } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close'; // Import the "X" icon

interface ProfileFormProps {
  profile: {
    name: string;
    email: string;
    position: string;
    companyName: string;
  };
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditClick: () => void;
  handleCancelClick: () => void; // Add cancel button handler
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isEditing,
  handleInputChange,
  handleEditClick,
  handleCancelClick, // Destructure cancel handler
}) => {
  return (
    <Container>
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          mb: 4,
        }}
      >
        <IconButton color="primary" onClick={handleEditClick} sx={{ mt: 2 }}>
          {isEditing ? <SaveIcon /> : <EditIcon />}
        </IconButton>
        {isEditing && (
          <IconButton color="secondary" onClick={handleCancelClick} sx={{ mt: 2 }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Typography variant="h5" align="center" gutterBottom>
        {isEditing ? 'Redaguoti profilį' : 'Profilis'}
      </Typography>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={profile.name || ''}
          onChange={handleInputChange}
          variant="outlined"
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email || ''}
          onChange={handleInputChange}
          variant="outlined"
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Position"
          name="position"
          value={profile.position || ''}
          onChange={handleInputChange}
          variant="outlined"
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Company Name"
          name="companyName"
          value={profile.companyName || ''}
          onChange={handleInputChange}
          variant="outlined"
          disabled={!isEditing}
          fullWidth
        />
      </Box>
    </Box>
    </Container>
  );
};

export default ProfileForm;
