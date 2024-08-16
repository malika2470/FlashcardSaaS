'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid, CircularProgress, Paper } from "@mui/material";
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {

  const handleSubmit = async () => {
    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!checkoutSession.ok) {
        const errorResponse = await checkoutSession.text();
        throw new Error(errorResponse || 'Something went wrong with the API request');
      }

      const checkoutSessionJson = await checkoutSession.json();

      if (checkoutSessionJson.statuscode === 500) {
        console.error(checkoutSessionJson.message);
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const style = {
    p: 3,
    border: "1px solid",
    borderColor: "grey.300",
    borderRadius: 2,
    background: 'white',
    boxShadow: '2',
    borderRadius: '15px',
  }

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Link href="/sign-in" passHref>
              <Button color="inherit">Login</Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button color="inherit">Sign Up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h5" gutterBottom>Welcome to Flashcard SaaS</Typography>
        <Typography variant="h6">The easiest way to make flashcards from text</Typography>
        <Link href="/generate">
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
            Get Started
          </Button>
        </Link>
      </Box>

      <Box sx={{ my: 6, textAlign: "justify" }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Featured
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={style}>
              <Typography variant="h5">Smart Flashcards</Typography>
              <Typography>
                Our AI intelligently breaks down your text into concise flashcards.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={style}>
              <Typography variant="h5">Easy Text Input</Typography>
              <Typography>
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={style}>
              <Typography variant="h5" gutterBottom>Custom Plan</Typography>
              <Typography>
                Tailor-made plans to fit your specific needs and preferences.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={style}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6">$5 / month</Typography>
              <Typography>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                Choose Basic
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={style}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6">$10 per month</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={style}>
              <Typography variant="h5" gutterBottom>Free</Typography>
              <Typography>
                Create your own flashcards with limited storage. Try out AI feature.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
