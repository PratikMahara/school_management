import React, { useEffect, useState } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { baseUrl } from "../../../environment";
import axios from "axios";

const ResultUpload = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [file, setFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [allClasses, setAllClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [allExam, setAllExam] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch classes from the backend
  const fetchStudentClass = () => {
    setLoadingClasses(true);
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        const fetchedClasses = resp.data.data;
        setAllClasses(fetchedClasses);
        if (fetchedClasses.length > 0) {
          setSelectedClass(fetchedClasses[0]._id);
        }
        setLoadingClasses(false);
      })
      .catch((e) => {
        console.log("Error in fetching student Class", e);
        setLoadingClasses(false);
      });
  };

  // Fetch students based on selected class
  const fetchStudentsByClass = (classId) => {
    if (!classId) return;
    setLoadingStudents(true);
    axios
      .get(`${baseUrl}/student/by-class/${classId}`)
      .then((resp) => {
        if (resp.data.success) {
          setStudents(resp.data.data);
          if (resp.data.data.length > 0) {
            setSelectedStudent(resp.data.data[0]._id);
          } else {
            setSelectedStudent("");
          }
        } else {
          setStudents([]);
        }
        setLoadingStudents(false);
      })
      .catch((e) => {
        console.log("Error fetching students:", e);
        setStudents([]);
        setLoadingStudents(false);
      });
  };

  // Fetch all examinations
  const fetchAllExamination = () => {
    axios
      .get(`${baseUrl}/examination/all`)
      .then((resp) => {
        if (resp.data.success) {
          setAllExam(resp.data.data);
        } else {
          setAllExam([]);
        }
      })
      .catch((e) => {
        console.log("Error fetching examinations:", e);
        setAllExam([]);
      });
  };

  useEffect(() => {
    fetchStudentClass();
    fetchAllExamination();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedStudent || !selectedExam || !file) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("result_class", selectedClass);
    formData.append("studentId", selectedStudent);
    formData.append("examtype", selectedExam);
    formData.append("resultpdf", file);

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/teacher/uploadresult`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setOpenSnackbar(true);
      // Reset form
      setSelectedExam("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading result:", error);
      alert("Failed to upload result. Please try again.");
    }
    setLoading(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upload Student Result
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={loadingClasses}
            >
              {loadingClasses ? (
                <MenuItem value="">
                  <em>Loading classes...</em>
                </MenuItem>
              ) : (
                allClasses.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.class_name || cls.class_num || cls._id}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Student</InputLabel>
            <Select
              value={selectedStudent}
              label="Student"
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={loadingStudents || !selectedClass}
            >
              {loadingStudents ? (
                <MenuItem value="">
                  <em>Loading students...</em>
                </MenuItem>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">
                  <em>No students found</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Exam</InputLabel>
            <Select
              value={selectedExam}
              label="Exam"
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              {allExam.map((exam) => (
                <MenuItem key={exam._id} value={exam._id}>
                  {exam.examType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2} mb={2}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFile />}
              fullWidth
            >
              Upload Result PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            {file && (
              <Typography variant="body2" mt={1}>
                Selected File: {file.name}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Uploading..." : "Submit Result"}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Result uploaded successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResultUpload;
