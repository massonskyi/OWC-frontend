import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Импортируем иконку
import { IExecBtnProps } from '../../interfaces/ITextEditor/IExecBtnProps';
import { executeCode } from '../../api'; // Настройте путь импорта при необходимости

const ExecBtn: React.FC<IExecBtnProps> = ({ code, language, onOutput }) => {
  const executeCodeHandler = useCallback(async () => {
    try {
      const result = await executeCode({ code, language });
      onOutput(result.output || result.error);
    } catch (error: any) {
      onOutput(error.message);
    }
  }, [code, language, onOutput]);

  return (
    <Button onClick={executeCodeHandler} variant="contained" color="primary" >
      <PlayArrowIcon />
    </Button>
  );
};

export default ExecBtn;
