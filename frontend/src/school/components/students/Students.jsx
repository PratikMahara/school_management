import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Avatar,
  Chip,
  Grid,
  IconButton,
  Divider,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  CircularProgress
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { studentSchema } from "../../../yupSchema/studentSchema";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon
} from "@mui/icons-material";

export default function Students() {
  const [studentClass, setStudentClass] = useState([]);
  const [students, setStudents] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [params, setParams] = useState({});
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [loading, setLoading] = useState(false);

  // Image handling
  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleClass = (e) => {
    setParams(prev => ({ ...prev, student_class: e.target.value || undefined }));
  };

  const handleSearch = (e) => {
    setParams(prev => ({ ...prev, search: e.target.value || undefined }));
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        setLoading(true);
        const resp = await axios.delete(`${baseUrl}/student/delete/${id}`);
        setMessage(resp.data.message);
        setType("success");
      } catch (e) {
        setMessage(e.response?.data?.message || "Error deleting student");
        setType("error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const resp = await axios.get(`${baseUrl}/student/fetch-single/${id}`);
      const data = resp.data.data;
      Formik.setValues({
        email: data.email,
        name: data.name,
        student_class: data.student_class?._id || "",
        gender: data.gender,
        age: data.age,
        guardian: data.guardian,
        guardian_phone: data.guardian_phone,
        password: data.password,
      });
      setImageUrl(data.image ? `${baseUrl}/${data.image}` : null);      
      setEditId(data._id);
      setEdit(true);
    } catch (e) {
      console.log("Error in fetching edit data.", e);
      setMessage("Error loading student data");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
    handleClearFile();
  };

  const resetMessage = () => setMessage("");

  const initialValues = {
    name: "",
    email: "",
    student_class: "",
    gender: "",
    age: "",
    guardian: "",
    guardian_phone: "",
    password: "",
  };

   const Formik = useFormik({
      initialValues,
      validationSchema: studentSchema,
      onSubmit: async (values) => {
        try {
          setLoading(true);
          const fd = new FormData();
          Object.keys(values).forEach(key => {
            if (values[key]) fd.append(key, values[key]);
          });
          
          if (file) {
            fd.append("image", file, file.name);
          }
    
          if (isEdit) {
            const resp = await axios.patch(`${baseUrl}/student/update/${editId}`, fd);
            setMessage(resp.data.message);
            setType("success");
            handleClearFile();
            cancelEdit();
          } else {
            if (file) {
              const resp = await axios.post(`${baseUrl}/student/register`, fd);
              setMessage(resp.data.message);
              setType("success");
              // Force refresh of student list
              fetchStudents();
              Formik.resetForm();
              handleClearFile();
            } else {
              setMessage("Please provide an image.");
              setType("error");
            }
          }
        } catch (e) {
          setMessage(e.response?.data?.message || "An error occurred");
          setType("error");
        } finally {
          setLoading(false);
        }
      },
    });
  
    const fetchStudentClass = async () => {
      try {
        const resp = await axios.get(`${baseUrl}/class/fetch-all`);
        setStudentClass(resp.data.data);
      } catch (e) {
        console.log("Error in fetching student Class", e);
      }
    };
  
    const fetchStudents = async () => {
      try {
        const resp = await axios.get(`${baseUrl}/student/fetch-with-query`, { params });
        setStudents(resp.data.data);
      } catch (e) {
        console.log("Error in fetching students data", e);
      }
    };
  
    useEffect(() => {
      fetchStudents();
      fetchStudentClass();
    }, [message, params]);
  
    // File input handling
    const fileInputRef = useRef(null);
    const handleClearFile = () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      setImageUrl(null);
    };

  return (
    <>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}
      
      <Box sx={{ 
        p: { xs: 2, md: 4 },
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SchoolIcon sx={{ 
              fontSize: '2.5rem', 
              color: 'primary.main',
              backgroundColor: 'primary.light',
              p: 1,
              borderRadius: '50%'
            }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Student Management
            </Typography>
          </Box>
          <Chip 
            label={`Total Students: ${students.length}`}
            color="primary"
            variant="outlined"
            sx={{ 
              fontSize: '1rem',
              px: 2,
              py: 1
            }}
          />
        </Box>

        {/* Search and Filter Section */}
        <Paper sx={{ 
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="primary" /> Filter Students
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by name"
                variant="outlined"
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Class</InputLabel>
                <Select
                  label="Filter by Class"
                  onChange={handleClass}
                >
                  {studentClass.map((value, i) => (
                    <MenuItem key={i} value={value._id}>
                      {value.class_section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Add/Edit Form */}
        <Paper sx={{ 
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to bottom right, #f5f9ff, #ffffff)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h5" sx={{ 
            mb: 3,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main'
          }}>
            {isEdit ? (
              <>
                <EditIcon /> Edit Student
              </>
            ) : (
              <>
                <PersonIcon /> Register New Student
              </>
            )}
          </Typography>

          <Box component="form" onSubmit={Formik.handleSubmit}>
            {/* Image Upload */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              gap: 3,
              flexWrap: 'wrap'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 1
              }}>
                <Avatar
                  src={imageUrl}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light'
                  }}
                >
                  {!imageUrl && <AddPhotoIcon sx={{ fontSize: 40 }} />}
                </Avatar>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoIcon />}
                    sx={{ borderRadius: 1 }}
                    disabled={loading}
                  >
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      onChange={addImage}
                      ref={fileInputRef}
                      accept="image/*"
                    />
                  </Button>
                  {imageUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleClearFile}
                      sx={{ borderRadius: 1 }}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>

              {imageUrl && (
                <Box sx={{ 
                  flex: 1,
                  minWidth: 200,
                  maxWidth: 300,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 2
                }}>
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt="Student preview"
                    sx={{ 
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              {/* Personal Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  name="name"
                  value={Formik.values.name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.name && Boolean(Formik.errors.name)}
                  helperText={Formik.touched.name && Formik.errors.name}
                  sx={{ mb: 2 }}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={Formik.values.email}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.email && Boolean(Formik.errors.email)}
                  helperText={Formik.touched.email && Formik.errors.email}
                  sx={{ mb: 2 }}
                  disabled={loading}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      variant="outlined"
                      name="age"
                      type="number"
                      value={Formik.values.age}
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      error={Formik.touched.age && Boolean(Formik.errors.age)}
                      helperText={Formik.touched.age && Formik.errors.age}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        label="Gender"
                        name="gender"
                        value={Formik.values.gender}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        error={Formik.touched.gender && Boolean(Formik.errors.gender)}
                        disabled={loading}
                      >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Class & Guardian Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                  Academic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Class</InputLabel>
                  <Select
                    label="Class"
                    name="student_class"
                    value={Formik.values.student_class}
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                    error={Formik.touched.student_class && Boolean(Formik.errors.student_class)}
                    disabled={loading}
                  >
                    {studentClass.map((value, i) => (
                      <MenuItem key={i} value={value._id}>
                        {value.class_section}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: 'text.secondary' }}>
                  Guardian Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  label="Guardian Name"
                  variant="outlined"
                  name="guardian"
                  value={Formik.values.guardian}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.guardian && Boolean(Formik.errors.guardian)}
                  helperText={Formik.touched.guardian && Formik.errors.guardian}
                  sx={{ mb: 2 }}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Guardian Phone"
                  variant="outlined"
                  name="guardian_phone"
                  value={Formik.values.guardian_phone}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.guardian_phone && Boolean(Formik.errors.guardian_phone)}
                  helperText={Formik.touched.guardian_phone && Formik.errors.guardian_phone}
                  disabled={loading}
                />

                {!isEdit && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: 'text.secondary' }}>
                      Account Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TextField
                      fullWidth
                      label="Password"
                      variant="outlined"
                      name="password"
                      type="password"
                      value={Formik.values.password}
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      error={Formik.touched.password && Boolean(Formik.errors.password)}
                      helperText={Formik.touched.password && Formik.errors.password}
                      disabled={loading}
                    />
                  </>
                )}
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4
            }}>
              {isEdit && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={cancelEdit}
                  sx={{
                    borderRadius: 1,
                    px: 3,
                    py: 1
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (isEdit ? <EditIcon /> : <PersonIcon />)}
                sx={{
                  borderRadius: 1,
                  px: 4,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (isEdit ? 'Update' : 'Register')} Student
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Students List */}
        <Typography variant="h5" sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SchoolIcon color="primary" /> Student Directory
        </Typography>

        {loading && students.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : students.length === 0 ? (
          <Paper sx={{ 
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'action.hover'
          }}>
            <Typography variant="h6" color="text.secondary">
              No students found. Register your first student above.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {students.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student._id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Box sx={{ 
                    position: 'relative',
                    height: 180,
                    overflow: 'hidden'
                  }}>
                 <CardMedia
     component="img"
     image={imageUrl}
  alt={student.name}
  sx={{
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }}
 
/>
                    <Box sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      display: 'flex',
                      gap: 1
                    }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(student._id)}
                          sx={{
                            backgroundColor: 'primary.light',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(student._id)}
                          sx={{
                            backgroundColor: 'error.light',
                            '&:hover': {
                              backgroundColor: 'error.main',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {student.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {student.email}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SchoolIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Class: {student.student_class?.class_section || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Guardian: {student.guardian}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ 
                    justifyContent: 'space-between',
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Chip 
                      label={student.gender || 'N/A'}
                      color={student.gender === 'female' ? 'secondary' : 'primary'}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Age: {student.age}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}