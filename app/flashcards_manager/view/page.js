'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';  
import { Container, Grid, Typography, Box, CircularProgress, Card, CardActionArea, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DisplayFlashcardSets() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Fetch existing flashcard sets
    useEffect(() => {
        async function fetchFlashcardSets() {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                const colRef = collection(db, 'flashcard_sets');
                const docsSnapshot = await getDocs(colRef);
                const flashcardSetsData = [];

                docsSnapshot.forEach((doc) => {
                    flashcardSetsData.push({ id: doc.id, ...doc.data() });
                });

                setFlashcardSets(flashcardSetsData);
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
        <Container maxWidth="lg" sx={{ paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#FFFFFF' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5', fontWeight: 'bold' }}>
                Flashcard Sets
            </Typography>
            <Grid container spacing={4}>
                {flashcardSets.length > 0 ? (
                    flashcardSets.map((set) => (
                        <Grid item xs={12} sm={6} md={4} key={set.id}>
                            <Card sx={{ minHeight: '150px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                <CardContent>
                                    <Typography variant="h6" align="center" sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5' }}>
                                        {set.name || 'Unnamed Set'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ fontFamily: "'Lato', sans-serif", backgroundColor: '#42A5F5', '&:hover': { backgroundColor: '#1E88E5' }}}
                                            onClick={() => router.push(`/flashcards_manager/study/${set.id}`)}
                                        >
                                            Study Set
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 4, fontFamily: 'Lato, sans-serif', color: '#3F51B5' }}>
                        No flashcard sets available.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}

