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
  MenuItem,
  Avatar
} from "@mui/material";
import {
  AccountBalanceWallet,
  Payments,
  Image,
  QrCode,
  Class as ClassIcon,
  Person,
  Group
} from "@mui/icons-material";

const StudentFeeDue = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setSnackbarOpen(true);
    // Payment logic goes here
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          <AccountBalanceWallet sx={{ mr: 1, verticalAlign: "middle" }} />
          Due Fee Details
        </Typography>
        <Typography variant="body1" mb={2}>
          Total Due: <strong>Rs 5,000</strong>
        </Typography>
        <Button
          variant="contained"
          startIcon={<Payments />}
          fullWidth
          onClick={() => setShowPaymentForm(true)}
        >
          Pay Now
        </Button>
      </Paper>

      {showPaymentForm && (
        <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Payments sx={{ mr: 1, verticalAlign: "middle" }} /> Payment Form
          </Typography>
          <Box component="form" onSubmit={handlePaymentSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student Name"
                  InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Class"
                  InputProps={{ startAdornment: <ClassIcon sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Section"
                  InputProps={{ startAdornment: <Group sx={{ mr: 1 }} /> }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  <QrCode sx={{ mr: 1, verticalAlign: "middle" }} /> School QR Code:
                </Typography>
                <Avatar
                  variant="rounded"
                  src="/static/images/qr-code-placeholder.png"
                  alt="QR Code"
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <AccountBalanceWallet sx={{ mr: 1, verticalAlign: "middle" }} /> Account
                  Details:
                </Typography>
                <Typography variant="body2">
                  Account Name: ABC School<br />
                  Account Number: 1234567890<br />
                  IFSC Code: ABCD0123456
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Image />}
                >
                  Upload Payment Screenshot
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setPaymentProof(e.target.files[0])}
                  />
                </Button>
                {paymentProof && (
                  <Typography mt={1} variant="body2">
                    File selected: {paymentProof.name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Submit Payment Details
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Payment submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentFeeDue;