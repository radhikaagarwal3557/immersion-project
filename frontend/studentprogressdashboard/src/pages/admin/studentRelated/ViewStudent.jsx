// ViewStudent.jsx (Admin Panel)
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Collapse, IconButton, Typography,
  Table, TableHead, TableBody, Paper, BottomNavigation,
  BottomNavigationAction, Container, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon,
  Edit as EditIcon, InsertChart, InsertChartOutlined,
  TableChart, TableChartOutlined
} from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import CustomPieChart from '../../../components/CustomPieChart';
import CustomBarChart from '../../../components/CustomBarChart';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject
} from '../../../components/attendanceCalculator';

const ViewStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { userDetails, response, loading, error } = useSelector(state => state.user);
  const studentID = params.id;
  const address = 'Student';

  const [tabValue, setTabValue] = useState('1');
  const [selectedSection, setSelectedSection] = useState('table');
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', rollNum: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [openStates, setOpenStates] = useState({});

  const subjectAttendance = userDetails?.attendance || [];
  const subjectMarks = userDetails?.examResult || [];

  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (userDetails?.sclassName?._id) {
      dispatch(getSubjectList(userDetails.sclassName._id, 'ClassSubjects'));
    }
    setFormData({
      name: userDetails?.name || '',
      rollNum: userDetails?.rollNum || '',
      password: ''
    });
  }, [userDetails]);

  const handleEditChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = () => {
    const updateData = formData.password ? formData : { name: formData.name, rollNum: formData.rollNum };
    dispatch(updateUser(updateData, studentID, address))
      .then(() => {
        dispatch(getUserDetails(studentID, address));
        setEditOpen(false);
      });
  };

  const handleOpen = (subId) => {
    setOpenStates(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const chartData = [
    { name: 'Present', value: calculateOverallAttendancePercentage(subjectAttendance) },
    { name: 'Absent', value: 100 - calculateOverallAttendancePercentage(subjectAttendance) }
  ];

  const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, sessions }]) => ({
    subject: subName,
    attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
    totalClasses: sessions,
    attendedClasses: present
  }));

  const deleteHandler = () => {
    setMessage('Sorry, delete is disabled for now.');
    setShowPopup(true);
  };

  const StudentDetails = () => (
    <Box>
      <Typography>Name: {userDetails?.name}</Typography>
      <Typography>Roll Number: {userDetails?.rollNum}</Typography>
      <Typography>Class: {userDetails?.sclassName?.sclassName}</Typography>
      <Typography>School: {userDetails?.school?.schoolName}</Typography>
      <CustomPieChart data={chartData} />
      <Button variant="contained" color="error" onClick={deleteHandler}>Delete</Button>
      <Button startIcon={<EditIcon />} variant="contained" onClick={() => setEditOpen(true)} sx={{ ml: 2 }}>Edit</Button>
    </Box>
  );

  const AttendanceSection = () => (
    <>
      {selectedSection === 'table' ? (
        <Box>
          <Typography variant="h6">Attendance Table</Typography>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Present</StyledTableCell>
                <StyledTableCell>Sessions</StyledTableCell>
                <StyledTableCell>%</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {subjectData.map((row, idx) => (
                <StyledTableRow key={idx}>
                  <StyledTableCell>{row.subject}</StyledTableCell>
                  <StyledTableCell>{row.attendedClasses}</StyledTableCell>
                  <StyledTableCell>{row.totalClasses}</StyledTableCell>
                  <StyledTableCell>{row.attendancePercentage.toFixed(2)}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />}
    </>
  );

  const MarksSection = () => (
    <>
      {selectedSection === 'table' ? (
        <Box>
          <Typography variant="h6">Exam Marks</Typography>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Marks</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {subjectMarks.map((res, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell>{res.subName?.subName}</StyledTableCell>
                  <StyledTableCell>{res.marksObtained}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />}
    </>
  );

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1 }}>
          <TabList onChange={(e, newVal) => setTabValue(newVal)}>
            <Tab label="Details" value="1" />
            <Tab label="Attendance" value="2" />
            <Tab label="Marks" value="3" />
          </TabList>
        </Box>
        <Container sx={{ mt: 3 }}>
          <TabPanel value="1"><StudentDetails /></TabPanel>
          <TabPanel value="2"><AttendanceSection /></TabPanel>
          <TabPanel value="3"><MarksSection /></TabPanel>
        </Container>
      </TabContext>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={selectedSection} onChange={(e, newVal) => setSelectedSection(newVal)} showLabels>
          <BottomNavigationAction label="Table" value="table" icon={selectedSection === 'table' ? <TableChart /> : <TableChartOutlined />} />
          <BottomNavigationAction label="Chart" value="chart" icon={selectedSection === 'chart' ? <InsertChart /> : <InsertChartOutlined />} />
        </BottomNavigation>
      </Paper>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Roll Number"
            fullWidth
            name="rollNum"
            value={formData.rollNum}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewStudent;