// src/pages/Results.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useGetStudentDataQuery } from '../features/student/studentApiSlice';
import { selectSearchTerm } from '../features/search/SearchSlice';

import Loading from '../components/Loading';
import Error from '../components/Error';
import { CardWrapper } from '../components/CardWrapper';
import { CustomNoRowsOverlay } from '../components/NoRowsOverlay';

const Results = () => {
  const { classId } = useParams(); // Get classId from URL
  const { data, isLoading, isSuccess, isError, error } = useGetStudentDataQuery(classId);
  const searchTerm = useSelector(selectSearchTerm); // Get search from Redux

  // Define DataGrid columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'examType', headerName: 'Examination Name', width: 220 },
    {
      field: 'description',
      headerName: 'Description',
      width: 800,
      renderCell: (params) => (
        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
          {params.value}
        </div>
      ),
    },
  ];

  // Filter result data using searchTerm
  const filteredResults = data?.results?.filter((result) => {
    const term = (searchTerm || '').toLowerCase();
    return (
      result.id?.toString().includes(term) ||
      result.examType?.toLowerCase().includes(term) ||
      result.description?.toLowerCase().includes(term)
    );
  });

  // Handle loading, error, and success states
  if (isLoading) return <Loading open={true} />;
  if (isError) return <Error error={error} />;

  return (
    <CardWrapper title="Exam Results">
      <Box sx={{ width: '100%', mt: 2 }}>
        <DataGrid
          rows={filteredResults || []}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Box>
    </CardWrapper>
  );
};

export default Results;
