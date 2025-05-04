import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import { CalendarToday, Event } from '@mui/icons-material';

const events = [
  {
    id: 1,
    title: 'Parent-Teacher Meeting',
    type: 'meeting',
    date: 'Today',
    time: '3:00 PM - 5:00 PM',
    location: 'Conference Hall',
  },
  {
    id: 2,
    title: 'Mathematics Mid-Term Exam',
    type: 'exam',
    date: 'Tomorrow',
    time: '10:00 AM - 11:30 AM',
    location: 'Main Hall',
  },
  {
    id: 3,
    title: 'Annual Sports Day',
    type: 'event',
    date: 'May 10, 2025',
    time: 'All Day',
    location: 'School Grounds',
  },
  {
    id: 4,
    title: 'Summer Break Begins',
    type: 'holiday',
    date: 'June 1, 2025',
  },
];

const getChipColor = (type) => {
  switch (type) {
    case 'meeting':
      return 'primary';
    case 'exam':
      return 'error';
    case 'event':
      return 'success';
    case 'holiday':
      return 'warning';
    default:
      return 'default';
  }
};

const UpcomingEvents = () => {
  return (
    <Card>
      <CardHeader
        avatar={<CalendarToday color="primary" />}
        title={<Typography variant="h6">Upcoming Events</Typography>}
        subheader="Schedule for the coming days"
      />
      <Divider />
      <CardContent>
        {events.map((event) => (
          <Box key={event.id} mb={3} display="flex" alignItems="flex-start" gap={2}>
            <Box mt={0.5}>
              <Event color="action" />
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {event.title}
                </Typography>
                <Chip
                  label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  size="small"
                  color={getChipColor(event.type)}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {event.date}
                {event.time ? ` • ${event.time}` : ''}
              </Typography>
              {event.location && (
                <Typography variant="body2" color="textSecondary">
                  {event.location}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </CardContent>
      <Box textAlign="center" pb={2}>
        <Button variant="outlined">View Full Calendar</Button>
      </Box>
    </Card>
  );
};

export default UpcomingEvents;
