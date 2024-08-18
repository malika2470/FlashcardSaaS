'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { db } from '../../firebase';
import { getDoc, doc, collection, writeBatch, setDoc, arrayUnion} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; 
import {
    TextField, Container, Box, Typography, Paper, Button,
    Grid, Card, CardActionArea, CardContent, Dialog,
    DialogTitle, DialogContent, DialogContentText,
    DialogActions
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [textError, setTextError] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        console.log("Generate button clicked"); // Log when button is clicked
        if (!text.trim()) {
            setTextError('Please enter text to generate flashcards.');
            return;
        } else {
            setLoading(true);
        }
        console.log("Fetching flashcards from API"); // Log before API request
        setTextError('');
    
        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to generate flashcards");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Flashcards received:", data); // Log the received data
                setFlashcards(data || []);
            })
            .catch((error) => {
                console.error("Error generating flashcards:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };    

    const handleCardClick = id => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a name");
            return;
        }
    
        // Generate a unique ID for the new flashcard set
        const flashcardSetId = uuidv4();
    
        // Include the ID when saving the flashcard set
        const flashcardsData = {
            id: flashcardSetId,
            name,
            flashcards // This includes all the flashcards generated
        };
    
        const userDocRef = doc(db, 'users', user.id);
    
        // Save the flashcard set in the user's document, merging with existing data
        await setDoc(userDocRef, {
            flashcards: arrayUnion(flashcardsData) // Add the new set to the user's flashcards array
        }, { merge: true });
    
        handleClose();
        router.push('/flashcards_manager2/view');
    };
    
    
    return (
        <Container maxWidth="md" sx={{ mt: 4, minHeight: "100vh" }}>
            <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ color: 'black', mb: 4 }}>Generate Flashcards</Typography>
                <Paper sx={{ p: 4, width: '100%', backgroundColor: 'white', boxShadow: 3 }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter the topic"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        error={Boolean(textError)}
                        helperText={textError}
                        sx={{ mb: 2 }}
                    />
                    <LoadingButton
                        loading={loading}
                        loadingIndicator="Loading..."
                        variant='contained'
                        color='primary'
                        onClick={handleSubmit}
                        fullWidth
                        sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}
                    >
                        Generate
                    </LoadingButton>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'black' }}>Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ minHeight: '150px', boxShadow: 3 }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    minHeight: '150px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    minHeight: '150px',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                }
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="body1" component="div" align="center">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="body1" component="div" align="center">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleOpen}
                            sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}
                        >
                            Save Flashcards
                        </Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Save Flashcards</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Enter a name for your flashcard collection:
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    label="Collection Name"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} sx={{ color: 'blue' }}>Cancel</Button>
                                <Button onClick={saveFlashcards} sx={{ color: 'blue' }}>Save</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            )}
        </Container>
    );
}