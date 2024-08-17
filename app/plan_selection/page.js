'use client'
import { Container, Typography, Box, Button, Grid, List, ListItem, ListItemText, AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Tilt } from 'react-tilt';

export default function PlanSelectionPage() {
    const router = useRouter();

    const handleSelectFree = () => {
        router.push('/sign-up');
    };
    
    const handleSelectPro = async () => {
        try {
            const response = await fetch('/api/checkout_session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plan: 'Pro' }),
            });
    
            const session = await response.json();
            if (session.error) {
                console.error('Error creating checkout session:', session.error);
                return;
            }
    
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
            if (stripe) {
                const { error } = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });
    
                if (error) {
                    console.warn('Stripe error:', error.message);
                }
            } else {
                console.error('Stripe failed to load.');
            }
        } catch (error) {
            console.error('Error during Stripe checkout:', error);
        }
    };
    

    return (
        <div style={{ backgroundColor: '#D5D4E5', minHeight: '100vh', margin: 0, padding: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: '#D5D4E5', boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#000', fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                        Flashcard SaaS
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth="md"
                sx={{ textAlign: 'center', mt: 8, padding: '2rem', backgroundColor: 'transparent' }}
            >
                <Typography variant="h4" gutterBottom sx={{ color: '#000', fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                    Please Choose Your Plan
                </Typography>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {/* Free Plan Details */}
                    <Grid item xs={12} md={6}>
                        <Tilt options={{ max: 25, scale: 1.05 }}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'white',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    },
                                    color: '#000',
                                    fontFamily: 'Roboto, sans-serif',
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Free Plan
                                </Typography>
                                <List sx={{ listStyleType: 'disc', pl: 2 }}>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="Access to saved flashcard sets." />
                                    </ListItem>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="Create new flashcard sets and save them in folders." />
                                    </ListItem>
                                </List>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2, backgroundColor: '#3f50b5' }}
                                    onClick={handleSelectFree}
                                >
                                    Choose Free Plan
                                </Button>
                            </Box>
                        </Tilt>
                    </Grid>

                    {/* Pro Plan Details */}
                    <Grid item xs={12} md={6}>
                        <Tilt options={{ max: 25, scale: 1.05 }}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'white',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    },
                                    color: '#000',
                                    fontFamily: 'Roboto, sans-serif',
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Pro Plan $5
                                </Typography>
                                <List sx={{ listStyleType: 'disc', pl: 2 }}>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="Access to saved flashcard sets." />
                                    </ListItem>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="Create new flashcard sets and save them in folders." />
                                    </ListItem>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="AI generation of flashcards with options to edit, delete, and add." />
                                    </ListItem>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="Ability to create custom flashcards." />
                                    </ListItem>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="URL feature to edit flashcards." />
                                    </ListItem>
                                    <ListItem sx={{ display: 'list-item' }}>
                                        <ListItemText primary="Quiz feature for enhanced learning." />
                                    </ListItem>
                                </List>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2, backgroundColor: '#3f50b5' }}
                                    onClick={handleSelectPro}
                                >
                                    Choose Pro Plan
                                </Button>
                            </Box>
                        </Tilt>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
