import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material';
import { LoginSectionData } from "../data/LoginSectionData";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Login submitted with:', { email, password });
  };  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        margin: 0,
        borderRadius: '40px'
      }}
    >
      {/* Left Column (Text Section) */}
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: '#fff',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          {LoginSectionData.title}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          {LoginSectionData.description}
        </Typography>
      </Box>

      {/* Right Column (Login Card Section) */}
      <Box
        sx={{
          flex: 1,
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card elevation={5} sx={{ width: '100%', maxWidth: 420, padding: 3, }}>
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: 1 }}>
              {LoginSectionData.cardTitle} 
            </Typography>
            <Typography variant="subtitle2" sx={{ marginTop: 2, }}>
              {LoginSectionData.cardDescription}
          </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: 2,
                  padding: '10px 20px', 
                  borderRadius: "17px"
                }}
              >
                {LoginSectionData.buttonText}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
