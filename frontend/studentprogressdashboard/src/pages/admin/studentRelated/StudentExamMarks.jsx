import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Stack,
  FormControl, InputLabel, Select,
  MenuItem, TextField, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';

const StudentExamMarks = ({ situation }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { currentUser, userDetails, loading } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector((state) => state.student);

  const [studentID, setStudentID] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [chosenSubName, setChosenSubName] = useState('');
  const [marksObtained, setMarksObtained] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);

  // Load student details
  useEffect(() => {
    if (situation === 'Student') {
      const stdID = params.id;
      setStudentID(stdID);
      dispatch(getUserDetails(stdID, 'Student'));
    } else if (situation === 'Subject') {
      const { studentID, subjectID } = params;
      setStudentID(studentID);
      setChosenSubName(subjectID);
      dispatch(getUserDetails(studentID, 'Student'));
    }
  }, [situation, dispatch, params]);

  // Load subject list after student details
  useEffect(() => {
    if (userDetails?.sclassName && situation === 'Student') {
      dispatch(getSubjectList(userDetails.sclassName._id, 'ClassSubjects'));
    }
  }, [dispatch, userDetails, situation]);

  // Subject change handler
  const handleSubjectChange = (e) => {
    const selected = subjectsList.find(sub => sub.subName === e.target.value);
    if (selected) {
      setSubjectName(selected.subName);
      setChosenSubName(selected._id);
    }
  };

  const fields = { subName: chosenSubName, marksObtained };

  // Submit marks
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    dispatch(updateStudentFields(studentID, fields, 'UpdateExamResult'));
  };

  // Handle feedback
  useEffect(() => {
    if (response) {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (error) {
      setMessage('Something went wrong!');
      setShowPopup(true);
      setLoader(false);
    } else if (statestatus === 'added') {
      setMessage('Marks added successfully');
      setShowPopup(true);
      setLoader(false);
    }
  }, [response, error, statestatus]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Box sx={{ width: '100%', maxWidth: 550, px: 3 }}>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h5">
                Student: {userDetails?.name || 'N/A'}
              </Typography>
              {currentUser?.teachSubject && (
                <Typography variant="h6">
                  Subject: {currentUser?.teachSubject?.subName}
                </Typography>
              )}
            </Stack>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {situation === 'Student' && (
                  <FormControl fullWidth required>
                    <InputLabel>Select Subject</InputLabel>
                    <Select
                      value={subjectName}
                      label="Select Subject"
                      onChange={handleSubjectChange}
                    >
                      {subjectsList?.length > 0 ? (
                        subjectsList.map((sub, idx) => (
                          <MenuItem key={idx} value={sub.subName}>
                            {sub.subName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No Subjects Found</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  type="number"
                  label="Enter Marks"
                  value={marksObtained}
                  onChange={(e) => setMarksObtained(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />

                <BlueButton
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                </BlueButton>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default StudentExamMarks;
