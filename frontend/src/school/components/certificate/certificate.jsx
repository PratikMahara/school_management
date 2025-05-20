import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button
} from "@mui/material";

export default function TransferCertificate() {
  const [formData, setFormData] = useState({
    refNo: '',
    date: '',
    studentName: '',
    fatherName: '',
    joiningYear: '',
    leavingYear: '',
    character: '',
    signature: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({ ...prev, signature: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transfer Certificate
      </Typography>
      <Grid container spacing={3}>
        {/* Form Box */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fill Certificate Details
            </Typography>
            <Box component="form" autoComplete="off">
              <TextField
                label="Ref No"
                id="refNo"
                value={formData.refNo}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date"
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Student Name"
                id="studentName"
                value={formData.studentName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Father's Name"
                id="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Joining Year"
                id="joiningYear"
                value={formData.joiningYear}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Leaving Year"
                id="leavingYear"
                value={formData.leavingYear}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Character & Conduct"
                id="character"
                value={formData.character}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 2 }}
              >
                Upload Signature
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preview Box */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h6" gutterBottom align="center">
              Certificate Preview
            </Typography>
            <Box sx={{
              fontFamily: 'serif',
              fontSize: 18,
              background: "#f9f9f9",
              borderRadius: 2,
              p: 2,
              minHeight: 320
            }}>
              <Typography align="center" fontWeight="bold" fontSize={20} mb={2}>
                123 School Lane, Knowledge City, Country
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <span><b>Ref No:</b> {formData.refNo || <span style={{ color: '#aaa' }}>________</span>}</span>
                <span><b>Date:</b> {formData.date || <span style={{ color: '#aaa' }}>________</span>}</span>
              </Box>
              <Typography mb={1}>To whom it may concern,</Typography>
              <Typography mb={1}>
                This is to certify that <b>{formData.studentName || '________'}</b>,
                {formData.fatherName ? ` ${formData.fatherName}` : ' son/daughter of __________'},
                was a bonafide student of our institution from <b>{formData.joiningYear || '_____'}</b> to <b>{formData.leavingYear || '_____'}</b>.
              </Typography>
              <Typography mb={2}>
                During this period, his/her character and conduct have been found to be <b>{formData.character || '________'}</b>.
              </Typography>
              <Box mt={3} textAlign="right">
                <div>Signature:</div>
                {formData.signature ? (
                  <img src={formData.signature} alt="Signature" style={{ height: 40, marginTop: 4 }} />
                ) : (
                  <div style={{ color: '#aaa', fontStyle: 'italic' }}>No signature uploaded</div>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
