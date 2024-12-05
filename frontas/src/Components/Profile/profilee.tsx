import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Grid,
  Modal,
} from '@mui/material';

interface ProfileFormState {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [formState, setFormState] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify(formState, null, 2));
    handleCloseModal();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 5,
          p: 4,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Page
        </Typography>
        <Typography variant="body1" gutterBottom>
          First Name: {formState.firstName || 'Not Set'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Last Name: {formState.lastName || 'Not Set'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Company: {formState.company || 'Not Set'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Email: {formState.email || 'Not Set'}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Edit Profile
        </Button>
      </Box>

      {/* Modal for Editing Profile */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="edit-profile-modal" variant="h6" component="h2" gutterBottom>
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formState.company}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
