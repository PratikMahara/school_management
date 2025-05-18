import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Paper,
  Grid,
  Snackbar,
  Alert
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";

const students = [
  { id: 1, name: "Sagar" },
  { id: 2, name: "Binita" },
  { id: 3, name: "Ramesh" }
];

const exams = ["Mid Term", "Final Term", "Quarterly", "Annual"];
const classes = ["Class 1", "Class 2", "Class 3", "Class 4"];

const ResultUpload = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [file, setFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedStudent || !selectedExam || !file) {
      alert("Please fill all fields and upload a file.");
      return;
    }
    // Handle file upload logic here
    console.log({ selectedClass, selectedStudent, selectedExam, file });
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Upload Student Result
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  value={selectedClass}
                  label="Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classes.map((className, index) => (
                    <MenuItem key={index} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="student-label">Student</InputLabel>
                <Select
                  labelId="student-label"
                  value={selectedStudent}
                  label="Student"
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="exam-label">Exam</InputLabel>
                <Select
                  labelId="exam-label"
                  value={selectedExam}
                  label="Exam"
                  onChange={(e) => setSelectedExam(e.target.value)}
                >
                  {exams.map((exam, index) => (
                    <MenuItem key={index} value={exam}>
                      {exam}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadFile />}
              >
                Upload Result PDF
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>
              {file && <Typography mt={1}>Selected File: {file.name}</Typography>}
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Submit Result
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Result uploaded successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResultUpload;
