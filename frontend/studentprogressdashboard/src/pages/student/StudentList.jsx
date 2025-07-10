import React, { lazy, Suspense, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

function validateStudent(student) {
  return {
    name: !validateRequired(student.name) ? 'Name is Required' : '',
    email: !validateEmail(student.email) ? 'Incorrect Email Format' : '',
    rollNumber: !validateRequired(student.rollNumber) ? 'Roll No is Required' : '',
    className: !validateRequired(student.className) ? 'Class is Required' : '',
  };
}

const StudentList = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(() => [
    { accessorKey: 'rollNumber', header: 'Roll No' },
    {
      accessorKey: 'name',
      header: 'Name',
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.name,
        helperText: validationErrors?.name,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, name: undefined })),
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      muiEditTextFieldProps: {
        required: true,
        type: 'email',
        error: !!validationErrors?.email,
        helperText: validationErrors?.email,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, email: undefined })),
      },
    },
    {
      accessorKey: 'className',
      header: 'Class',
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.className,
        helperText: validationErrors?.className,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, className: undefined })),
      },
    },
  ], [validationErrors]);

  const { mutateAsync: createStudent } = useCreateStudent();
  const {
    data: fetchedStudents = [],
    isError: isLoadingStudentsError,
    isFetching: isFetchingStudents,
    isLoading: isLoadingStudents,
  } = useGetStudents();
  const { mutateAsync: updateStudent } = useUpdateStudent();
  const { mutateAsync: deleteStudent } = useDeleteStudent();

  const handleCreateStudent = async ({ values, table }) => {
    const newValidationErrors = validateStudent(values);
    if (Object.values(newValidationErrors).some((e) => e)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createStudent(values);
    table.setCreatingRow(null);
  };

  const handleSaveStudent = async ({ values, table }) => {
    const newValidationErrors = validateStudent(values);
    if (Object.values(newValidationErrors).some((e) => e)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateStudent(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(row.original._id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedStudents,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row._id,
    muiToolbarAlertBannerProps: isLoadingStudentsError
      ? { color: 'error', children: 'Error loading data' }
      : undefined,
    muiTableContainerProps: { sx: { minHeight: '500px' } },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateStudent,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveStudent,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Create New Student</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Add New Student
      </Button>
    ),
    state: {
      isLoading: isLoadingStudents,
      isSaving: false,
      showAlertBanner: isLoadingStudentsError,
      showProgressBars: isFetchingStudents,
    },
  });

  return <MaterialReactTable table={table} />;
};

const useGetStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/students');
      return data;
    },
    refetchOnWindowFocus: false,
  });
};

const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student) => {
      await axios.post('http://localhost:5000/api/students', student);
    },
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });
};

const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student) => {
      await axios.put(`http://localhost:5000/api/students/${student._id}`, student);
    },
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });
};

const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentList />
      <Suspense fallback={null}></Suspense>
    </QueryClientProvider>
  );
}
