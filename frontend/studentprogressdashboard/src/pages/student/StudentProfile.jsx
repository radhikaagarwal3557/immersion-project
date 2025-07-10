import React, { useContext, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import DataContext from "../../context/DataContext";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Required"),
  cPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const StudentProfile = () => {
  const { loggedUser, handleProfileUpdate, handleHead, isLoading } =
    useContext(DataContext);

  useEffect(() => {
    handleHead("Student Profile");
  }, []);

  const attendanceData = [
    { month: "Jan", present: 18 },
    { month: "Feb", present: 20 },
    { month: "Mar", present: 22 },
  ];

  const resultData = loggedUser?.results || [
    { subject: "Math", marks: 80, grade: "A", status: "Pass" },
    { subject: "English", marks: 60, grade: "B", status: "Pass" },
    { subject: "Physics", marks: 35, grade: "C", status: "Fail" },
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 5 }}>
      {/* Profile Update Form */}
      <Card elevation={4} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Student Profile
          </Typography>
          <Formik
            enableReinitialize
            initialValues={{
              name: loggedUser?.name || "",
              email: loggedUser?.email || "",
              batch: loggedUser?.batch || "",
              rollNo: loggedUser?.rollNo || "",
              password: "",
              cPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleProfileUpdate(values);
              resetForm({ values: "" });
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Full Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth name="email" label="Email" value={values.email} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth name="batch" label="Batch" value={values.batch} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth name="rollNo" label="Roll Number" value={values.rollNo} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="cPassword"
                      label="Confirm Password"
                      type="password"
                      value={values.cPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cPassword && Boolean(errors.cPassword)}
                      helperText={touched.cPassword && errors.cPassword}
                    />
                  </Grid>
                  <Grid item xs={12} textAlign="center">
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || isLoading}>
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Attendance Graph */}
      <Card elevation={4} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Result History Table */}
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Exam Results</Typography>
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
              {resultData.map((res, index) => (
                <TableRow key={index}>
                  <TableCell>{res.subject}</TableCell>
                  <TableCell>{res.marks}</TableCell>
                  <TableCell>{res.grade}</TableCell>
                  <TableCell sx={{ color: res.status === "Pass" ? "green" : "red" }}>
                    {res.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentProfile;
