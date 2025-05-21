import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { Download, Description } from '@mui/icons-material';

const Tensets = () => {
  const [selectedClass, setSelectedClass] = useState('class-10');

  const classes = [
    { id: 'class-9', name: 'Class 9', driveLink: 'https://drive.google.com/drive/folders/your-class-9-folder-id' },
    { id: 'class-10', name: 'Class 10', driveLink: 'https://drive.google.com/drive/folders/your-class-10-folder-id' },
    { id: 'class-11', name: 'Class 11', driveLink: 'https://drive.google.com/drive/folders/your-class-11-folder-id' },
    { id: 'class-12', name: 'Class 12', driveLink: 'https://drive.google.com/drive/folders/your-class-12-folder-id' },
  ];

  const handleViewQuestions = () => {
    const selectedClassData = classes.find(cls => cls.id === selectedClass);
    window.open(selectedClassData.driveLink, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
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

      <Card 
        elevation={3}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Description color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" color="primary">
              Question Sets
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Access 10 comprehensive question sets including:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
            <li>Previous year papers</li>
            <li>Practice sets with solutions</li>
            <li>Subject-wise questions</li>
            <li>Important topics covered</li>
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            startIcon={<Download />}
            onClick={handleViewQuestions}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            View Question Sets
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default Tensets;