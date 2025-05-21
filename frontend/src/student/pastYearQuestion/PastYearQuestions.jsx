import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { Download, Description } from '@mui/icons-material';

const PastQuestions = () => {
  const [selectedClass, setSelectedClass] = useState('class-10');

  // Hardcoded class data
  const classes = [
    { id: 'class-9', name: 'Class 9' },
    { id: 'class-10', name: 'Class 10' },
    { id: 'class-11', name: 'Class 11' },
    { id: 'class-12', name: 'Class 12' },
  ];

  // Hardcoded questions data
  const questionsData = {
    'class-9': [
      {
        id: 1,
        subject: 'Mathematics',
        year: 2023,
        description: 'Final examination question paper with solutions',
        fileId: '1abc...', // Your Google Drive file ID
      },
      {
        id: 2,
        subject: 'Science',
        year: 2023,
        description: 'Complete question paper with practical questions',
        fileId: '2def...', // Your Google Drive file ID
      },
    ],
    'class-10': [
      {
        id: 3,
        subject: 'Mathematics',
        year: 2023,
        description: 'Board examination practice questions',
        fileId: '3ghi...', // Your Google Drive file ID
      },
      {
        id: 4,
        subject: 'Physics',
        year: 2023,
        description: 'Sample papers with marking scheme',
        fileId: '4jkl...', // Your Google Drive file ID
      },
    ],
    'class-11': [
      {
        id: 5,
        subject: 'Chemistry',
        year: 2023,
        description: 'Previous year solved papers',
        fileId: '5mno...', // Your Google Drive file ID
      },
      {
        id: 6,
        subject: 'Biology',
        year: 2023,
        description: 'Important questions and answers',
        fileId: '6pqr...', // Your Google Drive file ID
      },
    ],
    'class-12': [
      {
        id: 7,
        subject: 'Physics',
        year: 2023,
        description: 'Complete board exam preparation material',
        fileId: '7stu...', // Your Google Drive file ID
      },
      {
        id: 8,
        subject: 'Mathematics',
        year: 2023,
        description: 'Previous year questions with solutions',
        fileId: '8vwx...', // Your Google Drive file ID
      },
    ],
  };

  const handleDownload = (fileId) => {
    window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Past Year Questions
        </Typography>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Select Class</InputLabel>
          <Select
            value={selectedClass}
            label="Select Class"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {questionsData[selectedClass].map((question) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <Card 
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Description color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {question.subject}
                  </Typography>
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  Year: {question.year}
                </Typography>
                <Typography variant="body2">
                  {question.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<Download />}
                  onClick={() => handleDownload(question.fileId)}
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PastQuestions;