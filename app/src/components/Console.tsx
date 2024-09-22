import React from 'react';
import { Box, Typography } from '@mui/material';

interface ConsoleProps {
  output: string[];
}

const Console: React.FC<ConsoleProps> = ({ output }) => {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        padding: 2,
        borderRadius: 2,
        maxHeight: '300px',
        overflowY: 'auto',
        backgroundColor: '#1e1e1e',
        color: '#fff',
      }}
    >
      {output.length === 0 ? (
        <Typography>No output yet</Typography>
      ) : (
        output.map((line, index) => (
          <Typography key={index}>{line}</Typography>
        ))
      )}
    </Box>
  );
};

export default Console;
