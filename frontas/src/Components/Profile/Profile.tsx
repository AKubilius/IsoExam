import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { getRequest } from '../Api/Api'; // Import your API function
import ExamAttemptsDisplay from './ExamAttemptDisplay';
import ProfileForm from './ProfileForm';
import DownloadButton from '../FileUpload/DownloadButton';
import UserList from './UserList';

interface Answer {
  questionId: number;
  policyDefined: string;
  controlImplemented: string;
  controlAutomated: string;
  controlReported: string;
}

interface ExamAttempt {
  id: number;
  attemptedAt: string;
  timeTaken: string;
  score: number;
  status: string;
  answers: Answer[];
}

const Profile: React.FC = () => {
  // User profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    position:'',
    companyName:''
  });

  // User's exam attempts
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const isAdmin = sessionStorage.getItem('admin') === 'true';
  const Admin = sessionStorage.getItem('admin')
console.log(Admin);
  // Fetch user profile and exam attempts on component mount
  useEffect(() => {
    const fetchProfileAndAttempts = async () => {
      try {
        // Fetch user profile data (assumes profileData includes both user details and examAttempts)
        const profileData = await getRequest('/api/User', '');
  
        // Extract and set profile details
        const userProfile = {
          name: profileData.name || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          position: profileData.position || '',
          companyName: profileData.companyName || '',
        };
        setProfile(userProfile);
  
        // Extract and set exam attempts
        const userExamAttempts = profileData.examAttempts || [];
        setExamAttempts(userExamAttempts);
  
        console.log('Profile:', userProfile);
        console.log('Exam Attempts:', userExamAttempts);
      } catch (error) {
        console.error('Error fetching profile or exam attempts:', error);
      }
    };
  
    fetchProfileAndAttempts();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Toggle editing mode
  const handleEditClick = () => {
    setIsEditing((prevEditing) => !prevEditing);
    // Save changes to backend when exiting edit mode
    if (isEditing) {
      // Call API to save changes
      console.log('Save profile changes:', profile);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 4, marginTop: 4 }}>
      <ProfileForm
          profile={profile}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleEditClick={handleEditClick}
        />
        <DownloadButton/>
        {isAdmin && <UserList />}
        {/* Exam Attempts Section */}
        <Box sx={{ marginTop: 4 }}>
          <ExamAttemptsDisplay examAttempts={examAttempts} />;
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
