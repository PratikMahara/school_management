import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const AttendanceStudent = () => {
  Chart.register(ArcElement);

  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [classDetails, setClassDetails] = useState(null);

  const dateConvert = (date) => {
    const dateData = new Date(date);
    return (
      dateData.getDate() +
      '-' +
      (dateData.getMonth() + 1) +
      '-' +
      dateData.getFullYear()
    );
  };

  const chartDataFunc = (data) => {
    let presentCount = 0;
    let absentCount = 0;
    data.forEach((record) => {
      if (record.status === 'Present') presentCount++;
      else if (record.status === 'Absent') absentCount++;
    });
    setChartData([presentCount, absentCount]);
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/attendance/${studentId}`);
        setAttendanceData(response.data);
        chartDataFunc(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAttendanceData();
    }
  }, [studentId]);

  const data = {
    datasets: [
      {
        data: chartData,
        backgroundColor: ['#36a2eb', '#ffcd56'],
        hoverOffset: 30,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
    labels: ['Present', 'Absent'],
  };

  const getStudentDetails = () => {
    axios
      .get(`${baseUrl}/student/fetch-own`)
      .then((resp) => {
        setStudentId(resp.data.data._id);
        setClassDetails({
          id: resp.data.data.student_class._id,
          class: resp.data.data.student_class.class_section,
        });
      })
      .catch((e) => {
        console.log('Error in student', e);
      });
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: '#1e3a8a',
          letterSpacing: '0.1em',
          textAlign: 'center',
          mb: 6,
          textTransform: 'uppercase',
          textShadow: '2px 2px 8px rgba(30, 58, 138, 0.3)',
        }}
      >
        Your Attendance
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={6}
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* Attendance Chart */}
        <Paper
          elevation={8}
          sx={{
            flexBasis: { xs: '100%', md: '40%' },
            p: 4,
            borderRadius: 4,
            boxShadow: '0 12px 40px rgba(30, 58, 138, 0.25)',
            background:
              'linear-gradient(135deg, #f0f4ff 0%, #dbe7ff 100%)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1e3a8a',
              mb: 3,
              letterSpacing: '0.05em',
            }}
          >
            Attendance Summary
          </Typography>
          <Pie
            data={data}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: '#1e3a8a',
                    font: { weight: 'bold', size: 14 },
                  },
                },
              },
            }}
            style={{ maxWidth: '100%', margin: '0 auto' }}
          />
        </Paper>

        {/* Attendance List */}
        <Paper
          elevation={8}
          sx={{
            flexBasis: { xs: '100%', md: '55%' },
            p: 4,
            borderRadius: 4,
            boxShadow: '0 12px 40px rgba(30, 58, 138, 0.25)',
            background:
              'linear-gradient(135deg, #f0f4ff 0%, #dbe7ff 100%)',
            maxHeight: { xs: 'auto', md: 480 },
            overflowY: 'auto',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1e3a8a',
              mb: 3,
              letterSpacing: '0.05em',
            }}
          >
            Attendance Records
          </Typography>
          <Table
            sx={{
              minWidth: 320,
              '& .MuiTableCell-root': {
                borderBottom: 'none',
                fontWeight: 600,
                color: '#1e3a8a',
              },
              '& .MuiTableRow-root:nth-of-type(even)': {
                backgroundColor: 'rgba(30, 58, 138, 0.05)',
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.15)',
                transition: 'background-color 0.3s ease',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{dateConvert(record.date)}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default AttendanceStudent;
