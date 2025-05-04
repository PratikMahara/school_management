/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { subjectSchema } from "../../../yupSchema/subjectSchema";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  AddCircleOutline as AddIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from "@mui/icons-material";

export default function Subject() {
  const [studentSubject, setStudentSubject] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      axios
        .delete(`${baseUrl}/subject/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
          console.log("Error deleting subject", e);
        });
    }
  };

  const handleEdit = (id) => {
    setEdit(true);
    axios.get(`${baseUrl}/subject/fetch-single/${id}`)
      .then((resp) => {
        Formik.setFieldValue("subject_name", resp.data.data.subject_name);
        Formik.setFieldValue("subject_codename", resp.data.data.subject_codename);
        setEditId(resp.data.data._id);
      })
      .catch((e) => {
        console.log("Error fetching subject data", e);
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
  };

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    subject_name: "",
    subject_codename: ""
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      if (isEdit) {
        axios
          .patch(`${baseUrl}/subject/update/${editId}`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
      } else {
        axios
          .post(`${baseUrl}/subject/create`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
        Formik.resetForm();
      }
    },
  });

  const fetchstudentssubject = () => {
    axios
      .get(`${baseUrl}/subject/fetch-all`)
      .then((resp) => {
        setStudentSubject(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching subjects", e);
      });
  };

  useEffect(() => {
    fetchstudentssubject();
  }, [message]);

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
        margin: '0 auto',
        backgroundColor: '#F5F5F5', 
        borderRadius: 2
      }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
          backgroundColor: '#4CAF50', 
          padding: 2, 
          borderRadius: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BookIcon sx={{ 
              fontSize: '2.5rem', 
              color: 'white', 
              backgroundColor: '#1976D2',
              p: 1,
              borderRadius: '50%' 
            }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              color: 'white'
            }}>
              Subject Management
            </Typography>
          </Box>
          <Chip 
            label={`Total Subjects: ${studentSubject.length}`}
            color="secondary"
            variant="outlined"
            sx={{ 
              fontSize: '1rem',
              px: 2,
              py: 1,
              color: '#fff', 
              borderColor: '#fff' 
            }}
          />
        </Box>

        {/* Add/Edit Form */}
        <Paper sx={{ 
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom right, #ffffff, #f0f0f0)',
          border: '1px solid #ddd'
        }}>
          <Typography variant="h5" sx={{ 
            mb: 3,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#1976D2'
          }}>
            {isEdit ? (
              <>
                <EditIcon /> Edit Subject
              </>
            ) : (
              <>
                <AddIcon /> Add New Subject
              </>
            )}
          </Typography>

          <Box component="form" onSubmit={Formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subject Name"
                  variant="outlined"
                  name="subject_name"
                  value={Formik.values.subject_name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.subject_name && Boolean(Formik.errors.subject_name)}
                  helperText={Formik.touched.subject_name && Formik.errors.subject_name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      borderColor: '#1976D2',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#1976D2'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subject Codename"
                  variant="outlined"
                  name="subject_codename"
                  value={Formik.values.subject_codename}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.subject_codename && Boolean(Formik.errors.subject_codename)}
                  helperText={Formik.touched.subject_codename && Formik.errors.subject_codename}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      borderColor: '#1976D2',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#1976D2'
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3
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
                    py: 1,
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light',
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isEdit ? <EditIcon /> : <AddIcon />}
                sx={{
                  borderRadius: 1,
                  px: 4,
                  py: 1,
                  backgroundColor: '#1976D2',
                  '&:hover': {
                    backgroundColor: '#1565C0'
                  }
                }}
              >
                {isEdit ? 'Update' : 'Add'} Subject
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Subjects Table */}
        <Typography variant="h5" sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#1976D2'
        }}>
          <InfoIcon color="primary" /> All Subjects
        </Typography>

        {studentSubject.length === 0 ? (
          <Paper sx={{ 
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: '#f7e6ff'
          }}>
            <Typography variant="h6" color="text.secondary">
              No subjects found. Add your first subject above.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ 
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#1976D2' }}>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 700,
                    color: 'white'
                  }}>Subject</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700,
                    color: 'white'
                  }} align="right">Codename</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700,
                    color: 'white'
                  }} align="right">Status</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700,
                    color: 'white'
                  }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentSubject.map((subject) => (
                  <TableRow
                    key={subject._id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        backgroundColor: '#e3f2fd'
                      }
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main',
                        width: 36,
                        height: 36
                      }}>
                        <BookIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {subject.subject_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={subject.subject_codename}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label="Active"
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(subject._id)}
                            sx={{ 
                              color: '#1976D2',
                              '&:hover': {
                                backgroundColor: '#bbdefb'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(subject._id)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
