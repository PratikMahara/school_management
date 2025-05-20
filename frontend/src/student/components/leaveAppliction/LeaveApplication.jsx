import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  EventNote,
  Today,
  CalendarMonth,
  Subject,
  Description,
  Send,
  Person,
  Class as ClassIcon,
  Group
} from "@mui/icons-material";

const StudentLeaveApplication = () => {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    fromDate: "",
    toDate: "",
    reason: "",
    description: ""
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackbarOpen(true);
    // Submit formData to backend or process it here
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          <EventNote sx={{ mr: 1, verticalAlign: "middle" }} /> Leave Application
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                InputProps={{ startAdornment: <ClassIcon sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                InputProps={{ startAdornment: <Group sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                label="From Date"
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <Today sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                label="To Date"
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <CalendarMonth sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="reason-label">Reason</InputLabel>
                <Select
                  labelId="reason-label"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  startAdornment={<Subject sx={{ mr: 1 }} />}
                >
                  <MenuItem value="Sick">Sick</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                InputProps={{ startAdornment: <Description sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Send />}
                fullWidth
              >
                Submit Application
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Leave application submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentLeaveApplication;