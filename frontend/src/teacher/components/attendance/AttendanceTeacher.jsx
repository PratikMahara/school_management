import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { baseUrl } from '../../../environment';

const AttendanceTeacher = () => {
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceTaken, setAttendanceTaken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendeeClass, setAttendeeClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [mode, setMode] = useState('mark'); // 'mark' or 'edit'

  // Fetch classes teacher is attendee of
  useEffect(() => {
    axios.get(`${baseUrl}/class/attendee`)
      .then((res) => {
        setAttendeeClass(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch attendance or students when class, date, or mode changes
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      setAttendanceStatus({});
      setAttendanceTaken(false);
      setAttendanceRecords({});
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (mode === 'edit') {
          // Check if attendance exists for selected date and class
          const attendanceRes = await axios.get(`${baseUrl}/attendance/check/${selectedClass.id}`, {
            params: { date: selectedDate }
          });

          if (attendanceRes.data.attendanceTaken) {
            setAttendanceTaken(true);
            // Fetch attendance records for date and class
            const recordsRes = await axios.get(`${baseUrl}/attendance/fetch`, {
              params: { classId: selectedClass.id, date: selectedDate }
            });
            const records = recordsRes.data;

            const statusMap = {};
            records.forEach(r => {
              statusMap[r.student._id] = r.status;
            });
            setAttendanceStatus(statusMap);
            setAttendanceRecords(records.reduce((acc, r) => ({ ...acc, [r.student._id]: r }), {}));

            // Fetch students for class
            const studentsRes = await axios.get(`${baseUrl}/student/fetch-with-query`, {
              params: { student_class: selectedClass.id }
            });
            setStudents(studentsRes.data.data);
          } else {
            // No attendance to edit
            setAttendanceTaken(false);
            setStudents([]);
            setAttendanceStatus({});
            setAttendanceRecords({});
          }
        } else {
          // Mark mode: fetch students and mark all present by default
          const studentsRes = await axios.get(`${baseUrl}/student/fetch-with-query`, {
            params: { student_class: selectedClass.id }
          });
          setStudents(studentsRes.data.data);

          const initialStatus = {};
          studentsRes.data.data.forEach(s => {
            initialStatus[s._id] = 'Present';
          });
          setAttendanceStatus(initialStatus);
          setAttendanceTaken(false);
          setAttendanceRecords({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setStudents([]);
        setAttendanceStatus({});
        setAttendanceRecords({});
        setAttendanceTaken(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClass, selectedDate, mode]);

  // Toggle attendance status for a student
  const handleStatusToggle = (studentId) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  // Handle class selection
  const handleClassChange = (event) => {
    const input = event.target.value;
    if (input) {
      const [id, class_section] = input.split(',');
      setSelectedClass({ id, class_section });
    } else {
      setSelectedClass('');
    }
  };

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Handle mode toggle
  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      // Reset data when mode changes
      setStudents([]);
      setAttendanceStatus({});
      setAttendanceTaken(false);
      setAttendanceRecords({});
    }
  };

  // Submit attendance - update existing or create new
  const submitAttendance = async () => {
    try {
      const attendanceRecordsToSubmit = students.map((student) => {
        const existingRecord = attendanceRecords[student._id];
        return {
          id: existingRecord ? existingRecord._id : undefined,
          studentId: student._id,
          date: selectedDate,
          status: attendanceStatus[student._id],
          classId: selectedClass.id,
        };
      });

      await Promise.all(
        attendanceRecordsToSubmit.map((record) => {
          if (record.id) {
            return axios.put(`${baseUrl}/attendance/update/${record.id}`, { status: record.status });
          } else {
            return axios.post(`${baseUrl}/attendance/mark`, record);
          }
        })
      );

      alert('Attendance saved successfully');
      setAttendanceTaken(true);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6 }}>
        Loading...
      </Typography>
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
          mb: 4,
          textTransform: 'uppercase',
          textShadow: '2px 2px 8px rgba(30, 58, 138, 0.3)',
        }}
      >
        {mode === 'mark' ? 'Mark Attendance' : 'Edit Attendance'}
      </Typography>

      {attendeeClass.length > 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are an attendee of {attendeeClass.length} class
          {attendeeClass.length > 1 && 'es'}. Select the class and date to {mode} attendance.
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are not an attendee of any class.
        </Alert>
      )}

      {/* Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 2 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="attendance mode"
        >
          <ToggleButton value="mark" aria-label="mark attendance">
            Mark Attendance
          </ToggleButton>
          <ToggleButton value="edit" aria-label="edit attendance">
            Edit Attendance
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {attendeeClass.length > 0 && (
        <>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={
                selectedClass
                  ? `${selectedClass.id},${selectedClass.class_section}`
                  : ''
              }
              onChange={handleClassChange}
              label="Select Class"
            >
              <MenuItem value="">Select Class</MenuItem>
              {attendeeClass.map((student_class, i) => (
                <MenuItem
                  key={i}
                  value={`${student_class.classId},${student_class.class_section}`}
                >
                  {student_class.class_section}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Select Date"
            type="date"
            fullWidth
            value={selectedDate}
            onChange={handleDateChange}
            sx={{ mb: 4 }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: moment().format('YYYY-MM-DD'),
            }}
          />
        </>
      )}

      {mode === 'edit' && selectedClass && !attendanceTaken && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No attendance found for {selectedClass.class_section} on {moment(selectedDate).format('DD-MM-YYYY')}. You can switch to "Mark Attendance" mode to create attendance.
        </Alert>
      )}

      {students.length === 0 && selectedClass && !loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No students found for {selectedClass.class_section}.
        </Alert>
      )}

      {students.length > 0 && (
        <>
          <Table
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(30, 58, 138, 0.1)',
              overflow: 'hidden',
              mb: 4,
              '& .MuiTableCell-root': {
                fontWeight: 600,
                color: '#1e3a8a',
                borderBottom: 'none',
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
            <TableHead
              sx={{
                backgroundColor: '#1e3a8a',
                '& .MuiTableCell-root': {
                  color: '#fff',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                },
              }}
            >
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Attendance Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={
                          attendanceStatus[student._id] === 'Present'
                            ? 'contained'
                            : 'outlined'
                        }
                        color="success"
                        onClick={() => handleStatusToggle(student._id)}
                        sx={{
                          textTransform: 'none',
                          minWidth: 90,
                          fontWeight: 600,
                          boxShadow:
                            attendanceStatus[student._id] === 'Present'
                              ? '0 4px 12px rgba(76, 175, 80, 0.4)'
                              : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)',
                          },
                        }}
                      >
                        Present
                      </Button>
                      <Button
                        variant={
                          attendanceStatus[student._id] === 'Absent'
                            ? 'contained'
                            : 'outlined'
                        }
                        color="error"
                        onClick={() => handleStatusToggle(student._id)}
                        sx={{
                          textTransform: 'none',
                          minWidth: 90,
                          fontWeight: 600,
                          boxShadow:
                            attendanceStatus[student._id] === 'Absent'
                              ? '0 4px 12px rgba(244, 67, 54, 0.4)'
                              : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(244, 67, 54, 0.6)',
                          },
                        }}
                      >
                        Absent
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            variant="contained"
            color="primary"
            onClick={submitAttendance}
            sx={{
              display: 'block',
              mx: 'auto',
              px: 6,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(25, 118, 210, 0.6)',
              },
            }}
          >
            Save Attendance
          </Button>
        </>
      )}
    </Container>
  );
};

export default AttendanceTeacher;
