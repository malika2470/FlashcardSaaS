'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Container, Typography, Button, CircularProgress, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';

export default function Quiz() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setId = searchParams.get('setId');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);

    useEffect(() => {
        async function fetchQuiz() {
            if (!setId) return;

            setLoading(true);
            try {
                const docRef = doc(collection(db, 'quizzes'), setId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const quizData = docSnap.data().questions || [];
                    console.log("Fetched quiz questions:", quizData);
                    setQuestions(quizData);
                } else {
                    console.error('No quiz found for the given setId');
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
                alert('There was an error loading the quiz. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [setId]);

    const handleAnswerChange = (event) => {
        setSelectedAnswer(event.target.value);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer) {
            setUserAnswers(prev => ({
                ...prev,
                [currentQuestionIndex]: selectedAnswer
            }));

            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer('');
            } else {
                calculateScore();
                setQuizCompleted(true);
            }
        } else {
            alert('Please select an answer before proceeding.');
        }
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
    };

    if (loading) {
        return (
            <Container maxWidth="100vw">
                <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />
            </Container>
        );
    }

    if (quizCompleted) {
        return (
            <Container maxWidth="100vw">
                <Typography variant="h4" sx={{ mt: 4 }}>
                    Quiz Completed!
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Your Score: {score}/{questions.length}
                </Typography>
                <Button onClick={() => router.push('/flashcards')} sx={{ mt: 4 }}>
                    Back to Flashcards
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ mt: 4 }}>
                Quiz
            </Typography>
            {questions.length > 0 ? (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">
                        {questions[currentQuestionIndex].text}
                    </Typography>
                    <RadioGroup
                        value={selectedAnswer}
                        onChange={handleAnswerChange}
                        sx={{ mt: 2 }}
                    >
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                value={option}
                                control={<Radio />}
                                label={option}
                                aria-label={`Option ${index + 1}`}
                            />
                        ))}
                    </RadioGroup>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextQuestion}
                        sx={{ mt: 2 }}
                    >
                        {currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                </Box>
            ) : (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No quiz questions available.
                </Typography>
            )}
        </Container>
    );
}