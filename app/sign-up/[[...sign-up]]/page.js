'use client';
import { AppBar, Typography, Container, Button, Toolbar, Box } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link
import { SignUp } from '@clerk/nextjs'; // Import Clerk's SignUp component

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw">
            <AppBar position="static" sx={{ backgroundColor: '#3f50b5' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Link href="/sign-in" passHref>
                        <Button color="inherit">Sign In</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8 }}
            >
                <Typography variant="h4">Sign Up</Typography>
           
            </Box>
        </Container>
    );
}
