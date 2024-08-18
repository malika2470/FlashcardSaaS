'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';  
import { Container, Grid, Typography, Box, CircularProgress, Card, CardContent, Button, TextField, AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default function DisplayFlashcardSets() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchFlashcardSets() {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                const userDocRef = doc(db, 'users', user.id); // Reference to the user's document
                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const flashcardsArray = data.flashcards || []; // Access the array of flashcards
                    setFlashcardSets(flashcardsArray);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching flashcard sets:', error);
                setError('Failed to load flashcard sets. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded && isSignedIn) {
            fetchFlashcardSets();
        } else {
            setLoading(false);
            setError('You must be signed in to view and manage flashcards.');
        }
    }, [user, isLoaded, isSignedIn]);

    const filteredFlashcardSets = flashcardSets.filter(set =>
        set.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isLoaded || !isSignedIn) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" align="center" sx={{ mt: 4, color: 'red' }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '2rem' }}>
            {/* Top App Bar */}
            <AppBar position="static" sx={{ backgroundColor: '#3f51b5', boxShadow: 'none', padding: '10px 0' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', fontFamily: "'Lato', sans-serif", cursor: 'pointer' }}
                        onClick={() => router.push('/flashcards_manager2/view')}
                    >
                        FlipSmart
                    </Typography>
                    <UserButton />
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px', marginTop: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            fontFamily: "'Lato', sans-serif",
                            backgroundColor: '#66BB6A',
                            '&:hover': { backgroundColor: '#43A047' },
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                            }
                        }}
                        onClick={() => router.push('/flashcards_manager2/create')}
                    >
                        Create New Flashcard Set
                    </Button>
                    <TextField
                        label="Search Flashcard Sets"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ ml: 4, backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                    />
                </Box>

                {/* Header for the table */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', backgroundColor: '#3f51b5', color: '#FFFFFF', borderRadius: '8px 8px 0 0' }}>
                    <Typography variant="h6" sx={{ flex: 1, textAlign: 'left', padding: '10px' }}>Name</Typography>
                    <Typography variant="h6" sx={{ flex: 1, textAlign: 'left', padding: '10px' }}>Date Created</Typography>
                    <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', padding: '10px' }}>Study</Typography>
                    <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', padding: '10px' }}>Quiz</Typography>
                    <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', padding: '10px' }}>Edit</Typography>
                </Box>

                {/* List of Flashcard Sets */}
                {filteredFlashcardSets.length > 0 ? (
                    filteredFlashcardSets.map((set) => (
                        <Card key={set.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', borderRadius: '0 0 8px 8px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            <Typography sx={{ flex: 1, textAlign: 'left', padding: '10px', fontFamily: 'Lato, sans-serif', color: '#3f51b5' }}>
                                {set.name || 'Unnamed Set'}
                            </Typography>
                            <Typography sx={{ flex: 1, textAlign: 'left', padding: '10px', fontFamily: 'Lato, sans-serif', color: '#757575' }}>
                                {new Date(set.creationDate).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ flex: 1, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        fontFamily: "'Lato', sans-serif",
                                        backgroundColor: '#42A5F5',
                                        '&:hover': { backgroundColor: '#1E88E5' },
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                        }
                                    }}
                                    onClick={() => router.push(`/flashcards_manager2/study/${set.id}`)}
                                >
                                    Study
                                </Button>
                            </Box>
                            <Box sx={{ flex: 1, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        fontFamily: "'Lato', sans-serif",
                                        backgroundColor: '#42A5F5',
                                        '&:hover': { backgroundColor: '#1E88E5' },
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                        }
                                    }}
                                    onClick={() => alert('Quiz Mode not implemented yet')}
                                >
                                    Quiz
                                </Button>
                            </Box>
                            <Box sx={{ flex: 1, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        fontFamily: "'Lato', sans-serif",
                                        backgroundColor: '#FF7043',
                                        '&:hover': { backgroundColor: '#F4511E' },
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                        }
                                    }}
                                    onClick={() => router.push(`/flashcards_manager2/edit/${set.id}`)}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </Card>
                    ))
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 4, fontFamily: 'Lato, sans-serif', color: '#3F51B5' }}>
                        No flashcard sets available.
                    </Typography>
                )}
            </Container>
        </Box>
    );
}
