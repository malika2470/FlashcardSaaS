'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Container, Typography, Box, Button, Grid, Card, CardContent, TextField, AppBar, Toolbar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default function EditFlashcardSet() {
    const { setId } = useParams();
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchFlashcardSet() {
            if (!user || !setId) return;

            setLoading(true);
            setError(null);

            try {
                const userDocRef = doc(db, 'users', user.id);
                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const flashcardSet = data.flashcards.find(set => set.id === setId);
                    setFlashcardSet(flashcardSet);
                } else {
                    setError('No such document found.');
                }
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setError('Failed to load flashcard set. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded && isSignedIn) {
            fetchFlashcardSet();
        } else {
            setLoading(false);
            setError('You must be signed in to edit flashcards.');
        }
    }, [user, isLoaded, isSignedIn, setId]);

    const handleSaveChanges = async () => {
        if (!flashcardSet) return;

        try {
            const userDocRef = doc(db, 'users', user.id);
            await updateDoc(userDocRef, {
                flashcards: flashcardSet.flashcards
            });

            alert('Flashcard set updated successfully!');
        } catch (error) {
            console.error('Error updating flashcard set:', error);
            alert('Failed to update flashcard set. Please try again later.');
        }
    };

    const handleDeleteSet = async () => {
        try {
            const userDocRef = doc(db, 'users', user.id);
            await updateDoc(userDocRef, {
                flashcards: arrayRemove(flashcardSet)
            });

            alert('Flashcard set deleted successfully!');
            router.push('/flashcards_manager2/view');
        } catch (error) {
            console.error('Error deleting flashcard set:', error);
            alert('Failed to delete flashcard set. Please try again later.');
        }
    };

    if (loading) {
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

            <Container maxWidth="md" sx={{ paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px', marginTop: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5', fontWeight: 'bold', textAlign: 'center' }}>
                    Edit Flashcard Set
                </Typography>

                {flashcardSet ? (
                    <Box>
                        <Grid container spacing={2}>
                            {flashcardSet.flashcards.map((flashcard, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card sx={{ backgroundColor: '#E3F2FD', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                        <CardContent>
                                            <TextField
                                                label="Front"
                                                variant="outlined"
                                                fullWidth
                                                value={flashcard.front}
                                                onChange={(e) => {
                                                    const updatedFlashcards = [...flashcardSet.flashcards];
                                                    updatedFlashcards[index].front = e.target.value;
                                                    setFlashcardSet({ ...flashcardSet, flashcards: updatedFlashcards });
                                                }}
                                                sx={{ mb: 2, borderRadius: '8px' }}
                                            />
                                            <TextField
                                                label="Back"
                                                variant="outlined"
                                                fullWidth
                                                value={flashcard.back}
                                                onChange={(e) => {
                                                    const updatedFlashcards = [...flashcardSet.flashcards];
                                                    updatedFlashcards[index].back = e.target.value;
                                                    setFlashcardSet({ ...flashcardSet, flashcards: updatedFlashcards });
                                                }}
                                                sx={{ mb: 2, borderRadius: '8px' }}
                                            />
                                            <IconButton
                                                onClick={() => {
                                                    const updatedFlashcards = flashcardSet.flashcards.filter((_, i) => i !== index);
                                                    setFlashcardSet({ ...flashcardSet, flashcards: updatedFlashcards });
                                                }}
                                                sx={{ color: '#E57373' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                sx={{
                                    backgroundColor: '#42A5F5',
                                    '&:hover': { backgroundColor: '#1E88E5' },
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                    borderRadius: '8px'
                                }}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteSet}
                                sx={{
                                    backgroundColor: '#FF7043',
                                    '&:hover': { backgroundColor: '#F4511E' },
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                    borderRadius: '8px'
                                }}
                            >
                                Delete Set
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography>No flashcard set found</Typography>
                )}
            </Container>
        </Box>
    );
}
