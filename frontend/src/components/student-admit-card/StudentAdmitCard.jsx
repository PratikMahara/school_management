// import { Button, Card, CardContent, Typography, Box } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';
// import admitCardImage from '/images/uploaded/complaints/1749284265427-699445249-Screenshot_2025-05-27_234210.png';
// import { useEffect } from 'react';

// // useEffect(()=>{
// // create a pdf and let user download it
// // })

// const AdmitCard = () => {

//   const handleDownload = () => {
//     const link = document.createElement('a');
//     link.href = admitCardImage;
//     link.download = 'admit_card.png';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <Card
//       elevation={3}
//       sx={{
//         maxWidth: 400,
//         mx: 'auto',
//         mt: 4,
//         borderRadius: 2,
//         textAlign: 'center',
//         p: 2,
//       }}
//     >
//       <CardContent>

//         <Typography
//           variant="body1"
//           color="text.secondary"
//           sx={{ mb: 3 }}
//         >
//           Here is your admit card. Click the button below to download it.
//         </Typography>

//         {admitCardImage && (
//           <Box
//             sx={{
//               mb: 3,
//               display: 'flex',
//               justifyContent: 'center',
//               '& img': {
//                 maxWidth: '100%',
//                 height: 'auto',
//                 borderRadius: 1,
//                 boxShadow: 1,
//               },
//             }}
//           >
//             <img src={admitCardImage} alt="Admit Card Preview" />
//           </Box>
//         )}

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleDownload}
//           startIcon={<DownloadIcon />}
//           sx={{
//             mt: 2,
//             py: 1.2,
//             px: 3,
//             fontSize: '1rem',
//             textTransform: 'none',
//           }}
//         >
//           Download Admit Card
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdmitCard;







import { useState, useEffect } from "react"
import { Card, CardContent, Typography, Button, Box, CircularProgress, Alert, Container } from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import axios from "axios"
import { baseUrl } from "@/environment"

const StudentAdmitCard = () => {
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchStudentDetails()
  }, [])

  const fetchStudentDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(`${baseUrl}/student/fetch-own`)
      console.log("Student data fetched:", response.data.data)
      setStudentData(response.data.data)
    } catch (err) {
      console.error("Error fetching student details:", err)
      setError(
        err.response?.status === 404 ? "Student not found" : "Failed to fetch student details. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAdmitCard = async () => {
    try {
      setDownloading(true)
      const response = await axios.get(`${baseUrl}/student/admit-card/download`, {
        responseType: 'blob',
      });
      console.log("Admit card download response:", response)
      // console.log("response status", response.status)

      const blob = await response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `admit_card_${studentData.name}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading admit card:", err)
      setError("Failed to download admit card. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" py={4}>
        <Card
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 3,
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "black",
                mb: 3,
              }}
            >
              Student Admit Card
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                action={
                  <Button color="inherit" size="small" onClick={fetchStudentDetails}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {studentData.admitCard.roll ? (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                    Student Name
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    {studentData.name}
                  </Typography>
                </Box>

                {/* <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                    Class
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    {studentData.className}
                  </Typography>
                </Box> */}

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                    Roll Number
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    {studentData.roll}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                  onClick={handleDownloadAdmitCard}
                  disabled={downloading}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  {downloading ? "Generating PDF..." : "Download Admit Card (PDF)"}
                </Button>
              </Box>
            ): (
              <p>No admit card</p>
            )}

            {/* {studentData?.admitCard && (
              <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Additional Information
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Exam Date: {studentData.admitCard.examDate || "TBA"}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Exam Center: {studentData.admitCard.examCenter || "TBA"}
                </Typography>
              </Box>
            )} */}
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default StudentAdmitCard
