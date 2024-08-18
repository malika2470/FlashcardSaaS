'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';

export default function StudyMode() {
    const { setId } = useParams();
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFlashcardSet() {
            if (!user || !setId) return;

            setLoading(true);
            setError(null);

            try {
                const docRef = doc(db, 'flashcard_sets', setId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFlashcards(docSnap.data().flashcards);
                } else {
                    setError('Flashcard set not found.');
                }
            } catch (error) {
                setError('Failed to load flashcard set. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded && isSignedIn) {
            fetchFlashcardSet();
        } else {
            setLoading(false);
            setError('You must be signed in to view and study flashcards.');
        }
    }, [user, isLoaded, isSignedIn, setId]);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleNext = () => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
        setFlipped(false);
    };

    const handlePrevious = () => {
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        setFlipped(false);
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

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

    if (flashcards.length === 0) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No flashcards found in this set.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center', backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px' }}>
            <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Lato, sans-serif', color: '#3F51B5', fontWeight: 'bold' }}>
                Study Mode
            </Typography>
            <Box
                {...handlers}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    padding: 2,
                    backgroundColor: '#E3F2FD',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    perspective: '1000px',
                    position: 'relative',
                    width: '100%',
                }}
                onMouseEnter={() => setFlipped(true)}
                onMouseLeave={() => setFlipped(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s',
                        transform: `rotateX(${flipped ? 180 : 0}deg)`,
                        borderRadius: '12px',
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
                            padding: 2,
                            boxSizing: 'border-box',
                            borderRadius: '12px',
                            backgroundColor: '#E3F2FD',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5' }}>
                            {flashcards[currentCard].front}
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
                            padding: 2,
                            boxSizing: 'border-box',
                            borderRadius: '12px',
                            backgroundColor: '#E3F2FD',
                            transform: 'rotateX(180deg)',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontFamily: 'Lato, sans-serif', color: '#3F51B5' }}>
                            {flashcards[currentCard].back}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
