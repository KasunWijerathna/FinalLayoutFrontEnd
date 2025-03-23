import { Box, Container, Typography, Paper } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            About Layout Index
          </Typography>
          <Typography variant="body1" paragraph>
            Layout Index is a powerful tool designed to help you manage and organize your layouts efficiently. 
            Whether you're working on a small project or managing multiple locations, our platform provides 
            the tools you need to stay organized and productive.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            We aim to simplify the process of managing layouts and devices across multiple locations. 
            Our platform provides a centralized solution that helps teams collaborate effectively and 
            maintain organization in their work.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Features
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 2 }}>
            <li>Easy organization of layouts and devices</li>
            <li>Real-time collaboration tools</li>
            <li>Powerful search and filtering capabilities</li>
            <li>Secure authentication and authorization</li>
            <li>Responsive design for all devices</li>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
} 