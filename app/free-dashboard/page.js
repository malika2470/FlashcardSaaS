'use client';

import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { UserButton } from '@clerk/nextjs'; // Assuming Clerk is used for user management

export default function FreeDashboard() {
    return (
        <Container maxWidth={false} sx={{ minHeight: '100vh', backgroundColor: '#E3F2FD', padding: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: '#5C6BC0', boxShadow: 'none' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Project Name on the Top Left */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "'Lato', sans-serif" }}>
                        FlipSmart
                    </Typography>

                    {/* User Account on the Top Right */}
                    <UserButton />
                </Toolbar>
            </AppBar>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8 }}
            >
                <Typography variant="h4" sx={{ mb: 4, fontFamily: "'Lato', sans-serif", color: '#5C6BC0' }}>
                    Welcome to Your Free Dashboard
                </Typography>

                {/* Buttons for Flashcard Actions */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '300px' }}>
                    <Button 
                        variant="contained" 
                        sx={{ 
                            backgroundColor: '#42A5F5',  // Secondary Color
                            '&:hover': { backgroundColor: '#1E88E5' }, 
                            fontFamily: "'Lato', sans-serif",
                        }}
                        onClick={() => alert('Create new flashcards clicked')} // Replace with actual navigation or action
                    >
                        Create New Flashcards
                    </Button>

                    <Button 
                        variant="contained" 
                        sx={{ 
                            backgroundColor: '#42A5F5',  // Secondary Color
                            '&:hover': { backgroundColor: '#1E88E5' }, 
                            fontFamily: "'Lato', sans-serif",
                        }}
                        onClick={() => alert('View saved flashcards clicked')} // Replace with actual navigation or action
                    >
                        View Saved Flashcards
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
