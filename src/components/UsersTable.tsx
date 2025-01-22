import React from 'react';
import { Container, Card, CardContent, Typography, Box, Button } from '@mui/material';

const UsersTable = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 2,
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '0.1',  }}>
                        Users Table
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                        Manage Table
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}>
                    <Button variant="contained">Add Users</Button>
                </Box>
            </Box>


            <Card sx={{
                boxShadow: 2,
                borderRadius: 2,
                padding: 1.1,
            }}
            >
                <CardContent>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '5px'}}>ID</th>
                                <th style={{ padding: '10px'}}>Name</th>
                                <th style={{ padding: '10px'}}>Email</th>
                                <th style={{ padding: '10px'}}>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ padding: '10px'}}>{user.id}</td>
                                    <td style={{ padding: '10px'}}>{user.name}</td>
                                    <td style={{ padding: '10px'}}>{user.email}</td>
                                    <td style={{ padding: '10px'}}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UsersTable;
