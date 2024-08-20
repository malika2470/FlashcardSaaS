'use client';

import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useUser } from '@clerk/nextjs';
import {
    Container, Typography, Box, TextField, Button,
    Card, CardContent, Grid, IconButton, AppBar, Toolbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserButton } from '@clerk/nextjs';

export default function CreateFlashcards() {
    const [name, setName] = useState('');
    const [newFlashcards, setNewFlashcards] = useState([{ front: '', back: '' }]);
    const [flipped, setFlipped] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();  // Getting the current user

    const handleFrontChange = (index, event) => {
        const updatedFlashcards = [...newFlashcards];
        updatedFlashcards[index].front = event.target.value;
        setNewFlashcards(updatedFlashcards);
    };

    const handleBackChange = (index, event) => {
        const updatedFlashcards = [...newFlashcards];
        updatedFlashcards[index].back = event.target.value;
        setNewFlashcards(updatedFlashcards);
    };

    const handleAddFlashcard = () => {
        setNewFlashcards([...newFlashcards, { front: '', back: '' }]);
    };

    const handleRemoveFlashcard = (index) => {
        const updatedFlashcards = newFlashcards.filter((_, i) => i !== index);
        setNewFlashcards(updatedFlashcards);
    };

    const handleCardClick = (index) => {
        setFlipped((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const saveFlashcards = async () => {
        if (!name.trim()) {
            alert("Please enter a name for the flashcard set");
            return;
        }

        setLoading(true);
        try {
            const flashcardSetId = uuidv4();
            const flashcardsData = { name, flashcards: newFlashcards };

            // Using the user's UID to create a subcollection under the user's document
            const userDocRef = doc(db, 'users', user.id);
            const flashcardSetDocRef = doc(userDocRef, 'flashcard_sets', flashcardSetId);

            await setDoc(flashcardSetDocRef, flashcardsData);
            alert('Flashcards saved successfully!');
            setName('');
            setNewFlashcards([{ front: '', back: '' }]);
            router.push('/flashcards_manager/view');
        } catch (error) {
            console.error('Error saving flashcards:', error);
            alert('Error saving flashcards');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#E3F2FD' }}>
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: '#3F51B5', boxShadow: 'none', mb: 4 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', fontFamily: "'Lato', sans-serif", cursor: 'pointer' }}
                        onClick={() => router.push('/flashcards_manager/view')}
                    >
                        FlipSmart
                    </Typography>
                    <UserButton />
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5', fontWeight: 'bold', textAlign: 'center' }}>
                    Create New Flashcard Set
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Collection Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2, borderRadius: '8px' }}
                    />
                    <Grid container spacing={2}>
                        {newFlashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card sx={{ mb: 2, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                    <CardContent>
                                        <TextField
                                            label="Enter Front"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={flashcard.front}
                                            onChange={(e) => handleFrontChange(index, e)}
                                            sx={{ mb: 1, borderRadius: '8px' }}
                                        />
                                        <TextField
                                            label="Enter Back"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={flashcard.back}
                                            onChange={(e) => handleBackChange(index, e)}
                                            sx={{ mb: 1, borderRadius: '8px' }}
                                        />
                                        <IconButton onClick={() => handleRemoveFlashcard(index)} sx={{ color: '#E57373' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleAddFlashcard}
                            sx={{
                                backgroundColor: '#5C6BC0',
                                '&:hover': { backgroundColor: '#3F51B5' },
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            Add Flashcard
                        </Button>
                        <Button
                            variant="contained"
                            onClick={saveFlashcards}
                            sx={{
                                backgroundColor: '#42A5F5',
                                '&:hover': { backgroundColor: '#1E88E5' },
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            Save Flashcards
                        </Button>
                    </Box>
                </Box>

                {(newFlashcards.length > 0) && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" sx={{ color: 'black', fontFamily: 'Lato, sans-serif', fontWeight: 'bold' }}>
                            Flashcards Preview
                        </Typography>
                        <Grid container spacing={2}>
                            {newFlashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            minHeight: '200px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#ffffff',
                                            cursor: 'pointer',
                                            perspective: '1000px',
                                            '&:hover': {
                                                transform: flipped[index] ? 'none' : 'rotateY(180deg)',
                                                transition: 'transform 0.6s ease-in-out',
                                            },
                                        }}
                                        onClick={() => handleCardClick(index)}
                                    >
                                        <CardContent
                                            sx={{
                                                position: 'relative',
                                                transformStyle: 'preserve-3d',
                                                transition: 'transform 0.6s ease-in-out',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    p: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    component="div"
                                                    align="center"
                                                    sx={{
                                                        fontFamily: 'Lato, sans-serif',
                                                        color: '#3F51B5',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem',
                                                    }}
                                                >
                                                    {flashcard.front}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    p: 2,
                                                    transform: 'rotateY(180deg)',
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    component="div"
                                                    align="center"
                                                    sx={{
                                                        fontFamily: 'Lato, sans-serif',
                                                        color: '#3F51B5',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem',
                                                    }}
                                                >
                                                    {flashcard.back}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
