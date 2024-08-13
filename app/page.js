import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import Head from 'next/head';

export default function Home() {
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
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h5" gutterBottom>Welcome to Flashcard SaaS</Typography>
        <Typography variant="h6">The easiest way to make flashcards from text</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5">Smart Flashcards</Typography>
            <Typography>
              Our AI intelligently breaks down your text into concise flashcards.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>Basic</Typography>
            <Typography variant="h6">$5 / month</Typography>
            <Typography>
              Access to basic flashcard features and limited storage.
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Choose Basic
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant="h5">Easy Text Input</Typography>
              <Typography>
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>Smart Flashcards</Typography>
            <Typography>
              Our AI intelligently breaks down your text into concise flashcards.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5">Pro</Typography>
            <Typography>
              $10 per month
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>Custom Plan</Typography>
            <Typography>
              Tailor-made plans to fit your specific needs and preferences.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
