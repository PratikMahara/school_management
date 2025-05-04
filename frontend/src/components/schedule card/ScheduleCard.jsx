import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ScheduleCard = ({ schedule, onEdit, onDelete, userRole }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleViewSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleDownload = (scheduleFile, class_num, class_section) => {
    const fileName = class_num + class_section
    const extension = scheduleFile.split('.').pop(); // get file extension
    const link = document.createElement("a");
    link.href = scheduleFile;
    link.download = `${fileName.replace(/\s+/g, "_")}_schedule.${extension}`; // use original extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 3 }}>
        <Table aria-label="schedule table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log("This is the schedule that is passed: ", schedule)}
            {schedule.map((item) => (
              <TableRow key={item._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {item.class.class_num} {item.class.class_section}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    aria-label="view schedule"
                    onClick={() => handleViewSchedule(item)}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="download item"
                    onClick={() => handleDownload(item.file, item.class.classs_num, item.class.class_section)}
                    size="small"
                  >
                    <DownloadIcon />
                  </IconButton>
                  {userRole === "SCHOOL" && (
                    <>
                      <IconButton
                        color="info"
                        aria-label="edit item"
                        onClick={() => onEdit(item)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="info"
                        aria-label="edit item"
                        onClick={() => onDelete(item._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for item preview */}
      <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
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

          {selectedSchedule && (
            <>
              {selectedSchedule.file.endsWith(".pdf") ? (
                <embed
                  src={selectedSchedule.file}
                  type="application/pdf"
                  width="80%"
                  height="600px"
                />
              ) : (
                <img
                  src={selectedSchedule.file || "/placeholder.svg"}
                  alt={`${selectedSchedule.class_num} Preview`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )}
            </>
          )}
        </DialogContent>
        {/* <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
          <Typography variant="subtitle1">{selectedSchedule?.class_num}</Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => selectedSchedule && handleDownload(selectedSchedule.file, selectedSchedule.class_num)}
          >
            Download
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default ScheduleCard;
