'use client'
import { AppBar, Container, Toolbar, Typography, Button, Box, CssBaseline } from "@mui/material";
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';


export default function Home() {

  const [isFlipped, setIsFlipped] = useState(false);

  // Automatically flip the card once when the page loads after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#E3F2FD',
        padding: 0,
        margin: 0,
        overflowX: 'hidden',
      }}
    >
      <Head>
        <title>FlipSmart</title>
        <meta name="description" content="Create flashcards from text" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>

      <CssBaseline />

      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#5C6BC0',
          boxShadow: 'none',
          width: '100%',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: "'Lato', sans-serif" }}>
            FlipSmart
          </Typography>
          <Link href="/sign-in" passHref>
            <Button color="inherit" sx={{ mx: 1 }}>Login</Button>
          </Link>
          <Link href="/plan_selection" passHref>
            <Button 
              color="inherit" 
              sx={{ 
                mx: 1, 
                backgroundColor: '#42A5F5',
                '&:hover': { backgroundColor: '#1E88E5' }, 
                transition: 'background-color 0.3s ease',
                borderRadius: '20px',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          textAlign: 'left', 
          py: 8,
          px: 4,
          overflowX: 'hidden',
          width: '100%',
        }}
      >
        {/* Title Section */}
        <Box sx={{ flexBasis: '50%' }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: '#5C6BC0',
              animation: `fadeIn 2s ease`,
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Welcome to FlipSmart
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#9575CD',
              mb: 4, 
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Work Smarter Not Harder
          </Typography>
          <Link href="/plan_selection" passHref>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#9575CD',
                '&:hover': { backgroundColor: '#7E57C2' }, 
                fontSize: '1.2rem', 
                px: 4, 
                py: 1,
                borderRadius: '20px',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Get Started
            </Button>
          </Link>
        </Box>

        {/* Card Flip Section */}
        <Box 
          onMouseEnter={handleCardFlip}  // Flip on hover
          onClick={handleCardFlip}  // Flip on click
          sx={{ 
            perspective: 1000,
            flexBasis: '40%',
            mx: 'auto',
          }}
        >
          <Box 
            sx={{
              width: '100%',
              height: '200px',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <Box 
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backfaceVisibility: 'hidden',
                backgroundColor: '#5C6BC0',
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              <Typography variant="h5">What is FlipSmart?</Typography>
            </Box>
            <Box 
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backfaceVisibility: 'hidden',
                backgroundColor: '#9575CD',
                color: '#fff',
                transform: 'rotateY(180deg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Lato', sans-serif",
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontSize: '1rem' }}>FlipSmart helps you create and study flashcards easily.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box 
        sx={{ 
          backgroundColor: '#5C6BC0',
          color: '#fff', 
          py: 2, 
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          Â© 2024 FlipSmart. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}