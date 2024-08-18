'use client';

import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Container, Typography, Box, TextField, Button, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CreateFlashcards() {
    const [name, setName] = useState('');
    const [newFlashcards, setNewFlashcards] = useState([{ front: '', back: '' }]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

    const handleSaveFlashcards = async () => {
        if (!name.trim()) {
            alert("Please enter a name for the flashcard set");
            return;
        }

        setLoading(true);
        try {
            const flashcardSetId = uuidv4(); // Generate a unique ID for the new flashcard set
            const creationDate = new Date().toISOString(); // Get the current date and time
            const flashcardsData = { name, flashcards: newFlashcards, creationDate }; // Include the creation date

            // Save the flashcard set with its ID
            await setDoc(doc(db, 'flashcard_sets', flashcardSetId), flashcardsData);

            alert('Flashcards saved successfully!');
            setName('');
            setNewFlashcards([{ front: '', back: '' }]); // Reset the form after saving
        } catch (error) {
            console.error('Error saving flashcards:', error);
            alert('Error saving flashcards');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#FFFFFF' }}>
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
                {newFlashcards.map((flashcard, index) => (
                    <Card key={index} sx={{ mb: 2, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5' }}>
                                Flashcard {index + 1}
                            </Typography>
                            <TextField
                                label="Front"
                                variant="outlined"
                                fullWidth
                                value={flashcard.front}
                                onChange={(e) => handleFrontChange(index, e)}
                                sx={{ mb: 1, borderRadius: '8px' }}
                            />
                            <TextField
                                label="Back"
                                variant="outlined"
                                fullWidth
                                value={flashcard.back}
                                onChange={(e) => handleBackChange(index, e)}
                                sx={{ mb: 1, borderRadius: '8px' }}
                            />
                            <IconButton onClick={() => handleRemoveFlashcard(index)} sx={{ color: '#E57373' }}>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" onClick={handleAddFlashcard} sx={{ backgroundColor: '#5C6BC0', '&:hover': { backgroundColor: '#3F51B5' }, borderRadius: '8px' }}>
                        Add Flashcard
                    </Button>
                    <Button variant="contained" onClick={handleSaveFlashcards} sx={{ backgroundColor: '#42A5F5', '&:hover': { backgroundColor: '#1E88E5' }, borderRadius: '8px' }}>
                        Save Flashcards
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
