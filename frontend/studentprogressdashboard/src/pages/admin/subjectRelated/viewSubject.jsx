import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box, Container, Typography, Paper,
  BottomNavigation, BottomNavigationAction, Tab, Tabs
} from '@mui/material';

import {
  getClassStudents,
  getSubjectDetails,
} from '../../../redux/sclassRelated/sclassHandle';

import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const ViewSubject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classID, subjectID } = useParams();

  const {
    subloading,
    subjectDetails,
    sclassStudents,
    getresponse,
    error
  } = useSelector((state) => state.sclass);

  const [tabValue, setTabValue] = useState('1');
  const [selectedSection, setSelectedSection] = useState('attendance');

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, 'Subject'));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ];

  const studentRows = sclassStudents?.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student._id,
  }));

  const StudentsAttendanceButtonHaver = ({ row }) => (
    <>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/students/student/${row.id}`)}
      >
        View
      </BlueButton>
      <PurpleButton
        variant="contained"
        onClick={() =>
          navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
        }
      >
        Take Attendance
      </PurpleButton>
    </>
  );

  const StudentsMarksButtonHaver = ({ row }) => (
    <>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/students/student/${row.id}`)}
      >
        View
      </BlueButton>
      <PurpleButton
        variant="contained"
        onClick={() =>
          navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)
        }
      >
        Provide Marks
      </PurpleButton>
    </>
  );

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Subject Details
        </Typography>
        <Typography variant="h6">Subject Name: {subjectDetails?.subName}</Typography>
        <Typography variant="h6">Subject Code: {subjectDetails?.subCode}</Typography>
        <Typography variant="h6">Sessions: {subjectDetails?.sessions}</Typography>
        <Typography variant="h6">Total Students: {numberOfStudents}</Typography>
        <Typography variant="h6">
          Class Name: {subjectDetails?.sclassName?.sclassName}
        </Typography>
        {subjectDetails?.teacher ? (
          <Typography variant="h6">Teacher: {subjectDetails.teacher.name}</Typography>
        ) : (
          <GreenButton
            variant="contained"
            onClick={() =>
              navigate(`/Admin/teachers/addteacher/${subjectDetails._id}`)
            }
          >
            Add Subject Teacher
          </GreenButton>
        )}
      </>
    );
  };

  const SubjectStudentsSection = () => (
    <>
      {getresponse ? (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <GreenButton
            variant="contained"
            onClick={() => navigate(`/Admin/class/addstudents/${classID}`)}
          >
            Add Students
          </GreenButton>
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Students List
          </Typography>
          {selectedSection === 'attendance' && (
            <TableTemplate
              columns={studentColumns}
              rows={studentRows}
              buttonHaver={StudentsAttendanceButtonHaver}
            />
          )}
          {selectedSection === 'marks' && (
            <TableTemplate
              columns={studentColumns}
              rows={studentRows}
              buttonHaver={StudentsMarksButtonHaver}
            />
          )}

          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              value={selectedSection}
              onChange={handleSectionChange}
              showLabels
            >
              <BottomNavigationAction
                label="Attendance"
                value="attendance"
                icon={
                  selectedSection === 'attendance' ? (
                    <TableChartIcon />
                  ) : (
                    <TableChartOutlinedIcon />
                  )
                }
              />
              <BottomNavigationAction
                label="Marks"
                value="marks"
                icon={
                  selectedSection === 'marks' ? (
                    <InsertChartIcon />
                  ) : (
                    <InsertChartOutlinedIcon />
                  )
                }
              />
            </BottomNavigation>
          </Paper>
        </>
      )}
    </>
  );

  if (error) console.error(error);

  return subloading ? (
    <div>Loading...</div>
  ) : (
    <Box sx={{ width: '100%' }}>
      <TabContext value={tabValue}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            position: 'fixed',
            width: '100%',
            backgroundColor: 'white',
            zIndex: 2,
          }}
        >
          <TabList onChange={handleTabChange}>
            <Tab label="Details" value="1" />
            <Tab label="Students" value="2" />
          </TabList>
        </Box>

        <Container sx={{ marginTop: '4rem', marginBottom: '5rem' }}>
          <TabPanel value="1">
            <SubjectDetailsSection />
          </TabPanel>
          <TabPanel value="2">
            <SubjectStudentsSection />
          </TabPanel>
        </Container>
      </TabContext>
    </Box>
  );
};

export default ViewSubject;
