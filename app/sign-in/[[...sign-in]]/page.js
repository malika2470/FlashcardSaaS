'use client';
import { AppBar, Typography, Container, Button, Toolbar, Box, CssBaseline } from '@mui/material';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';


export default function SignInPage() {
    return (
        <Container 
            maxWidth={false} 
            disableGutters 
            sx={{ 
                minHeight: '100vh', 
                backgroundColor: '#E3F2FD', 
                padding: 0, 
                margin: 0, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',  // Center content vertically
                alignItems: 'center',  // Center content horizontally
            }}
        >
            <CssBaseline />

            <AppBar position="static" sx={{ backgroundColor: '#3F51B5', boxShadow: 'none', width: '100%' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Roboto, sans-serif' }}>
                        FlipSmart
                    </Typography>
                    <Link href="/plan_selection" passHref>
                        <Button 
                            color="inherit"
                            sx={{ 
                                mx: 1, 
                                backgroundColor: '#42A5F5',  // Secondary Color
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
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8, flexGrow: 1, width: '100%' }}
            >
                <Typography variant="h4" sx={{ color: '#3F51B5', mb: 4, fontFamily: "'Lato', sans-serif" }}>
                    Sign In
                </Typography>
                <Box 
                    sx={{ 
                        backgroundColor: '#D1C4E9',  // A light purple background for the form container
                        padding: '20px', 
                        borderRadius: '10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        maxWidth: '400px',
                        display: 'flex',
                        justifyContent: 'center',  // Center the SignIn component horizontally
                    }}
                >
                    <SignIn afterSignInUrl="/free-dashboard" /> {/* Ensure this redirects to the correct page */}
                </Box>
            </Box>
        </Container>
    );
}
