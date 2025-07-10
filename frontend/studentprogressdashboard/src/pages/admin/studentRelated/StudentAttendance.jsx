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

import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const StudentAttendance = ({ situation }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { currentUser, userDetails, loading } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector((state) => state.student);

  const [studentID, setStudentID] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [chosenSubName, setChosenSubName] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);

  // Load student & subject data
  useEffect(() => {
    if (situation === 'Student') {
      setStudentID(params.id);
      dispatch(getUserDetails(params.id, 'Student'));
    } else if (situation === 'Subject') {
      const { studentID, subjectID } = params;
      setStudentID(studentID);
      dispatch(getUserDetails(studentID, 'Student'));
      setChosenSubName(subjectID);
    }
  }, [situation, dispatch, params]);

  // Get subject list after user details are loaded
  useEffect(() => {
    if (userDetails?.sclassName && situation === 'Student') {
      dispatch(getSubjectList(userDetails.sclassName._id, 'ClassSubjects'));
    }
  }, [dispatch, userDetails, situation]);

  const handleSubjectChange = (event) => {
    const selected = subjectsList.find(subject => subject.subName === event.target.value);
    if (selected) {
      setSubjectName(selected.subName);
      setChosenSubName(selected._id);
    }
  };

  const fields = {
    subName: chosenSubName,
    status,
    date
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoader(true);
    dispatch(updateStudentFields(studentID, fields, 'StudentAttendance'));
  };

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
      setMessage('Attendance marked successfully');
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
            <form onSubmit={submitHandler}>
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
                        subjectsList.map((subject, index) => (
                          <MenuItem key={index} value={subject.subName}>
                            {subject.subName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No Subjects Found</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}

                <FormControl fullWidth required>
                  <InputLabel>Attendance Status</InputLabel>
                  <Select
                    value={status}
                    label="Attendance Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Select Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <PurpleButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={loader}
                >
                  {loader ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                </PurpleButton>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default StudentAttendance;
