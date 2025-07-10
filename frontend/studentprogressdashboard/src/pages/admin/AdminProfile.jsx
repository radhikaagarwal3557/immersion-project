import React, { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { authLogout } from '../../redux/userRelated/userSlice';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Collapse,
    Typography,
    Box,
    TextField,
    Paper,
    Stack
} from '@mui/material';

const AdminProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, response, error } = useSelector((state) => state.user);
    const [showEdit, setShowEdit] = useState(false);
    const buttonText = showEdit ? 'Cancel' : 'Edit Profile';

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState('');
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const fields = password === ""
        ? { name, email, schoolName }
        : { name, email, password, schoolName };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUser(fields, currentUser._id, "Admin"));
    };

    const handleDelete = () => {
        dispatch(deleteUser(currentUser._id, "Students")); // optional, if you want to delete all students related
        dispatch(deleteUser(currentUser._id, "Admin"));
        dispatch(authLogout());
        navigate('/');
    };

    return (
        <ContainerBox>
            <Paper sx={{ p: 3, width: '100%', maxWidth: '600px' }}>
                <Typography variant="h5" gutterBottom>
                    Admin Profile
                </Typography>

                <Typography variant="body1"><strong>Name:</strong> {currentUser.name}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {currentUser.email}</Typography>
                <Typography variant="body1"><strong>School:</strong> {currentUser.schoolName}</Typography>

                <Stack direction="row" spacing={2} mt={3}>
                    <Button
                        variant="contained"
                        color={showEdit ? "warning" : "primary"}
                        onClick={() => setShowEdit(!showEdit)}
                        startIcon={showEdit ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    >
                        {buttonText}
                    </Button>

                    {/* Optional Delete Button */}
                    {/* 
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete Account
                    </Button> 
                    */}
                </Stack>

                <Collapse in={showEdit} timeout="auto" unmountOnExit>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2} mt={3}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <TextField
                                label="School Name"
                                variant="outlined"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                helperText="Leave blank to keep existing password"
                            />
                            <Button type="submit" variant="contained" color="success">
                                Update Profile
                            </Button>
                        </Stack>
                    </form>
                </Collapse>
            </Paper>
        </ContainerBox>
    );
};

export default AdminProfile;

const ContainerBox = ({ children }) => (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        padding={2}
    >
        {children}
    </Box>
);
