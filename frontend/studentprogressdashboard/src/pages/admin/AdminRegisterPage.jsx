import React, { useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    Paper,
    Checkbox,
    FormControlLabel,
    TextField,
    CssBaseline,
    IconButton,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import bgpic from "../../assets/designlogin.jpg";
import { LightPurpleButton } from '../../components/buttonStyles';
import { registerUser } from '../../redux/userRelated/userHandle';
import Popup from '../../components/Popup';

const defaultTheme = createTheme();

const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({
        adminName: false,
        schoolName: false,
        email: false,
        password: false
    });

    const role = "Admin";

    const handleSubmit = (e) => {
        e.preventDefault();

        const name = e.target.adminName.value.trim();
        const schoolName = e.target.schoolName.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();

        const newErrors = {
            adminName: !name,
            schoolName: !schoolName,
            email: !email,
            password: !password
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(err => err)) return;

        const fields = { name, email, password, role, schoolName };
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    const handleInputChange = (e) => {
        const { name } = e.target;
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    useEffect(() => {
        if (status === 'success' || (currentUser && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            console.log(error);
            setMessage("Network Error. Please try again.");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            Admin Register
                        </Typography>
                        <Typography variant="body2" align="center">
                            Create your own school by registering as an admin.
                            <br />
                            You will be able to add students and faculty and manage the system.
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="adminName"
                                name="adminName"
                                label="Enter your name"
                                autoComplete="name"
                                autoFocus
                                error={errors.adminName}
                                helperText={errors.adminName && "Name is required"}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="schoolName"
                                name="schoolName"
                                label="Create your school name"
                                autoComplete="off"
                                error={errors.schoolName}
                                helperText={errors.schoolName && "School name is required"}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                name="email"
                                label="Enter your email"
                                autoComplete="email"
                                error={errors.email}
                                helperText={errors.email && "Email is required"}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                error={errors.password}
                                helperText={errors.password && "Password is required"}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Register"}
                            </LightPurpleButton>
                            <Grid container justifyContent="center" alignItems="center">
                                <Typography variant="body2">Already have an account?</Typography>
                                <StyledLink to="/Adminlogin">Log in</StyledLink>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
};

export default AdminRegisterPage;

const StyledLink = styled(Link)`
  margin-left: 8px;
  text-decoration: none;
  font-weight: bold;
  color: #7f56da;
  &:hover {
    text-decoration: underline;
  }
`;
