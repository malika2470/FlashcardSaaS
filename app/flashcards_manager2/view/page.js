'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';  
import { Container, Grid, Typography, Box, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DisplayFlashcardSets() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardSets, setFlashcardSets] = useState([]);
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
        <Container 
            maxWidth="false" 
            disableGutters
            sx={{ 
                minHeight: '100vh', 
                backgroundColor: '#E3F2FD', 
                padding: '20px' 
            }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    color: '#3F51B5' 
                }}>
                Flashcard Sets
            </Typography>
            <Grid container spacing={4}>
                {flashcardSets.length > 0 ? (
                    flashcardSets.map((set) => (
                        <Grid item xs={12} sm={6} md={4} key={set.id}>
                            <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                                <CardContent>
                                    <Typography variant="h6" align="center" sx={{ fontFamily: 'Roboto, sans-serif', color: '#3F51B5' }}>
                                        {set.name || 'Unnamed Set'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#9575CD' }}
                                            onClick={() => router.push(`/flashcards_manager2/study/${set.id}`)}
                                        >
                                            Study Set
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 4, fontFamily: 'Roboto, sans-serif', color: '#3F51B5' }}>
                        No flashcard sets available.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}