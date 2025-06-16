import { useState } from "react"
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  Button
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import DownloadIcon from "@mui/icons-material/Download"

const CalendarCard = ({ calendar, onDelete, userRole }) => {
  const [openPreview, setOpenPreview] = useState(false)

  const handleView = () => {
    setOpenPreview(true)
  }

  const handleClose = () => {
    setOpenPreview(false)
  }

  const handleDownload = () => {
    const fileName = calendar?.file.split("/").pop()
    const link = document.createElement("a")
    link.href = calendar?.file
    link.download = `calendar_${fileName}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Paper sx={{ maxWidth: 600, margin: "auto", mt: 3, p: 3, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Academic Calendar
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
          <IconButton color="primary" onClick={handleView}>
            <VisibilityIcon />
          </IconButton>

          <IconButton color="secondary" onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>

          {userRole === "SCHOOL" && (
            <IconButton color="error" onClick={() => onDelete(calendar._id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          Uploaded At: {new Date(calendar.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>

      <Dialog open={openPreview} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" }
            }}
          >
            <CloseIcon />
          </IconButton>

          {calendar?.file.endsWith(".pdf") ? (
            <embed src={calendar.file} type="application/pdf" width="100%" height="600px" />
          ) : (
            <img src={calendar.file} alt="Calendar Preview" style={{ width: "100%", height: "auto" }} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CalendarCard
