import { useState } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CloseIcon from "@mui/icons-material/Close"
import { Box, Divider, Typography } from "@mui/material"


const ViewLeaveApplicationCard = ({ leaveApplications }) => {
  const [openPreview, setOpenPreview] = useState(false)
  const [selectedLeaveApplications, setSelectedLeaveApplications] = useState(null)

  const handleViewLeaveApplication = (leaveApplication) => {
    setSelectedLeaveApplications(leaveApplication)
    setOpenPreview(true)
  }

  const handleClosePreview = () => {
    setOpenPreview(false)
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 3 }}>
        <Table aria-label="Leave Applications">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveApplications.map((leaveApplication) => (
              <TableRow key={leaveApplication._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {leaveApplication.student.name}
                </TableCell>
                <TableCell>{leaveApplication.student.student_class.class_num}</TableCell>
                <TableCell>{leaveApplication.student.student_class.class_section}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    aria-label="view leaveApplication"
                    onClick={() => handleViewLeaveApplication(leaveApplication)}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for syllabi preview */}
      <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedLeaveApplications && (
            <Box sx={{ p: 4 }}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
                  Leave Application
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="subtitle1">
                    <strong>Student Name:</strong> {selectedLeaveApplications.student.name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Class:</strong> {selectedLeaveApplications.student.student_class.class_num}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Section:</strong> {selectedLeaveApplications.student.student_class.class_section}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Reason for Leave:</strong> {selectedLeaveApplications.reason}
                </Typography>

                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedLeaveApplications.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">
                    <strong>From:</strong> {new Date(selectedLeaveApplications.fromDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>To:</strong> {new Date(selectedLeaveApplications.toDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: "right", fontStyle: "italic" }}>
                  Submitted on: {new Date(selectedLeaveApplications.createdAt).toLocaleDateString()}
                </Box>
              </Paper>
            </Box>
          )}

        </DialogContent>
      </Dialog>
    </>
  )
}

export default ViewLeaveApplicationCard
