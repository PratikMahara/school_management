import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { loginSchema } from "../../../yupSchema/loginSchema";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <-- Add Link
import "./Login.css";
import { AuthContext } from "../../../context/AuthContext";

export default function Login() {
  const { authenticated, login } = useContext(AuthContext);
  const [loginType, setLoginType] = useState("student");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const navigate = useNavigate();

  const resetMessage = () => {
    setMessage("");
  };

  const handleSelection = (e) => {
    setLoginType(e.target.value);
    resetInitialValue();
  };

  const resetInitialValue = () => {
    Formik.setFieldValue("email", "");
    Formik.setFieldValue("password", "");
  };

  const initialValues = {
    email: "",
    password: ""
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      let url;
      let navUrl;
      if (loginType === "school_owner") {
        url = `${baseUrl}/school/login`;
        navUrl = '/school';
      } else if (loginType === "teacher") {
        url = `${baseUrl}/teacher/login`;
        navUrl = '/teacher';
      } else if (loginType === "student") {
        url = `${baseUrl}/student/login`;
        navUrl = '/student';
      }

      axios.post(url, { ...values }).then(resp => {
        setMessage(resp.data.message);
        setType("success");
        let token = resp.headers.get("Authorization");
        if (resp.data.success) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(resp.data.user));
          navigate(navUrl);
          login(resp.data.user);
        }
        Formik.resetForm();
      }).catch(e => {
        setMessage(e.response.data.message);
        setType("error");
      });
    }
  });

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fff7ed", // Light beige background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message} />}

      <Box sx={{ width: "100%", maxWidth: "450px", position: "relative" }}>
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            position: "relative",
          }}
        >

          {/* Back Button */}
          <Link to="/" style={{ textDecoration: 'none', position: 'absolute', top: '20px', left: '20px' }}>
            <Button
              size="small"
              variant="text"
              sx={{
                color: '#f97316',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                }
              }}
            >
              ← Back
            </Button>
          </Link>

          {/* Orange Icon */}
          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#f97316",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              fontSize: "28px",
              mb: 2,
            }}
          >
            🔒
          </Box>

          {/* Title and Subtext */}
          <Typography variant="h5" fontWeight="bold" color="orange" mb={1}>
            School Management System
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Enter your credentials to access your account
          </Typography>

          {/* Form Starts Here */}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
          >
            {/* User Type Selection */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="user-type-label">User Type</InputLabel>
              <Select
                labelId="user-type-label"
                id="user-type-select"
                label="User Type"
                value={loginType}
                onChange={handleSelection}
              >
                <MenuItem value={"student"}>Student</MenuItem>
                <MenuItem value={"teacher"}>Teacher</MenuItem>
                <MenuItem value={"school_owner"}>School Owner</MenuItem>
              </Select>
            </FormControl>

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              size="small"
              name="email"
              value={Formik.values.email}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.email && Formik.errors.email && (
              <Typography color="error" fontSize="0.8rem" textAlign="left">
                {Formik.errors.email}
              </Typography>
            )}

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              size="small"
              name="password"
              value={Formik.values.password}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.password && Formik.errors.password && (
              <Typography color="error" fontSize="0.8rem" textAlign="left">
                {Formik.errors.password}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 2,
                backgroundColor: "#f97316",
                "&:hover": {
                  backgroundColor: "#ea580c",
                },
                textTransform: "none",
                fontWeight: "bold",
                padding: "10px",
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
