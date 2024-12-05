import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    ButtonBase,
    Divider,
    TextField,
    Button,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { getRequest, makePutRequest, makeDeleteRequest } from '../Api/Api'; // Import API functions

interface User {
    id: number;
    name: string;
    email: string;
    position: string;
    companyName: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]); // List of all users
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // Selected user to edit
    const [originalUser, setOriginalUser] = useState<User | null>(null); // Backup of the original user for cancel
    const [isEditing, setIsEditing] = useState(false); // Editing mode

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getRequest('/api/User/user-list', '');
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle selecting a user
    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setOriginalUser(user); // Backup the original user for cancellation
        setIsEditing(false); // Disable editing mode when switching users
    };

    // Handle input change for editing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedUser) {
            const { name, value } = e.target;
            setSelectedUser({
                ...selectedUser,
                [name]: value,
            });
        }
    };

    // Handle saving changes
    const handleSaveClick = async () => {
        if (selectedUser) {
            console.log(selectedUser)
            try {
                const updatedUser = await makePutRequest(`/api/User/${selectedUser.id}`, selectedUser);
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
                );
                setIsEditing(false);
                console.log('User updated successfully:', updatedUser);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    // Handle deleting a user
    const handleDeleteClick = async (userId: number) => {
        try {
            await makeDeleteRequest(`/api/User/${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            if (selectedUser?.id === userId) {
                setSelectedUser(null); // Clear selected user if they are deleted
            }
            console.log('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };


    // Handle canceling changes
    const handleCancelClick = () => {
        setSelectedUser(originalUser); // Restore the original user data
        setIsEditing(false); // Exit editing mode
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h5" gutterBottom>
                    User List
                </Typography>

                {/* User List */}
                <Box sx={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 4 }}>
                    {users.map((user) => (
                        <React.Fragment key={user.id}>
                            <ButtonBase
                                sx={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: 2,
                                    backgroundColor:
                                        selectedUser?.id === user.id ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                                    borderRadius: 1,
                                    ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                }}
                                onClick={() => handleUserSelect(user)}
                            >
                                <Typography variant="body1">{user.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.email}
                                </Typography>
                            </ButtonBase>
                            <Divider />
                        </React.Fragment>
                    ))}
                </Box>

                {/* Edit Form */}
                {selectedUser && (
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            User Details
                        </Typography>
                        <Box
                            component="form"
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <TextField
                                label="Name"
                                name="name"
                                value={selectedUser.name}
                                onChange={handleInputChange}
                                variant="outlined"
                                disabled={!isEditing}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={selectedUser.email}
                                onChange={handleInputChange}
                                variant="outlined"
                                disabled={!isEditing}
                                fullWidth
                            />
                            <TextField
                                label="Position"
                                name="position"
                                value={selectedUser.position}
                                onChange={handleInputChange}
                                variant="outlined"
                                disabled={!isEditing}
                                fullWidth
                            />
                            <TextField
                                label="Company Name"
                                name="companyName"
                                value={selectedUser.companyName}
                                onChange={handleInputChange}
                                variant="outlined"
                                disabled={!isEditing}
                                fullWidth
                            />

                            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                                {isEditing ? (
                                    <>
                                        <IconButton
                                            color="default"
                                            onClick={handleCancelClick}
                                        >
                                            <CloseIcon />
                                        </IconButton>

                                        <IconButton color="primary" onClick={handleSaveClick}>
                                            <SaveIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton color="primary" onClick={() => setIsEditing(true)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(selectedUser.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>

                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default UserList;
