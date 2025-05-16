/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  CardMedia,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { teacherSchema } from "../../../yupSchema/teacherSchemal";
import TeacherCardAdmin from "../../utility components/teacher card/TeacherCard";

export default function Teachers() {
  const [teacherClass, setteacherClass] = useState([]);
  const [teachers, setteachers] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [date, setDate] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [params, setParams] = useState({});
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const fileInputRef = useRef(null);

  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };

  const handleSearch = (e) => {
    let newParam;
    if (e.target.value !== "") {
      newParam = { ...params, search: e.target.value };
    } else {
      newParam = { ...params };
      delete newParam["search"];
    }
    setParams(newParam);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/teacher/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
          console.log("Error, deleting", e);
        });
    }
  };

  const handleEdit = (id) => {
    setEdit(true);
    axios
      .get(`${baseUrl}/teacher/fetch-single/${id}`)
      .then((resp) => {
        Formik.setFieldValue("email", resp.data.data.email);
        Formik.setFieldValue("name", resp.data.data.name);
        Formik.setFieldValue("qualification", resp.data.data.qualification);
        Formik.setFieldValue("gender", resp.data.data.gender);
        Formik.setFieldValue("age", resp.data.data.age);
        Formik.setFieldValue("password", resp.data.data.password);
        setEditId(resp.data.data._id);
      })
      .catch((e) => {
        console.log("Error in fetching edit data.");
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
    handleClearFile();
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setFile(null); // Reset the file state
    setImageUrl(null); // Clear the image preview
  };

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    email: "",
    name: "",
    qualification: "",
    gender: "",
    age: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: teacherSchema,
    onSubmit: (values) => {
      const fd = new FormData();
      Object.keys(values).forEach((key) => fd.append(key, values[key]));
      if (file) {
        fd.append("image", file, file.name);
      }

      if (isEdit) {
        axios
          .patch(`${baseUrl}/teacher/update/${editId}`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            handleClearFile();
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Failed to update teacher.");
            setType("error");
          });
      } else {
        if (file) {
          axios
            .post(`${baseUrl}/teacher/register`, fd)
            .then((resp) => {
              setMessage(resp.data.message);
              setType("success");
              handleClearFile();
              Formik.resetForm();
              setFile(null);
            })
            .catch((e) => {
              setMessage(e.response?.data?.message || "Failed to add teacher.");
              setType("error");
              console.log("Error, response admin teacher calls", e);
            });
        } else {
          setMessage("Please provide image.");
          setType("error");
        }
      }
    },
  });

  const fetchteachers = () => {
    axios
      .get(`${baseUrl}/teacher/fetch-with-query`, { params: params })
      .then((resp) => {
        setteachers(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching teacher calls admin data", e);
      });
  };

  useEffect(() => {
    fetchteachers();
  }, [message, params]);

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}
      <Box
        sx={{
          padding: "40px 10px 20px 10px",
          maxWidth: "960px",
          margin: "auto",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
          }}
          component={"div"}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#1976d2",
              textShadow: "1px 1px 2px rgb(25 118 210 / 0.5)",
              letterSpacing: "2px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Teachers
          </Typography>
        </Box>

        <Paper
          sx={{
            padding: "30px",
            marginBottom: "40px",
            boxShadow:
              "0 4px 12px rgba(25, 118, 210, 0.15), 0 8px 20px rgba(25, 118, 210, 0.1)",
            borderRadius: "12px",
            backgroundColor: "#f9faff",
          }}
          elevation={4}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "25px",
              color: isEdit ? "#0d47a1" : "#1976d2",
            }}
          >
            {isEdit ? "Edit Teacher" : "Add New Teacher"}
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Teacher Pic
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  sx={{}}
                  variant="outlined"
                  name="file"
                  type="file"
                  onChange={addImage}
                  inputRef={fileInputRef}
                  fullWidth
                  InputProps={{
                    sx: {
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    },
                  }}
                />
                {file && (
                  <Box
                    sx={{
                      position: "relative",
                      mt: 2,
                      width: "240px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow:
                        "0 4px 8px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(25, 118, 210, 0.15)",
                    }}
                    component={"div"}
                  >
                    <CardMedia component={"img"} image={imageUrl} height={"240px"} />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
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
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={Formik.values.name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.name && Boolean(Formik.errors.name)}
                  helperText={Formik.touched.name && Formik.errors.name}
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Qualification"
                  variant="outlined"
                  name="qualification"
                  value={Formik.values.qualification}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={
                    Formik.touched.qualification && Boolean(Formik.errors.qualification)
                  }
                  helperText={Formik.touched.qualification && Formik.errors.qualification}
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ borderRadius: "8px" }}>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender-select"
                    label="Gender"
                    name="gender"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                    value={Formik.values.gender}
                    error={Formik.touched.gender && Boolean(Formik.errors.gender)}
                    sx={{
                      borderRadius: "8px",
                    }}
                  >
                    <MenuItem value={""}>Select Gender</MenuItem>
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                  </Select>
                  {Formik.touched.gender && Formik.errors.gender && (
                    <Typography
                      variant="caption"
                      sx={{ color: "error.main", ml: 2, mt: "2px", display: "block" }}
                    >
                      {Formik.errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  variant="outlined"
                  name="age"
                  value={Formik.values.age}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.age && Boolean(Formik.errors.age)}
                  helperText={Formik.touched.age && Formik.errors.age}
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              {!isEdit && (
                <Grid item xs={12} sm={6}>
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
                    InputProps={{
                      sx: { borderRadius: "8px" },
                    }}
                  />
                </Grid>
              )}

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: "16px",
                    borderRadius: "8px",
                    background:
                      "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                    boxShadow:
                      "0 3px 5px 2px rgba(33, 203, 243, .3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #21cbf3 30%, #2196f3 90%)",
                      boxShadow:
                        "0 5px 15px 4px rgba(33, 203, 243, .6)",
                    },
                  }}
                >
                  Submit
                </Button>
                {isEdit && (
                  <Button
                    variant="outlined"
                    onClick={cancelEdit}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: "16px",
                      borderRadius: "8px",
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Box
          sx={{
            padding: "5px",
            minWidth: 120,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <TextField
            id="search-teacher"
            label="Search Name..."
            onChange={handleSearch}
            sx={{
              width: "100%",
              maxWidth: "400px",
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {teachers &&
            teachers.map((teacher, i) => {
              return (
                <TeacherCardAdmin
                  key={i}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  teacher={teacher}
                />
              );
            })}
        </Box>
      </Box>
    </>
  );
}
