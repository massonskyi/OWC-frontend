import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { executeCode } from '../../api';

interface IExecBtnProps {
  code: string;
  language: string;
  onOutput: (output: string) => void;
  onClick?: () => void; // Add onClick prop to the interface
}

const ExecBtn: React.FC<IExecBtnProps> = ({ code, language, onOutput, onClick }) => {
  const executeCodeHandler = useCallback(async () => {
    try {
      const result = await executeCode({ code, language });
      onOutput(result.output || result.error);
    } catch (error: any) {
      onOutput(error.message);
    }
    if (onClick) {
      onClick(); // Call the onClick prop if it exists
    }
  }, [code, language, onOutput, onClick]);

  return (
    <Button onClick={executeCodeHandler} variant="contained" color="primary">
      <PlayArrowIcon />
    </Button>
  );
};

export default ExecBtn;
