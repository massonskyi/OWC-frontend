import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import styled from '@emotion/styled';

const FuturesContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Futures: React.FC = () => {
  const futures = [
    { id: 1, name: 'Проекты' },
    { id: 2, name: 'Личные Workspaces' },
    { id: 3, name: 'Улучшенный поиск' },
  ];

  return (
    <FuturesContainer>
      <Typography variant="h4" component="h2" gutterBottom>
        Futures
      </Typography>
      <List>
        {futures.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </FuturesContainer>
  );
};

export default Futures;
