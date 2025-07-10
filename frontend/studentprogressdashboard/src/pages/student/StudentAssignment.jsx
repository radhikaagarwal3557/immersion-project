// src/pages/Assignments.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useGetStudentDataQuery } from '../features/student/studentApiSlice';
import { selectSearchTerm } from '../features/search/SearchSlice';

import { CardWrapper } from '../components/CardWrapper';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { CustomNoRowsOverlay } from '../components/NoRowsOverlay';

const Assignments = () => {
  const { classId } = useParams(); // Get classId from route
  const { data, isLoading, isSuccess, isError, error } = useGetStudentDataQuery(classId);

  const searchTerm = useSelector(selectSearchTerm); // Selector from Redux search slice

  // Define DataGrid columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'subject', headerName: 'Subject Name', width: 180 },
    {
      field: 'description',
      headerName: 'Description',
      width: 400,
      renderCell: (params) => (
        <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
          {params.value}
        </div>
      ),
    },
    { field: 'lastDate', headerName: 'Last Date of Submission', width: 200 },
    { field: 'assignedBy', headerName: 'Assigned By', width: 160 },
  ];

  // Filter assignments using search term
  const filteredAssignments = data?.assignments?.filter((assignment) => {
    const term = (searchTerm || '').toLowerCase();

    return (
      !term ||
      assignment.subject?.toLowerCase().includes(term) ||
      assignment.description?.toLowerCase().includes(term) ||
      assignment.lastDate?.includes(term) ||
      assignment.assignedBy?.toLowerCase().includes(term)
    );
  });

  // Conditional Rendering
  if (isLoading) return <Loading open={true} />;
  if (isError) return <Error error={error} />;

  return (
    <CardWrapper title="Class Assignments">
      <Box sx={{ width: '100%', mt: 2 }}>
        <DataGrid
          rows={filteredAssignments || []}
          columns={columns}
          getRowId={(row) => row.id} // Ensure each row has unique ID
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

export default Assignments;
