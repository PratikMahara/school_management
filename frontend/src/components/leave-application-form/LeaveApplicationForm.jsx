"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Grid,
  Chip,
} from "@mui/material"
import { Send, CalendarToday, Description, CheckCircle, Person, EventNote } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { styled } from "@mui/material/styles"

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 700,
  margin: "0 auto",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  },
}))

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    reason: "",
    description: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Mock student data - in real app, this would come from authentication/context
  const studentInfo = {
    name: "John Doe",
    class: "Grade 10-A",
    rollNo: "10A-023",
    studentId: "STU001",
  }

  const reasonOptions = [
    { value: "sick", label: "Sick Leave", color: "#f44336" },
    { value: "personal", label: "Personal Work", color: "#2196f3" },
    { value: "emergency", label: "Emergency", color: "#ff9800" },
    { value: "other", label: "Other", color: "#9c27b0" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }

    // Clear submit error
    if (submitError) {
      setSubmitError("")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate from date
    if (!formData.fromDate) {
      newErrors.fromDate = "From date is required"
    }

    // Validate to date
    if (!formData.toDate) {
      newErrors.toDate = "To date is required"
    } else if (formData.fromDate && formData.toDate < formData.fromDate) {
      newErrors.toDate = "To date cannot be earlier than from date"
    }

    // Validate reason
    if (!formData.reason) {
      newErrors.reason = "Please select a reason for leave"
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Please provide a description"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    // Check if dates are in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (formData.fromDate && formData.fromDate < today) {
      newErrors.fromDate = "From date cannot be in the past"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateLeaveDays = () => {
    if (formData.fromDate && formData.toDate) {
      const timeDiff = formData.toDate.getTime() - formData.fromDate.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
      return daysDiff
    }
    return 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, you would make an API call like:
      // const response = await fetch('/api/leave-applications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     studentId: studentInfo.studentId,
      //     fromDate: formData.fromDate,
      //     toDate: formData.toDate,
      //     reason: formData.reason,
      //     description: formData.description,
      //     leaveDays: calculateLeaveDays()
      //   })
      // })

      setSubmitSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fromDate: null,
          toDate: null,
          reason: "",
          description: "",
        })
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting leave application:", error)
      setSubmitError("Failed to submit leave application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getReasonColor = (reason) => {
    const option = reasonOptions.find((opt) => opt.value === reason)
    return option ? option.color : "#666"
  }

  if (submitSuccess) {
    return (
      <Box sx={{ p: 3 }}>
        <StyledCard>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "success.main" }}>
              Application Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your leave application has been sent to your class teacher for approval.
            </Typography>
            <Chip
              label={`Application ID: #LA${Date.now().toString().slice(-6)}`}
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.9rem", py: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              You will be notified once your application is reviewed.
            </Typography>
          </CardContent>
        </StyledCard>
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <StyledCard>
          {/* Header */}
          <CardHeader
            title={
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  Leave Application
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Submit your leave request to your class teacher
                </Typography>
              </Box>
            }
            sx={{
              pb: 1,
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "16px 16px 0 0",
            }}
          />

          <CardContent sx={{ p: 4 }}>
            {/* Student Information */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(102, 126, 234, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                <Person />
                Student Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Name:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {studentInfo.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Class:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {studentInfo.class}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Roll No:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {studentInfo.rollNo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {studentInfo.studentId}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Error Alert */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {submitError}
              </Alert>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Date Selection */}
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="From Date"
                        value={formData.fromDate}
                        onChange={(date) => handleInputChange("fromDate", date)}
                        slots={{ textField: StyledTextField }}
                        slotProps={{
                        textField: {
                            fullWidth: true,
                            error: !!errors.fromDate,
                            helperText: errors.fromDate,
                            InputProps: {
                            startAdornment: <CalendarToday sx={{ mr: 1, color: "primary.main" }} />,
                            },
                        },
                        }}
                        minDate={new Date()}
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="To Date"
                        value={formData.toDate}
                        onChange={(date) => handleInputChange("toDate", date)}
                        slots={{ textField: StyledTextField }}
                        slotProps={{
                        textField: {
                            fullWidth: true,
                            error: !!errors.toDate,
                            helperText: errors.toDate,
                            InputProps: {
                            startAdornment: <CalendarToday sx={{ mr: 1, color: "primary.main" }} />,
                            },
                        },
                        }}
                        minDate={formData.fromDate || new Date()}
                    />
                </Grid>


                {/* Leave Days Display */}
                {formData.fromDate && formData.toDate && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: "bold" }}>
                        Total Leave Days: {calculateLeaveDays()}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Reason Selection */}
                <Grid item xs={12}>
                  <StyledFormControl fullWidth error={!!errors.reason}>
                    <InputLabel>Reason for Leave</InputLabel>
                    <Select
                      value={formData.reason}
                      label="Reason for Leave"
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      startAdornment={<EventNote sx={{ mr: 1, color: "primary.main" }} />}
                    >
                      {reasonOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: option.color,
                              }}
                            />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.reason && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {errors.reason}
                      </Typography>
                    )}
                  </StyledFormControl>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    placeholder="Please provide detailed reason for your leave application..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description || `${formData.description.length}/500 characters`}
                    inputProps={{ maxLength: 500 }}
                    InputProps={{
                      startAdornment: (
                        <Description sx={{ mr: 1, color: "primary.main", alignSelf: "flex-start", mt: 1 }} />
                      ),
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                      sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        },
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {isSubmitting ? "Submitting Application..." : "Submit Leave Application"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>
      </Box>
    </LocalizationProvider>
  )
}

export default LeaveApplicationForm
