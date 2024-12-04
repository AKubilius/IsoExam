import React from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

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
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isEditing,
  handleInputChange,
  handleEditClick,
}) => {
  return (
    <Box>
      {/* Avatar and Edit Button */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          alt={profile.name}
          src="https://source.unsplash.com/random/100x100"
          sx={{ width: 100, height: 100 }}
        />
        <IconButton color="primary" onClick={handleEditClick} sx={{ mt: 2 }}>
          {isEditing ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* Profile Information */}
      <Typography variant="h5" align="center" gutterBottom>
        {isEditing ? 'Edit Profile' : 'Profile'}
      </Typography>

      {/* Form Fields */}
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
          label="Company name"
          name="companyName"
          value={profile.companyName || ''}
          onChange={handleInputChange}
          variant="outlined"
          disabled={!isEditing}
          fullWidth
        />

        {/* Save Changes Button */}
        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            sx={{ alignSelf: 'center', mt: 2 }}
          >
            Save Changes
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProfileForm;
