import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import { getRequest, makePutRequest } from '../Api/Api';
import DownloadButton from '../FileUpload/DownloadButton';
import UserList from './UserList';
import Container from '@mui/material/Container/Container';
import Paper from '@mui/material/Paper/Paper';
import { Box } from '@mui/material';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    position: '',
    companyName: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(profile); // Store original profile

  const isAdmin = sessionStorage.getItem('admin') === 'true'
console.log(isAdmin)

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profileData = await getRequest('/api/User', '');
        setProfile(profileData);
        setOriginalProfile(profileData); // Save original profile
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };
   // Handle cancel button click
   const handleCancelClick = () => {
    setProfile(originalProfile); // Revert to original profile
    setIsEditing(false); // Exit editing mode
  };

  // Handle edit/save button click
  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const response = await makePutRequest('/api/User/edit', profile);
      setProfile(response); // If makePutRequest already returns `data`
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to update user:', error);
        alert('Error updating profile. Please try again.');
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <Container maxWidth="sm">
    <Paper sx={{ padding: 4, marginTop: 4 }}>
      <Box sx={{display:'flex',flexDirection:'column'}}>
      <ProfileForm

profile={profile}
isEditing={isEditing}
handleInputChange={handleInputChange}
handleEditClick={handleEditClick}
handleCancelClick={handleCancelClick} // Pass cancel handler
/>

</Box>
{isAdmin && <UserList />}

    </Paper>
  </Container>
    
  );
};

export default ProfilePage;
