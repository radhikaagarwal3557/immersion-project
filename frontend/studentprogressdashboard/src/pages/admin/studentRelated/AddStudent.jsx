import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../components/Popup';

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { currentUser, status, response } = useSelector(state => state.user);
  const { sclassesList } = useSelector(state => state.sclass);

  const [name, setName] = useState('');
  const [rollNum, setRollNum] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [sclassName, setSclassName] = useState('');
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const adminID = currentUser?._id;
  const role = 'Student';
  const attendance = [];

  useEffect(() => {
    dispatch(getAllSclasses(adminID, 'Sclass'));
  }, [adminID, dispatch]);

  useEffect(() => {
    if (situation === 'Class') {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  const changeHandler = (event) => {
    const selected = sclassesList.find(item => item.sclassName === event.target.value);
    if (selected) {
      setClassName(selected.sclassName);
      setSclassName(selected._id);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!sclassName) {
      setMessage('Please select a class');
      setShowPopup(true);
      return;
    }

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance };

    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      navigate(-1);
    } else if (status === 'failed') {
      setMessage(response || 'Something went wrong');
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, response, dispatch, navigate]);

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
        p: 4,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add Student
      </Typography>
      <form onSubmit={submitHandler}>
        <TextField
          fullWidth
          label="Student Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {situation === 'Student' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Class</InputLabel>
            <Select
              value={className}
              label="Class"
              onChange={changeHandler}
              required
            >
              {sclassesList.map((cls, index) => (
                <MenuItem key={index} value={cls.sclassName}>
                  {cls.sclassName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          fullWidth
          type="number"
          label="Roll Number"
          variant="outlined"
          margin="normal"
          value={rollNum}
          onChange={(e) => setRollNum(e.target.value)}
          required
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          variant="contained"
          fullWidth
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={loader}
        >
          {loader ? <CircularProgress size={24} color="inherit" /> : 'Add Student'}
        </Button>
      </form>

      <Popup message={message} showPopup={showPopup} setShowPopup={setShowPopup} />
    </Box>
  );
};

export default AddStudent;
