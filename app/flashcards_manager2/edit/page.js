'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditFlashcardSets() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setError('You must be signed in to edit flashcards.');
        }
    }, [user, isLoaded, isSignedIn]);

    const handleDeleteFlashcardSet = async (setId) => {
        try {
            const userDocRef = doc(db, 'users', user.id);
            const flashcardSetToDelete = flashcardSets.find(set => set.id === setId);

            await updateDoc(userDocRef, {
                flashcards: arrayRemove(flashcardSetToDelete)
            });

            setFlashcardSets(flashcardSets.filter(set => set.id !== setId));
            alert('Flashcard set deleted successfully!');
        } catch (error) {
            console.error('Error deleting flashcard set:', error);
            alert('Failed to delete flashcard set. Please try again later.');
        }
    };

    if (!isLoaded || !isSignedIn || loading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Typography>Loading...</Typography>
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

    if (flashcardSets.length === 0) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No flashcard sets available for editing.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ paddingTop: '2rem' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5', fontWeight: 'bold', textAlign: 'center' }}>
                Edit Flashcard Sets
            </Typography>
            <Grid container spacing={4}>
                {flashcardSets.map((set) => (
                    <Grid item xs={12} sm={6} md={4} key={set.id}>
                        <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" sx={{ fontFamily: 'Roboto, sans-serif', color: '#3F51B5' }}>
                                    {set.name || 'Unnamed Set'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    size="large" 
                                    variant="contained" 
                                    sx={{ backgroundColor: '#9575CD' }}
                                    onClick={() => handleDeleteFlashcardSet(set.id)}
                                >
                                    Delete Set
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
