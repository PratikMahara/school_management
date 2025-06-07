"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  ImageList,
  ImageListItem,
  Skeleton,
} from "@mui/material"
import {
  Visibility,
  Search,
  Person,
  CalendarToday,
  // Removed CheckCircle, Pending, Cancel since status is gone
  Close,
  PlayArrow,
  Download,
  Refresh,
} from "@mui/icons-material"
import axios from "axios"
import { baseUrl } from "@/environment";

const ComplaintCard = () => {
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${baseUrl}/student/complaints`);
        setComplaints(response.data.data)
        // console.log("Fetched complaints:", response.data.data)
        setFilteredComplaints(response.data.data)
      } catch (error) {
        console.error("Error fetching complaints:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  useEffect(() => {
    let filtered = complaints

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.complaint.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredComplaints(filtered)
  }, [complaints, searchTerm])

  const handleComplaintClick = (complaint) => {
    // console.log("here it is : ",  complaint)
    setSelectedComplaint(complaint)
    setIsDetailDialogOpen(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Complaint Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage student complaints efficiently
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={10}> {/* Adjusted grid size */}
              <TextField
                fullWidth
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Removed Status filter TextField */}
            <Grid item xs={12} md={2}> {/* Adjusted grid size */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  setSearchTerm("")
                  // Removed setStatusFilter("all")
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Complaints List */}
      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} key={item}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={24} />
                  </Box>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredComplaints.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No complaints found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm
                ? "Try adjusting your search term" // Updated message
                : "No complaints have been submitted yet"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredComplaints.map((complaint) => (
            <Grid item xs={12} key={complaint._id}>
              <Card 
                sx={{ 
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }} 
                onClick={() => handleComplaintClick(complaint)}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}> 
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <Person />
                      </Avatar>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* Removed Chip for status */}
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {complaint.complaint}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarToday fontSize="small" />
                        {/* Assuming submittedAt is from Mongoose timestamps */}
                        {formatDate(complaint.createdAt)} 
                      </Typography>
                      {/* Using complaint.media if it's not null */}
                      {complaint.media && (
                        <Chip label={`1 attachment`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Complaint Detail Dialog */}
      <Dialog
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: "70vh" },
        }}
      >
        {selectedComplaint && (
          <>
            <DialogContent dividers>
              <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Complaint Timings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted: {formatDate(selectedComplaint.createdAt)}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Complaint Description */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Complaint Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {selectedComplaint.complaint}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Attachments */}


                {/* {selectedComplaint.media && ( // Check for media existence */}
                  {/* <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Attachment
                      </Typography>
                      <ImageList cols={3} gap={8}>
                          <ImageListItem key={selectedComplaint.media}>
                            <Paper variant="outlined" sx={{ p: 1, textAlign: "center" }}>
                                <Box
                                  component="img"
                                  // This URL might need adjustment based on how your backend serves media
                                  src={`${baseUrl}/uploads/${selectedComplaint.media}`} 
                                  alt="Complaint Media"
                                  sx={{
                                    width: "100%",
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    mb: 1,
                                  }}
                                />
                              <Typography variant="caption" noWrap>
                                {selectedComplaint.media}
                              </Typography>
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </Paper>
                          </ImageListItem>
                      </ImageList>
                    </Paper>
                  </Grid> */}
                  

                  {selectedComplaint.media.endsWith(".pdf") ? (
                <embed
                  src={`../${selectedComplaint.media}`}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              ) : (
                <img
                  src={`../${selectedComplaint.media}` || "/placeholder.svg"}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )}


                  
                {/* )} */}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
              {/* Removed status update buttons */}
              <Button onClick={() => setIsDetailDialogOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default ComplaintCard;