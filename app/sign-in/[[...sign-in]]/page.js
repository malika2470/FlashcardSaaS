import { AppBar, Typography, Container, Button, Toolbar, Link, Box } from "@mui/material";
import { SignIn } from "@clerk/nextjs";
export default function SignUp() {
    return (<Container maxWidth='100vw'>
        <AppBar position="Static" sx={{ backgroundColor: '3f5b5' }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    Flashcard SAAS
                </Typography>
                <Button color="inherit" >
                    <Link href="/login" passHref>Login</Link>
                </Button>
                <Button color="inherit">
                    <Link href="/login" passHref>Sign Up</Link>
                </Button>
            </Toolbar>
        </AppBar>
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems="center"
        >
            <Typography variant="h4"> Sign In</Typography>
            <SignIn />
        </Box>
    </Container>

    )
}