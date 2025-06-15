import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { baseUrl } from "../../../environment";

export default function TeacherDetails() {
  const [teacher, setTeacher] = useState(null);
  const [notices, setNotices] = useState([]);

  const getTeacherDetails = () => {
    axios
      .get(`${baseUrl}/teacher/fetch-own`)
      .then((resp) => {
        console.log("Teacher Details from Teacher Details page", resp);
        setTeacher(resp.data.data);
        console.log("Single Teacher Details from Teacher Details page", resp);
      })
      .catch((e) => {
        console.log("Error in teacher", e);
      });
  };

  const getNotices = () => {
    axios
      .get(`${baseUrl}/notices/fetch/teacher`)
      .then((resp) => {
        setNotices(resp.data);
      })
      .catch((e) => {
        console.log("Error fetching notices", e);
      });
  };

  useEffect(() => {
    getTeacherDetails();
    getNotices();
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          marginBottom: 4,
          fontWeight: 700,
          color: "#2c3e50",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textShadow: "1px 1px 4px rgba(44, 62, 80, 0.2)",
          userSelect: "none",
        }}
      >
        Teacher Details
      </Typography>

      {teacher && (
        <>
          {/* Profile Image */}
          <Box
            component={"div"}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              mb: 5,
            }}
          >
            <Box
              component="img"
              src={`/images/uploaded/teacher/${teacher.teacher_image}`}
              alt="Teacher"
              sx={{
                height: 370,
                width: 370,
                borderRadius: "50%",
                border: "4px solid #4caf50",
                padding: "6px",
                boxShadow: "0 8px 24px rgba(76, 175, 80, 0.4)",
                objectFit: "cover",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 30px rgba(76, 175, 80, 0.6)",
                },
              }}
            />
          </Box>

          {/* Details Table */}
          <TableContainer
            component={Paper}
            elevation={8}
            sx={{
              margin: "auto",
              width: { xs: "95%", sm: "80%", md: "60%" },
              borderRadius: 4,
              boxShadow: "0 16px 40px rgba(44, 62, 80, 0.15)",
              backgroundColor: "#ffffff",
              overflow: "hidden",
              mb: 6,
            }}
          >
            <Table sx={{ minWidth: 300 }} aria-label="teacher details table">
              <TableBody>
                {[
                  { label: "Name", value: teacher.name, color: "#4caf50" },
                  { label: "Email", value: teacher.email, color: "#2196f3" },
                  { label: "Age", value: teacher.age, color: "#ff9800" },
                  { label: "Gender", value: teacher.gender, color: "#9c27b0" },
                  { label: "Qualification", value: teacher.qualification, color: "#f44336" },
                ].map(({ label, value, color }) => (
                  <TableRow
                    key={label}
                    sx={{
                      borderLeft: `6px solid ${color}`,
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: `${color}22`,
                      },
                    }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        fontWeight: 700,
                        color: color,
                        fontSize: "1.1rem",
                        borderBottom: "none",
                        width: "35%",
                        userSelect: "none",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: "#2c3e50",
                        fontSize: "1rem",
                        borderBottom: "none",
                        fontWeight: 600,
                        textTransform: label === "Email" ? "lowercase" : "none",
                      }}
                    >
                      {value || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Notice Board */}
          <Box
            sx={{
              maxWidth: 900,
              margin: "0 auto 40px",
              backgroundColor: "#ffffff",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(76, 175, 80, 0.15)",
              p: 4,
              px: { xs: 3, sm: 6 },
              userSelect: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AnnouncementIcon sx={{ color: "#4caf50", mr: 1.5, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#2c3e50" }}>
                Notice Board
              </Typography>
            </Box>
            <Box
              sx={{
                maxHeight: 280,
                overflowY: "auto",
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: "8px",
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: "#4caf50",
                  borderRadius: "4px",
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: "#e8f5e9",
                  borderRadius: "4px",
                },
              }}
            >
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <Box
                    key={notice._id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderLeft: "6px solid #4caf50",
                      backgroundColor: "#f1f8e9",
                      borderRadius: 2,
                      boxShadow: "0 2px 6px rgba(76, 175, 80, 0.1)",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#dcedc8",
                      },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#2c3e50" }}>
                      {notice.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#475569", mt: 0.5 }}>
                      {notice.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
                      {new Date(notice.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "#64748b", fontStyle: "italic" }}>
                  No notices available.
                </Typography>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
