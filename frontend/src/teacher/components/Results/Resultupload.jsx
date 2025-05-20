import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
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
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [allClasses, setAllClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [allExam, setAllExam] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loading, setLoading] = useState(false);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

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
        console.error("Error in fetching student classes:", e);
        setLoadingClasses(false);
        showSnackbar("Failed to load classes", "error");
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
        console.error("Error fetching students:", e);
        setStudents([]);
        setLoadingStudents(false);
        showSnackbar("Failed to load students", "error");
      });
  };

  // Fetch all examinations
  const fetchAllExamination = () => {
    axios
      .get(`${baseUrl}/examination/all`)
      .then((resp) => {
        if (resp.data.success) {
          setAllExam(resp.data.data);
          if (resp.data.data.length > 0) {
            setSelectedExam(resp.data.data[0]._id);
          }
        } else {
          setAllExam([]);
        }
      })
      .catch((e) => {
        console.error("Error fetching examinations:", e);
        setAllExam([]);
        showSnackbar("Failed to load examinations", "error");
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
    if (!selectedClass || !selectedExam || !file) {
      showSnackbar("Please fill all required fields and upload a file", "error");
      return;
    }

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("classId", selectedClass);
    formData.append("examId", selectedExam);
    formData.append("resultFile", file);

    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/teacher/uploadresult`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token
          }
        }
      );
      
      if (response.data.success) {
        showSnackbar("Result uploaded successfully!");
        // Reset form
        setFile(null);
      } else {
        showSnackbar(response.data.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Error uploading result:", error);
      showSnackbar(error.response?.data?.message || "Failed to upload result. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: "12px" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#1976d2", mb: 3 }}>
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
              {allExam.length > 0 ? (
                allExam.map((exam) => (
                  <MenuItem key={exam._id} value={exam._id}>
                    {exam.examType}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">
                  <em>No exams found</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <Box mt={3} mb={3}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFile />}
              fullWidth
              sx={{
                py: 1.5,
                border: file ? "1px solid #4caf50" : "1px dashed #1976d2",
                backgroundColor: file ? "rgba(76, 175, 80, 0.04)" : "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                  border: "1px solid #1976d2"
                }
              }}
            >
              {file ? "Change PDF File" : "Upload Result PDF"}
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            {file && (
              <Typography variant="body2" mt={1} color="success.main" pl={1}>
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
            sx={{ 
              py: 1.5, 
              mt: 2,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
              transition: "background-color 0.3s"
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
                Uploading...
              </>
            ) : (
              "Submit Result"
            )}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResultUpload;