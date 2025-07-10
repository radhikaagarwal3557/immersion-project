import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Chart from 'chart.js/auto';
import { useSelector } from 'react-redux';

const AssignmentBarChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const assignments = useSelector(state => state.userState.assignments);

  useEffect(() => {
    const ctx = chartRef.current;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (assignments && assignments.length > 0) {
      const labels = assignments.map((a) => `Assignment ${a.id}`);
      const scores = assignments.map((a) => a.score);

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Assignment Score',
              data: scores,
              backgroundColor: 'rgba(75, 12, 186, 0.6)',
              borderColor: '#4b0dba',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Score',
              },
              ticks: {
                stepSize: 10,
              },
            },
            x: {
              title: {
                display: true,
                text: 'Assignment ID',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Student Assignment Scores',
              font: {
                size: 18,
                weight: 'bold',
              },
            },
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [assignments]);

  return (
    <Box component={Paper} sx={{ p: 3, height: 400 }} elevation={3}>
      <Typography variant="h6" align="center" gutterBottom>
        Assignment Bar Chart
      </Typography>
      <canvas ref={chartRef}></canvas>
    </Box>
  );
};

export default AssignmentBarChart;