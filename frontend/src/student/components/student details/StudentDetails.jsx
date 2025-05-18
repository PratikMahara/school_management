import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import "./StudentDetails.css"

export default function StudentDetails() {
  const [student, setStudent] = useState(null);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/student/fetch-own`)
      .then(resp => setStudent(resp.data.data))
      .catch(e => console.error("Error in student", e));
    axios.get(`${baseUrl}/notices/fetch/student`)
      .then(resp => setNotices(resp.data))
      .catch(e => console.error("Error fetching notices", e));
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontWeight: 700,
          color: '#2c3e50',
          letterSpacing: '0.5px',
          userSelect: 'none'
        }}
      >
        Student Details
      </Typography>

      {student && (
        <>
          {/* Image Container */}
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
              mb: 5,
            }}
          >
            <img
              src={`/images/uploaded/student/${student.student_image}`}
              alt="Student"
              height={370}
              width={370}
              style={{
                borderRadius: "50%",
                border: "6px solid #2980b9",
                boxShadow: "0 8px 20px rgba(41, 128, 185, 0.3)",
                objectFit: "cover"
              }}
            />
          </Box>

          {/* Flex container for side-by-side */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 6,
              px: 2,
              mb: 6,
              width: '100%',
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            {/* Left: Student Details Table */}
            <TableContainer
  component="div"
  sx={{
    flex: 1,
    borderRadius: 4,
    boxShadow: "0 16px 32px rgba(41, 128, 185, 0.2)",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    minWidth: 320,
  }}
>
  <Table aria-label="student details table" sx={{ minWidth: 300 }}>
    <TableBody>
      {[
        { label: "Email", value: student.email, color: '#6C63FF' },
        { label: "Name", value: student.name, color: '#FF6584' },
        { label: "Class", value: student.student_class?.class_section, color: '#3BB273' },
        { label: "Age", value: student.age, color: '#FFA41B' },
        { label: "Gender", value: student.gender, color: '#00B8D9' },
        { label: "Guardian", value: student.guardian, color: '#FF6F61' },
      ].map(({ label, value, color }, idx) => (
        <TableRow
          key={label}
          sx={{
            backgroundColor: idx % 2 === 0 ? '#f5f8ff' : '#ffffff',
            borderRadius: '12px',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: 'none',
            cursor: 'default',
            '&:hover': {
              backgroundColor: '#dbe7ff',
              boxShadow: `0 6px 20px rgba(0, 0, 0, 0.12)`,
            }
          }}
        >
          {/* Label Cell */}
          <TableCell
            align="left"
            sx={{
              fontWeight: 700,
              color: color,
              fontSize: '1.1rem',
              borderBottom: 'none',
              width: '35%',
              userSelect: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              background: `linear-gradient(90deg, ${color}33 0%, ${color}1A 100%)`,
              borderRadius: '12px 0 0 12px',
              boxShadow: `inset 3px 0 8px ${color}55`,
              paddingY: 1.5,
              paddingX: 3,
              textShadow: `0 1px 2px ${color}88`,
            }}
          >
            {label}
          </TableCell>

          {/* Value Cell */}
          <TableCell
            align="left"
            sx={{
              color: color,
              fontSize: '1.05rem',
              borderBottom: 'none',
              fontWeight: 600,
              textTransform: label === "Email" ? 'lowercase' : 'none',
              background: `linear-gradient(90deg, ${color}1A 0%, ${color}0A 100%)`, // lighter gradient
              borderRadius: '0 12px 12px 0',
              paddingY: 1.5,
              paddingX: 3,
              letterSpacing: '0.02em',
              userSelect: 'text',
              boxShadow: `inset -3px 0 8px ${color}33`,
            }}
          >
            {value || '-'}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


            {/* Right: Fee Dues Section */}
            <Box
            sx={{
              marginTop: "20px",
              marginX: "50px",
              width: "25%",
              backgroundColor: "#FFF9C4",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: "15px",
              }}
            >
              Fee Details
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#444" }}>
              {/* Replace these dummy values with real ones if available */}
              <strong>Total Fee:</strong> ₹45,000<br />
              <strong>Paid:</strong> ₹30,000<br />
              <strong>Due:</strong> ₹15,000<br />
              <strong>Last Payment Date:</strong> 5th May 2025
            </Typography>
          </Box>
          </Box>
        </>
      )}

      {/* Notice Board */}
      <Box
        sx={{
          maxWidth: 1200,
          margin: '0 auto 40px',
          backgroundColor: '#ffffff',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(41, 128, 185, 0.15)',
          p: 4,
          px: { xs: 3, sm: 6 },
          width: '95%',
          userSelect: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AnnouncementIcon sx={{ color: '#2575fc', mr: 1.5, fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
            Notice Board
          </Typography>
        </Box>
        <Box
          sx={{
            maxHeight: 250,
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2575fc',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f4ff',
              borderRadius: '4px',
            },
          }}
        >
          {notices.length > 0 ? (
            notices.map((notice, idx) => (
              <Box
                key={notice._id || idx}
                sx={{
                  mb: 2,
                  p: 2,
                  borderLeft: '6px solid #6a11cb',
                  backgroundColor: '#f9faff',
                  borderRadius: 2,
                  boxShadow: '0 2px 6px rgba(106, 17, 203, 0.1)',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e6eaff',
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {notice.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
                  {notice.message}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                  {new Date(notice.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
              No notices available.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
