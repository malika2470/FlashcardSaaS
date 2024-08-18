'use client';

import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function FreeDashboard() {
    const router = useRouter();

    return (
        <Container maxWidth={false} sx={{ minHeight: '100vh', backgroundColor: '#E3F2FD', padding: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: '#5C6BC0', boxShadow: 'none' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "'Lato', sans-serif" }}>
                        FlipSmart
                    </Typography>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '300px' }}>
                    <Button 
                        variant="contained" 
                        sx={{ 
                            backgroundColor: '#42A5F5',
                            '&:hover': { backgroundColor: '#1E88E5' }, 
                            fontFamily: "'Lato', sans-serif",
                        }}
                        onClick={() => router.push('/flashcards_manager/create')}
                    >
                        Create New Flashcards
                    </Button>

                    <Button 
                        variant="contained" 
                        sx={{ 
                            backgroundColor: '#42A5F5',
                            '&:hover': { backgroundColor: '#1E88E5' }, 
                            fontFamily: "'Lato', sans-serif",
                        }}
                        onClick={() => router.push('/flashcards_manager/view')}
                    >
                        View Saved Flashcards
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}