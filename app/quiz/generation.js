'use client';

import { db } from '@/firebase';
import { doc, collection, setDoc } from 'firebase/firestore';

/**
 * Generate a quiz from a list of flashcards and save it to Firestore.
 * @param {Array} flashcards - An array of flashcard objects with 'front' and 'back' properties.
 * @param {string} quizId - The unique ID for the quiz document in Firestore.
 */
export async function generateQuizFromFlashcards(flashcards, quizId) {
    if (!flashcards || flashcards.length === 0) {
        console.error('No flashcards provided');
        return;
    }

    if (!quizId) {
        console.error('Invalid quizId');
        return;
    }

    // Flatten flashcard fronts and backs into a single array of potential answers
    const allAnswers = flashcards.flatMap(fc => [fc.front, fc.back]);

    // Generate quiz questions
    const questions = flashcards.map(flashcard => {
        const correctAnswer = flashcard.back;

        // Select answers ensuring no duplicates and correct answer is included
        let options = [correctAnswer];
        while (options.length < 4) {
            const randomOption = allAnswers[Math.floor(Math.random() * allAnswers.length)];
            if (randomOption !== correctAnswer && !options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        // Shuffle options to randomize order
        options = options.sort(() => Math.random() - 0.5);

        return {
            text: flashcard.front,
            options,
            correctAnswer
        };
    });

    try {
        // Save quiz questions to Firestore
        const quizRef = doc(collection(db, 'quizzes'), quizId);
        await setDoc(quizRef, { questions });
        console.log('Quiz saved successfully');
    } catch (error) {
        console.error('Error saving quiz:', error);
    }
}