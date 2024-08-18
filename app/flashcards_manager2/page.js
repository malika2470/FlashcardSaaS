'use client';

import { Container } from '@mui/material';
import CreateFlashcards from './CreateFlashcards';
import DisplayFlashcards from './DisplayFlashcards';

export default function FlashcardsManager() {
    return (
        <Container maxWidth="lg">
            <DisplayFlashcards />
            <CreateFlashcards />
        </Container>
    );
}
