// src/pages/SearchResults.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchUsers } from '../api';
import { Container } from '../components/Shared/Container';
import { Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  age: number;
  phone: string;
  username: string;
  avatar: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await searchUsers(query);
        const results = response.users;
        setUsers(results);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (query) {
      fetchUsers();
    }
  }, [query]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Search Results for "{query}"
      </Typography>
      {users.length > 0 ? (
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card>
                <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardMedia
                    component="img"
                    alt={`${user.name}'s avatar`}
                    height="140"
                    image={user.avatar}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {user.name} {user.surname}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.username}
                    </Typography>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">No results found.</Typography>
      )}
    </Container>
  );
};

export default SearchResults;
