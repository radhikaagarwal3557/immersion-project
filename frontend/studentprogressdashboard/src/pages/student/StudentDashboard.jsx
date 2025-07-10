// src/pages/StudentDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { useGetStudentDataQuery } from '../features/student/studentApiSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';
import BarChart from '../components/chart/BarChart';

const StudentDashboard = () => {
  const { classId } = useParams();
  const { data, isLoading, isSuccess, isError, error } = useGetStudentDataQuery(classId);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (data?.assignments?.length) {
      setChartData({
        labels: data.assignments.map((item) => `Assignment-${item.id}`),
        datasets: [
          {
            label: 'Assignment Score',
            data: data.assignments.map((item) => item.score),
            backgroundColor: '#4b0dba',
          },
        ],
      });
    }
  }, [data?.assignments]);

  if (isLoading) return <Loading open />;
  if (isError) return <Error error={error} />;

  const { miscellaneousInfo, attendance, subjects, results, assignments } = data;

  return (
    <Box sx={{ p: 3 }}>
      {/* Assignment Progress Chart */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Assignment Progress
        </Typography>
        {assignments?.length > 0 ? (
          <BarChart chartData={chartData} />
        ) : (
          <Typography>No assignment data available.</Typography>
        )}
      </Paper>

      {/* Attendance Summary */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Attendance Summary
        </Typography>
        <Grid container spacing={2} textAlign="center">
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1">Total Days</Typography>
              <Typography variant="h6">{attendance?.totalDays || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1">Days Present</Typography>
              <Typography variant="h6">{attendance?.presentDays || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1">Attendance %</Typography>
              <Typography variant="h6">
                {attendance?.totalDays
                  ? `${Math.round((attendance.presentDays / attendance.totalDays) * 100)}%`
                  : 'N/A'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Subjects & Teachers Table */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Subjects & Teachers
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects?.length > 0 ? (
                subjects.map((subj, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{subj.name}</TableCell>
                    <TableCell>{subj.teacherName}</TableCell>
                    <TableCell>{subj.teacherEmail}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>No subjects assigned.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Exam Results Table */}
      <Paper sx={{ p: 2 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Exam Results
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results?.length > 0 ? (
                results.map((res, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{res.subject}</TableCell>
                    <TableCell>{res.marks}</TableCell>
                    <TableCell>{res.grade}</TableCell>
                    <TableCell sx={{ color: res.status === 'Pass' ? 'green' : 'red' }}>
                      {res.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No results available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
