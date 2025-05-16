import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Paper,
  Button,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import Carousel from './carousel/Carousel';
import Gallery from './gallery/Gallery';
import {
  School as SchoolIcon,
  Groups as GroupsIcon,
  Event as EventIcon,
  EmojiEvents as AchievementIcon,
  LibraryBooks as CurriculumIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Home = () => {
  const programs = [
    {
      title: 'Elementary School',
      description: 'Foundational learning for grades 1-5 with focus on core subjects and creativity',
      icon: <SchoolIcon color="primary" sx={{ fontSize: 50 }} />
    },
    {
      title: 'Middle School',
      description: 'Transitional program for grades 6-8 with exploratory learning paths',
      icon: <GroupsIcon color="primary" sx={{ fontSize: 50 }} />
    },
    {
      title: 'High School',
      description: 'College preparatory curriculum with advanced placement options',
      icon: <AchievementIcon color="primary" sx={{ fontSize: 50 }} />
    }
  ];

  const upcomingEvents = [
    { date: '15 Oct', title: 'Parent-Teacher Conference', time: '3:00 PM' },
    { date: '22 Oct', title: 'Science Fair', time: '9:00 AM' },
    { date: '5 Nov', title: 'Sports Day', time: '8:00 AM' }
  ];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Carousel Section */}
      <Box sx={{ mb: 6 }}>
        <Carousel />
      </Box>

      {/* Welcome Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper elevation={0} sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(to right, #f5f9ff, #ffffff)'
        }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            mb: 3
          }}>
            Welcome to Our Learning Community
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" sx={{ mb: 3 }}>
            Where excellence in education meets a nurturing environment to help every student reach their full potential.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" size="large" color="primary">
              Learn More
            </Button>
            <Button variant="outlined" size="large" color="primary">
              Contact Us
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Programs Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ 
          textAlign: 'center',
          fontWeight: 600,
          mb: 6,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 4,
            backgroundColor: 'primary.main',
            borderRadius: 2
          }
        }}>
          Our Academic Programs
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          {programs.map((program, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
                }
              }}>
                <Box sx={{ 
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}>
                  {program.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {program.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {program.description}
                  </Typography>
                </CardContent>
                <Button 
                  variant="text" 
                  color="primary" 
                  sx={{ mt: 'auto' }}
                >
                  Explore Program
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Quick Info Section */}
      <Box sx={{ 
        py: 6,
        backgroundColor: 'primary.light',
        mb: 8
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3
              }}>
                <PhoneIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Us
                </Typography>
                <Typography variant="body1">
                  (123) 456-7890
                </Typography>
                <Typography variant="body1">
                  info@school.edu
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3
              }}>
                <LocationIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Visit Us
                </Typography>
                <Typography variant="body1">
                  123 Education Lane
                </Typography>
                <Typography variant="body1">
                  Learning City, LC 12345
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3
              }}>
                <EventIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  School Hours
                </Typography>
                <Typography variant="body1">
                  Mon-Fri: 8:00 AM - 3:30 PM
                </Typography>
                <Typography variant="body1">
                  Office: 7:30 AM - 4:30 PM
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Upcoming Events Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ 
          textAlign: 'center',
          fontWeight: 600,
          mb: 6
        }}>
          Upcoming Events
        </Typography>
        
        <Grid container spacing={3}>
          {upcomingEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ 
                p: 3,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                }
              }}>
                <Box sx={{ 
                  minWidth: 70,
                  textAlign: 'center',
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'white'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {event.date.split(' ')[0]}
                  </Typography>
                  <Typography variant="subtitle2">
                    {event.date.split(' ')[1]}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.time}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" color="primary" size="large">
            View All Events
          </Button>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ 
        py: 8,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom sx={{ 
            textAlign: 'center',
            fontWeight: 600,
            mb: 6
          }}>
            What Our Community Says
          </Typography>
          
          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Paper sx={{ 
                  p: 3,
                  height: '100%',
                  borderRadius: 3,
                  position: 'relative',
                  '&:before': {
                    content: '"“"',
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    fontSize: 60,
                    color: 'primary.light',
                    lineHeight: 1,
                    fontFamily: 'serif'
                  }
                }}>
                  <Typography variant="body1" sx={{ 
                    fontStyle: 'italic',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1,
                    pl: 4
                  }}>
                    "This school has provided an exceptional learning environment for my child. The teachers are dedicated and the curriculum is challenging yet engaging."
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src="" alt="Parent" />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Parent of Grade {item + 2} Student
                      </Typography>
                      <Chip 
                        label="Elementary School" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ 
          fontWeight: 700,
          mb: 3
        }}>
          Ready to Join Our Community?
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" sx={{ 
          maxWidth: 700,
          mx: 'auto',
          mb: 4
        }}>
          Discover how our school can help your child achieve academic excellence and personal growth.
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ 
          px: 6,
          py: 1.5,
          fontSize: '1.1rem',
          borderRadius: 2
        }}>
          Schedule a Tour
        </Button>
      </Container>
    </Box>
  );
};

export default Home;