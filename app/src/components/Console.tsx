import React from 'react';
import { Box, Typography } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ConsoleProps {
  output: string[];
}

const Console: React.FC<ConsoleProps> = ({ output }) => {
  const lastOutput = output.length > 0 ? output[output.length - 1] : '';

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
        whiteSpace: 'pre-wrap', // Добавляем перенос строк
      }}
    >
      {lastOutput === '' ? (
        <Typography>No output yet</Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}> {/* Добавляем горизонтальную прокрутку */}
          <SyntaxHighlighter
            language="javascript"
            style={docco}
            customStyle={{ backgroundColor: '#1e1e1e', color: '#fff', wordBreak: 'break-all' }} // Добавляем wordBreak
          >
            {lastOutput}
          </SyntaxHighlighter>
        </Box>
      )}
    </Box>
  );
};

export default Console;