import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { baseUrl } from '../../../environment';
import axios from 'axios';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudents] = useState("");

  const fetchowndetail = async () => {

    axios.get(`${baseUrl}/student/fetch-own`).then((resp) => {
      if (resp.data.success) {
        setStudents(resp.data.data._id)
        console.log(resp.data.data._id);

      }

    }).catch((e) => {
      console.error("Error fetching own error: ", e);
    })
  }

  useEffect(() => {
    fetchStudentResults();
    fetchowndetail()
  }, []);

  const fetchStudentResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const studentId = student; // Assuming you store the student's ID
      console.log(studentId);
      
      const response = await axios.get(`${baseUrl}/student/results/${studentId}`, {
        headers: {
          Authorization: token
        }
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError('Failed to fetch results');
      }
    } catch (err) {
      // setError(err.response?.data?.message || 'Error fetching results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };



  const handleDownload = async (resultId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/student/download-result/${resultId}`, {
        headers: {
          Authorization: token
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `result-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading result:', err);
      alert('Failed to download result');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          My Results
        </Typography>

        {results.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No results available
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Exam Type</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result._id}>
                    <TableCell>{result.examtype.examType}</TableCell>
                    <TableCell>
                      {result.result_class.class_name || result.result_class.class_num}
                    </TableCell>
                    <TableCell>
                      {new Date(result.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{result.uploaded_teacher.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(result._id)}
                      >
                        <Download />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default StudentResults;