'use client';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';

export default function ProDashboard() {
    return (
        <Container 
            maxWidth="false" 
            disableGutters
            sx={{ 
                minHeight: '100vh', 
                backgroundColor: '#E3F2FD', 
                padding: '20px' 
            }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    color: '#3F51B5' 
                }}>
                Welcome to the Pro Dashboard
            </Typography>
            <Typography 
                variant="body1" 
                sx={{ textAlign: 'center', mb: 4, color: '#5C6BC0' }}>
                Here you can access all the Pro features!
            </Typography>

            <Grid container spacing={4}>
                {/* Access Saved Flashcard Sets */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
                                Access Saved Flashcard Sets
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#5C6BC0' }}>
                                View and manage all your previously saved flashcard sets.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large" variant="contained" sx={{ backgroundColor: '#9575CD' }}>
                                Go to My Sets
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Create New Flashcard Sets */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
                                Edit your previously made flashcard sets
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#5C6BC0' }}>
                                Add or delete your old flashcard sets. 
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large" variant="contained" sx={{ backgroundColor: '#9575CD' }}>
                                Edit my sets
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* AI Generation of Flashcards */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
                                AI Generation of Flashcards
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#5C6BC0' }}>
                                Automatically generate flashcards with AI and customize them as you wish.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large" variant="contained" sx={{ backgroundColor: '#9575CD' }}>
                                Generate with AI
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Custom Flashcards */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
                                Create Custom Flashcards
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#5C6BC0' }}>
                                Create and customize flashcards tailored to your learning needs.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large" variant="contained" sx={{ backgroundColor: '#9575CD' }}>
                                Create Custom Flashcards
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* URL Feature */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
                                URL Feature
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#5C6BC0' }}>
                                Create your flashcards directly through a URL link.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large" variant="contained" sx={{ backgroundColor: '#9575CD' }}>
                                Edit via URL
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Quiz Feature */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: '#D1C4E9', borderRadius: '8px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
                                Quiz Feature
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#5C6BC0' }}>
                                Test your knowledge with customized quizzes based on your flashcards.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large" variant="contained" sx={{ backgroundColor: '#9575CD' }}>
                                Start a Quiz
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
