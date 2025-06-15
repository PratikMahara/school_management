import {
  Box,
  MenuItem,
  Select,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Grid,
  Chip,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { classSchema } from "../../../yupSchema/classSchema";

//icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClassIcon from '@mui/icons-material/Class';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Class() {
  const [studentClass, setStudentClass] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/class/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
          console.error("Error, deleting", e);
        });
    }
  };

  const handleEdit = (id) => {
    // console.log("Handle Edit is called", id);
    setEdit(true);
    axios
      .get(`${baseUrl}/class/fetch-single/${id}`)
      .then((resp) => {
        Formik.setFieldValue("class_num", resp.data.data.class_num);
        Formik.setFieldValue("class_section", resp.data.data.class_section);
        Formik.setFieldValue("class_teacher", resp.data.data.class_teacher._id);
        setEditId(resp.data.data._id);
      })
      .catch((e) => {
        console.error("Error in fetching edit data.");
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
  };

  // MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    class_num: "",
    class_section: "",
    class_teacher: ""
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: classSchema,
    onSubmit: (values) => {
      if (isEdit) {
        // console.log("edit id", editId);
        axios
          .patch(`${baseUrl}/class/update/${editId}`, {
            ...values,
          })
          .then((resp) => {
            // console.log("Edit submit", resp);
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.error("Error, edit casting submit", e);
          });
      } else {
        axios
          .post(`${baseUrl}/class/create`, { ...values })
          .then((resp) => {
            // console.log("Response after submitting admin casting", resp);
            setMessage(resp.data.message);
            setType("success");
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.error("Error, response admin casting calls", e);
          });
        Formik.resetForm();
      }
    },
  });

  const fetchstudentsClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        // console.error("Fetching data in Casting Calls admin.", resp);
        setStudentClass(resp.data.data);
      })
      .catch((e) => {
        console.error("Error in fetching casting calls admin data", e);
      });
  };

  const fetchTeachers = async() => {
    try {
      const response = await axios.get(`${baseUrl}/teacher/fetch-with-query`);
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setMessage("Failed to fetch teachers");
      setType("error");
    }
  }

  useEffect(() => {
    fetchTeachers()
    fetchstudentsClass();
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
        padding: { xs: "20px 10px", md: "40px 20px" },
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ClassIcon sx={{ fontSize: '3rem', color: 'primary.main' }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}>
              Class Management
            </Typography>
          </Box>
          <Chip 
            label={`Total Classes: ${studentClass.length}`} 
            color="primary" 
            variant="outlined"
            sx={{ 
              fontSize: '1rem',
              padding: '5px 10px',
              height: 'auto'
            }}
          />
        </Box>

          <Paper sx={{ 
            padding: { xs: '15px', md: '25px' },
            marginBottom: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(to bottom right, #f9f9f9, #ffffff)'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'primary.main'
            }}>
              {isEdit ? (
                <>
            <EditIcon /> Edit Class
                </>
              ) : (
                <>
            <AddCircleOutlineIcon /> Add New Class
                </>
              )}
            </Typography>

            <Box component="form" onSubmit={Formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="class_section"
              label="Class Section"
              variant="outlined"
              name="class_section"
              value={Formik.values.class_section}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              error={Formik.touched.class_section && Boolean(Formik.errors.class_section)}
              helperText={Formik.touched.class_section && Formik.errors.class_section}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
                </Grid>
                <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="class_num"
              label="Class Number"
              variant="outlined"
              name="class_num"
              value={Formik.values.class_num}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              error={Formik.touched.class_num && Boolean(Formik.errors.class_num)}
              helperText={Formik.touched.class_num && Formik.errors.class_num}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
                </Grid>
                  <Grid item xs={12} md={6}>
            <Select
              fullWidth
              id="class_teacher"
              name="class_teacher"
              displayEmpty
              value={Formik.values.class_teacher || ""}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              error={Formik.touched.class_teacher && Boolean(Formik.errors.class_teacher)}
              sx={{
                borderRadius: '8px',
                background: '#fff'
              }}
            >
              <MenuItem value="">
                <em>Select Class Teacher</em>
              </MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
            {Formik.touched.class_teacher && Formik.errors.class_teacher && (
              <Typography variant="caption" color="error">
                {Formik.errors.class_teacher}
              </Typography>
            )}
                </Grid>
              </Grid>

              <Box sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px',
                marginTop: '25px'
              }}>
                {isEdit && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={cancelEdit}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                padding: '8px 20px'
              }}
            >
              Cancel
            </Button>
                )}
                <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isEdit ? <EditIcon /> : <AddCircleOutlineIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              padding: '8px 25px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}
                >
            {isEdit ? 'Update' : 'Add'} Class
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Classes List */}
        <Typography variant="h5" sx={{ 
          fontWeight: 600,
          margin: '30px 0 15px',
          color: 'text.primary'
        }}>
          All Classes
        </Typography>

        {studentClass.length === 0 ? (
          <Paper sx={{ 
            padding: '40px',
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: 'action.hover'
          }}>
            <Typography variant="h6" color="text.secondary">
              No classes found. Add your first class above.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {studentClass.map((value) => (
              <Grid item xs={12} sm={6} md={4} key={value._id}>
                <Paper sx={{ 
                  padding: '20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.03)', 
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' 
                  }
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {value.class_num} - {value.class_section}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => handleEdit(value._id)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(value._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}
