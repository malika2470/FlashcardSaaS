'use client';
import { Container, Typography } from '@mui/material';

export default function ProDashboard() {
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                Welcome to the Pro Dashboard
            </Typography>
            <Typography variant="body1">Here you can access Pro features!</Typography>
        </Container>
    );
}
