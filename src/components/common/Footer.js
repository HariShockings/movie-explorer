import React from 'react';
import { Container, Typography, Link } from '@mui/material';

// Footer component displays a centered copyright notice with a styled link to the creator's portfolio.
function Footer() {
  return (
    // Container provides consistent padding and centers content for a clean layout.
    <Container sx={{ py: 4, textAlign: 'center' }}>
      {/* Typography displays the copyright text and creator's name in a subtle, secondary color. */}
      <Typography variant="body2" color="text.secondary">
        {/* Copyright notice for 2025, tied to the MovieFlix brand. */}
        © 2025 MovieFlix. Created by{' '}
        {/* Link to Hariharan's portfolio, styled with a Netflix-like red color scheme. */}
        <Link
          href="https://hariharan-portfolio-psi.vercel.app/"
          target="_blank" // Opens link in a new tab for better UX.
          rel="noopener noreferrer" // Security best practice to prevent window.opener attacks.
          sx={{
            color: '#e50914', // Netflix red for brand consistency.
            textDecoration: 'none', // Removes default underline for a cleaner look.
            fontWeight: 500, // Slightly bold for emphasis.
            transition: 'color 0.3s ease, transform 0.3s ease', // Smooth hover effects.
            '&:hover': {
              color: '#b20710', // Darker red on hover for visual feedback.
              textDecoration: 'underline', // Adds underline on hover for clarity.
              transform: 'scale(1.05)', // Subtle scale effect for interactivity.
            },
          }}
        >
          Hariharan
        </Link>
        .
      </Typography>
    </Container>
  );
}

export default Footer;