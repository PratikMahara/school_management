import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography, CircularProgress } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import axios from 'axios';
import { entranceSchema } from "../../../yupSchema/entranceSchema";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";

export default function Entrance() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetMessage = () => setMessage("");

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      email: "",
      phone: 9000000000,
      classId: "",
      preschool: ""
    },
    validationSchema: entranceSchema,
    onSubmit: async (values, helpers) => {
      if (!file) {
        setType("error");
        setMessage("Please provide an image.");
        return;
      }

      const fd = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        fd.append(key, val);
      });
      fd.append("image", file);

      try {
        setSubmitting(true);
        const resp = await axios.post(`http://localhost:5173/entrance`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setType("success");
        setMessage(resp.data.message || "Submitted successfully.");
        helpers.resetForm();
        setFile(null);
        // Optionally navigate on success
        // navigate('/thank-you');
      } catch (err) {
        setType("error");
        setMessage(err.response?.data?.message || "Submission failed.");
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, backgroundColor: '#fff7ed', minHeight: '100vh' }}>
      <Box sx={{ width: '100%', maxWidth: 450 }}>
        {message && <CustomizedSnackbars type={type} message={message} reset={resetMessage} />}

        <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
          <Link to="/" style={{ position: 'absolute', top: 16, left: 16, textDecoration: 'none' }}>
            <Button size="small" variant="text" sx={{ color: '#f97316', textTransform: 'none' }}>← Back</Button>
          </Link>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="orange">Entrance</Typography>
            <Typography variant="body2" color="textSecondary">Fill your details for Entrance Examination</Typography>
          </Box>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            {['name','address','email','preschool'].map(field => (
              <TextField
                key={field}
                fullWidth
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                margin="normal"
                size="small"
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched[field] && formik.errors[field])}
                helperText={formik.touched[field] && formik.errors[field]}
              />
            ))}

            <TextField
              fullWidth
              name="phone"
              label="Phone"
              margin="normal"
              size="small"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.phone && formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <FormControl fullWidth margin="normal" error={Boolean(formik.touched.classId && formik.errors.classId)}>
              <InputLabel id="class-label">Class</InputLabel>
              <Select
                labelId="class-label"
                id="class-select"
                name="classId"
                value={formik.values.classId}sss
                label="Class"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {/* You can fetch options dynamically or import as constant */}
                <MenuItem value="class1">Class 1</MenuItem>
                <MenuItem value="class2">Class 2</MenuItem>
              </Select>
              {formik.touched.classId && formik.errors.classId && (
                <Typography variant="caption" color="error">{formik.errors.classId}</Typography>
              )}
            </FormControl>

            {/* File Upload */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              {file ? file.name : 'Upload Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
              />
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{ mt: 3, textTransform: 'none', fontWeight: 'bold', py: 1 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
