import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Divider,
} from "@mui/material"
import { Delete, PhotoCamera, Videocam, AttachFile, Send, CheckCircle, Error as ErrorIcon } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import { baseUrl } from "@/environment";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

const ComplaintBox = () => {
  const [complaint, setComplaint] = useState("")
  const [attachments, setAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [errors, setErrors] = useState({})

  const handleComplaintChange = (event) => {
    setComplaint(event.target.value)
    if (errors.complaint) {
      setErrors((prev) => ({ ...prev, complaint: "" }))
    }
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/avi", "video/mov"]

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, file: `File ${file.name} is too large. Maximum size is 10MB.` }))
        return false
      }
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, file: `File ${file.name} is not a supported format.` }))
        return false
      }
      return true
    })

    const newAttachments = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
    setErrors((prev) => ({ ...prev, file: "" }))
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const updated = prev.filter((attachment) => attachment.id !== id)
      // Clean up object URLs to prevent memory leaks
      const toRemove = prev.find((attachment) => attachment.id === id)
      if (toRemove && toRemove.preview) {
        URL.revokeObjectURL(toRemove.preview)
      }
      return updated
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateForm = () => {
    const newErrors = {}

    if (!complaint.trim()) {
      newErrors.complaint = "Please describe your complaint"
    } else if (complaint.trim().length < 10) {
      newErrors.complaint = "Complaint must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("complaint", complaint.trim())

      attachments.forEach((attachment, index) => {
        if (attachments.length > 0) {
          formData.append("media", attachments[0].file)
        }
      })

      //api call
      await axios.post(`${baseUrl}/student/complaints`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })



      setSubmitStatus("success")
      setShowSuccessDialog(true)

      // Reset form
      setComplaint("")
      setAttachments([])
      setErrors({})
    } catch (error) {
      console.error("Error submitting complaint:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false)
    setSubmitStatus(null)
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" component="h1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorIcon color="primary" />
              Student Complaint Box
            </Typography>
          }
          sx={{ bgcolor: "primary.main", color: "white" }}
        />

        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Complaint Text Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Describe your complaint"
                  placeholder="Please provide detailed information about your complaint..."
                  value={complaint}
                  onChange={handleComplaintChange}
                  error={!!errors.complaint}
                  helperText={errors.complaint || `${complaint.length}/1000 characters`}
                  inputProps={{ maxLength: 1000 }}
                  required
                  variant="outlined"
                />
              </Grid>

              {/* File Upload Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Attachments (Optional)
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  <Button component="label" variant="outlined" startIcon={<PhotoCamera />} size="small">
                    Add Photos
                    <VisuallyHiddenInput type="file" multiple accept="image/*" onChange={handleFileUpload} />
                  </Button>

                  <Button component="label" variant="outlined" startIcon={<Videocam />} size="small">
                    Add Videos
                    <VisuallyHiddenInput type="file" multiple accept="video/*" onChange={handleFileUpload} />
                  </Button>

                  <Button component="label" variant="outlined" startIcon={<AttachFile />} size="small">
                    Browse Files
                    <VisuallyHiddenInput type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} />
                  </Button>
                </Box>

                {errors.file && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.file}
                  </Alert>
                )}

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Attached Files ({attachments.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {attachments.map((attachment) => (
                        <Grid item xs={12} sm={6} md={4} key={attachment.id}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              position: "relative",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => removeAttachment(attachment.id)}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "error.main",
                                color: "white",
                                "&:hover": { bgcolor: "error.dark" },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>

                            {attachment.preview ? (
                              <Box
                                component="img"
                                src={attachment.preview}
                                alt={attachment.name}
                                sx={{
                                  width: "100%",
                                  height: 100,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                  mb: 1,
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 100,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "grey.100",
                                  borderRadius: 1,
                                  mb: 1,
                                }}
                              >
                                <Videocam sx={{ fontSize: 40, color: "grey.500" }} />
                              </Box>
                            )}

                            <Typography variant="caption" noWrap sx={{ width: "100%", textAlign: "center" }}>
                              {attachment.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(attachment.size)}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setComplaint("")
                      setAttachments([])
                      setErrors({})
                    }}
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                    disabled={isSubmitting || !complaint.trim()}
                    sx={{ minWidth: 140 }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                  </Button>
                </Box>
              </Grid>

              {/* Status Messages */}
              {submitStatus === "error" && (
                <Grid item xs={12}>
                  <Alert severity="error">Failed to submit complaint. Please try again later.</Alert>
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
          <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 1 }} />
          <Typography variant="h5">Complaint Submitted Successfully!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Thank you for your feedback. Your complaint has been received and will be reviewed by our team. You will be
            notified once we have an update.
          </Typography>
          <Chip label="Complaint ID: #CP2025001" color="primary" variant="outlined" sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button onClick={handleCloseSuccessDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ComplaintBox
