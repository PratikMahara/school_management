import React, { useState, useEffect, useRef } from "react";
import UpcomingEvents from './upcoming_events'; // ✅ Corrected import
import {
  Box,
  Typography,
  Paper,
  CardMedia,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import axios from "axios";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";
import styled from "@emotion/styled";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { DashboardLayout } from "../../../components/DashboardLayout/DashboardLayout";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  borderRadius: "20px",
  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
  transition: "0.3s ease",
  '&:hover': {
    transform: "translateY(-6px)",
    boxShadow: "0 20px 36px rgba(0, 0, 0, 0.3)",
  },
}));

const HighlightCard = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e3c72, #2a5298)",
  color: "#fff",
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  transition: "transform 0.3s ease, background 0.3s ease",
  '&:hover': {
    transform: "scale(1.1)",
    background: "linear-gradient(135deg, #2a5298, #1e3c72)",
  },
  fontSize: "1.2rem",
}));

const SchoolDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolImage, setSchoolImage] = useState("");
  const [schoolEdit, setSchoolEdit] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [notices, setNotices] = useState([]);
  const [audience, setAudience] = useState("all");
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const resetMessage = () => setMessage("");

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${baseUrl}/notices/fetch/${audience}`);
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [audience]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, teacherRes, classesRes, subjectsRes, schoolData] =
          await Promise.all([
            axios.get(`${baseUrl}/student/fetch-with-query`, { params: {} }),
            axios.get(`${baseUrl}/teacher/fetch-with-query`, { params: {} }),
            axios.get(`${baseUrl}/class/fetch-all`),
            axios.get(`${baseUrl}/subject/fetch-all`),
            axios.get(`${baseUrl}/school/fetch-single`),
          ]);

        setSchoolDetails(schoolData.data.data);
        setSchoolName(schoolData.data.data.school_name);
        setSchoolImage(schoolData.data.data.school_image);
        setTotalStudents(studentRes.data.data.length);
        setTotalTeachers(teacherRes.data.data.length);
        setClasses(classesRes.data.data);
        setSubjects(subjectsRes.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [message]);

  const handleSchoolEdit = () => {
    setSchoolEdit(true);
    setImageUrl(null);
  };

  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("school_name", schoolName);
    if (file) fd.append("image", file, file.name);

    axios
      .patch(`${baseUrl}/school/update`, fd)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
        handleClearFile();
        setSchoolEdit(false);
      })
      .catch((e) => {
        setMessage(e.response?.data?.message || "Something went wrong");
        setType("error");
      });
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        {message && (
          <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
        )}

        {schoolEdit && (
          <StyledPaper sx={{ maxWidth: 800, margin: "120px auto" }}>
            <Box component="form" noValidate autoComplete="off">
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Edit School Details
              </Typography>
              <TextField
                fullWidth
                label="School Name"
                variant="outlined"
                sx={{ mb: 2 }}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <TextField
                name="file"
                type="file"
                onChange={addImage}
                inputRef={fileInputRef}
                sx={{ mb: 2 }}
              />
              {imageUrl && (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  height="300px"
                  sx={{ borderRadius: 3, mb: 2 }}
                />
              )}
              <Box display="flex" gap={2}>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                  Submit
                </Button>
                <Button onClick={() => setSchoolEdit(false)} variant="outlined">
                  Cancel
                </Button>
              </Box>
            </Box>
          </StyledPaper>
        )}

        {preview && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 9999,
              height: "100vh",
              width: "100%",
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.5s ease",
            }}
          >
            <CardMedia
              component="img"
              image={`/images/uploaded/school/${schoolImage}`}
              sx={{ maxHeight: "90%", borderRadius: 2 }}
            />
            <Button
              onClick={() => setPreview(false)}
              sx={{
                color: "#fff",
                background: "tomato",
                position: "absolute",
                top: 20,
                right: 20,
                fontSize: 20,
                px: 3,
              }}
            >
              X
            </Button>
          </Box>
        )}

        {schoolDetails && (
          <Box
            sx={{
              position: "relative",
              height: 450,
              background: `url(/images/uploaded/school/${schoolDetails.school_image}) no-repeat center/cover`,
              borderRadius: 3,
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                background: "rgba(0, 0, 0, 0.4)",
                px: 4,
                py: 2,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {schoolDetails.school_name}
            </Typography>
            <Box sx={{ position: "absolute", bottom: 10, right: 10 }}>
              <IconButton onClick={() => setPreview(true)}>
                <PreviewIcon sx={{ color: "#fff", fontSize: 36 }} />
              </IconButton>
              <IconButton sx={{ ml: 1, backgroundColor: "white" }} onClick={handleSchoolEdit}>
                <EditIcon color="primary" />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Highlight Cards */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "30vh" }}
        >
          <Grid2 container spacing={4} maxWidth="md" justifyContent="center">
            <Grid2 xs={12} sm={6} md={3}>
              <HighlightCard>
                <Typography variant="h6">Total Students</Typography>
                <Typography variant="h3">{totalStudents}</Typography>
              </HighlightCard>
            </Grid2>
            <Grid2 xs={12} sm={6} md={3}>
              <HighlightCard>
                <Typography variant="h6">Total Teachers</Typography>
                <Typography variant="h3">{totalTeachers}</Typography>
              </HighlightCard>
            </Grid2>
            <Grid2 xs={12} sm={6} md={3}>
              <HighlightCard>
                <Typography variant="h6">Total Classes</Typography>
                <Typography variant="h3">{classes.length}</Typography>
              </HighlightCard>
            </Grid2>
            <Grid2 xs={12} sm={6} md={3}>
              <HighlightCard>
                <Typography variant="h6">Total Notices</Typography>
                <Typography variant="h3">{notices.length}</Typography>
              </HighlightCard>
            </Grid2>
          </Grid2>
        </Box>

        {/* ✅ Upcoming Events Section */}
        <Box sx={{ mt: 6 }}>
          <UpcomingEvents />
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default SchoolDashboard;
