// Carousel.js
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules'; // Add Autoplay
import 'swiper/css';
import 'swiper/css/navigation';
import { Typography, Box, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const carouselItems = [
  {
    image: 'photo1.jpg',
    title: 'Explore Our Classrooms',
    description: 'Engaging and inspiring environments for every student.',
  },
  {
    image: 'photo2.jpg',
    title: 'Empowering Students',
    description: 'We believe in fostering the potential of each child.',
  },
  {
    image: 'photo3.jpg',
    title: 'Learning Tools',
    description: 'Providing the right tools for effective learning.',
  },
];

const Carousel = () => {
  const swiperRef = useRef(null);

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleBack = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Swiper
        modules={[Navigation, Autoplay]} // Add Autoplay module
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }} // Auto slide every 3.5s
      >
        {carouselItems.map((item, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: 'relative',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '70vh', minHeight: '400px', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  padding: '10px 20px',
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5">{item.title}</Typography>
                <Typography variant="body1">{item.description}</Typography>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <Box sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
        <Button variant="contained" onClick={handleBack}>
          <ArrowBackIosIcon />
        </Button>
      </Box>
      <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
        <Button variant="contained" onClick={handleNext}>
          <ArrowForwardIosIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Carousel;
