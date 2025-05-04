import { useState } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import DownloadIcon from "@mui/icons-material/Download"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';


const SyllabusCard = ({ syllabus, onEdit, onDelete, userRole }) => {
  const [openPreview, setOpenPreview] = useState(false)
  const [selectedSyllabus, setSelectedSyllabus] = useState(null)

  const handleViewSyllabus = (syllabus) => {
    setSelectedSyllabus(syllabus)
    setOpenPreview(true)
  }

  const handleClosePreview = () => {
    setOpenPreview(false)
  }

  const handleDownload = (syllabusFile, title) => {
    console.log(title)
    const extension = syllabusFile.split('.').pop(); // get file extension
    const link = document.createElement("a");
    link.href = syllabusFile;
    link.download = `${title.replace(/\s+/g, "_")}_syllabus.${extension}`; // use original extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 3 }}>
        <Table aria-label="syllabus table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Syllabus Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log(syllabus)}
            {syllabus.map((syllabi) => (
              <TableRow key={syllabi._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {syllabi.class.class_section}
                </TableCell>
                <TableCell>{syllabi.title}</TableCell>
                <TableCell>{syllabi.description}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    aria-label="view syllabi"
                    onClick={() => handleViewSyllabus(syllabi)}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="download syllabi"
                    onClick={() => handleDownload(syllabi.file, syllabi.title)}
                    size="small"
                  >
                    <DownloadIcon />
                  </IconButton>
                  {
                    userRole === "SCHOOL" && (
                      <>
                      <IconButton
                      color="info"
                      aria-label="edit syllabi"
                      onClick={() => onEdit(syllabi)}
                      size="small"
                      >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="info"
                        aria-label="edit syllabi"
                        onClick={() => onDelete(syllabi._id)}
                        size="small"
                        >
                          <DeleteIcon />
                    </IconButton>
                    </>
                    )
                  }
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

          {selectedSyllabus && (
            <>
              {selectedSyllabus.file.endsWith(".pdf") ? (
                <embed
                  src={selectedSyllabus.file}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              ) : (
                <img
                  src={selectedSyllabus.file || "/placeholder.svg"}
                  alt={`${selectedSyllabus.class_num} Preview`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SyllabusCard
