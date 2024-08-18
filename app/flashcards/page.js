'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Container, Grid, Typography, Box, CircularProgress, Card, CardActionArea, CardContent } from '@mui/material';

// FlashcardItem Component
function FlashcardItem({ flashcard, flipped, handleCardClick }) {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: '150px' }}>
                <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                        <Box sx={{
                            perspective: '1000px',
                            position: 'relative',
                            width: '100%',
                            minHeight: '150px',
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                width: '100%',
                                minHeight: '150px',
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.6s ease-in-out',
                                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    minHeight: '150px',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 2,
                                    boxSizing: 'border-box',
                                }}>
                                    <Typography variant="body1" component="div" align="center">
                                        {flashcard.front}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    minHeight: '150px',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 2,
                                    boxSizing: 'border-box',
                                    transform: 'rotateY(180deg)',
                                }}>
                                    <Typography variant="body1" component="div" align="center">
                                        {flashcard.back}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

// FlashcardsPage Component
export default function FlashcardsPage() {
    const { isLoaded, isSignedIn } = useUser();
    const [flashcardSets, setFlashcardSets] = useState({});
    const [flipped, setFlipped] = useState(null); // Store the ID of the flipped card
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getFlashcards() {
            try {
                const setsCollection = collection(db, 'flashcard_sets');
                const setsSnapshot = await getDocs(setsCollection);
                const setsData = {};

                setsSnapshot.forEach((doc) => {
                    const data = doc.data();
                    setsData[doc.id] = data;
                });

                setFlashcardSets(setsData);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
                setError('Failed to load flashcards. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded && isSignedIn) {
            getFlashcards();
        } else {
            setLoading(false);
            setError('You must be signed in to view flashcards.');
        }
    }, [isLoaded, isSignedIn]);

    const handleCardClick = useCallback((id) => {
        setFlipped(prev => (prev === id ? null : id)); // Flip the card if it's not already flipped, otherwise unflip it
    }, []);

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
        <Container maxWidth="100vw">
            <Typography variant="h4" gutterBottom>Flashcard Sets</Typography>
            {Object.keys(flashcardSets).length > 0 ? (
                Object.keys(flashcardSets).map((setId) => {
                    const { name, flashcards } = flashcardSets[setId];
                    return (
                        <Box key={setId} sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom>{name}</Typography>
                            <Grid container spacing={3}>
                                {flashcards.map((flashcard) => (
                                    <FlashcardItem
                                        key={flashcard.id}
                                        flashcard={flashcard}
                                        flipped={flipped === flashcard.id} // Pass the flipped state
                                        handleCardClick={handleCardClick}
                                    />
                                ))}
                            </Grid>
                        </Box>
                    );
                })
            ) : (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No flashcards available.
                </Typography>
            )}
        </Container>
    );
}