'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { db } from '@/firebase'
import { getDoc, doc, collection, writeBatch } from 'firebase/firestore'

import {
    TextField, Container, Box, Typography, Paper, Button,
    Grid, Card, CardActionArea, CardContent, Dialog,
    DialogTitle, DialogContent, DialogContentText,
    DialogActions, AppBar, Tabs, Tab
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const [customFront, setCustomFront] = useState('');
    const [customBack, setCustomBack] = useState('');
    const [customFlashcards, setCustomFlashcards] = useState([]);
    const [textError, setTextError] = useState('');
    const [customFrontError, setCustomFrontError] = useState('');
    const [customBackError, setCustomBackError] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleTabChange = (_, newValue) => {
        setTab(newValue);
    };

    const handleSubmit = () => {
        if (!text.trim()) {
            setTextError('Please enter text to generate flashcards.');
            return;
        } else {
            setLoading(true);
        }
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

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        const collections = docSnap.exists() ? docSnap.data().flashcards || [] : [];
        if (collections.find((f) => f.name === name)) {
            alert("Flashcard collection with the same name already exists");
            return;
        }
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });

        const colRef = collection(userDocRef, name);
        [...flashcards, ...customFlashcards].forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('flashcards');
    }

    const addCustomFlashcard = () => {
        let valid = true;
        if (!customFront.trim()) {
            setCustomFrontError('Please enter text for the front of the flashcard.');
            valid = false;
        } else {
            setCustomFrontError('');
        }
        if (!customBack.trim()) {
            setCustomBackError('Please enter text for the back of the flashcard.');
            valid = false;
        } else {
            setCustomBackError('');
        }

        if (valid) {
            setCustomFlashcards(prev => [...prev, { front: customFront, back: customBack }]);
            setCustomFront('');
            setCustomBack('');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <AppBar position="static" sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                <Tabs value={tab} onChange={handleTabChange} centered>
                    <Tab label="AI-Generated Flashcards" />
                    <Tab label="Create Custom Flashcards" />
                </Tabs>
            </AppBar>

            {tab === 0 && (
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
            )}

            {tab === 1 && (
                <Box sx={{ mt: 4, mb: 6 }}>
                    <Typography variant="h4" sx={{ color: 'black', mb: 4 }}>Create Custom Flashcards</Typography>
                    <Paper sx={{ p: 4, backgroundColor: 'white', boxShadow: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={customFront}
                                    onChange={(e) => setCustomFront(e.target.value)}
                                    label="Enter Front"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    error={Boolean(customFrontError)}
                                    helperText={customFrontError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={customBack}
                                    onChange={(e) => setCustomBack(e.target.value)}
                                    label="Enter Back"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    error={Boolean(customBackError)}
                                    helperText={customBackError}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={addCustomFlashcard}
                            fullWidth
                            sx={{ mt: 2, backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}
                        >
                            Add Flashcard
                        </Button>
                    </Paper>
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        {customFlashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ minHeight: '150px', boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="body1" align="center">
                                            {flashcard.front}
                                        </Typography>
                                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                            {flashcard.back}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {(flashcards.length > 0 || customFlashcards.length > 0) && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ color: 'black' }}>Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {[...flashcards, ...customFlashcards].map((flashcard, index) => (
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
