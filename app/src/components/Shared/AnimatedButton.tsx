import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

interface AnimatedButtonProps {
  type?: 'button' | 'submit' | 'reset'; // Добавляем свойство type
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean; // Добавляем свойство disabled
}

const Button = styled(motion.button)<{ disabled?: boolean }>`
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 12px 24px;
  font-size: 18px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  display: inline-block;
  font-family: 'Roboto', sans-serif;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: rgba(255, 255, 255, 0.1);
    transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  &:hover::before {
    width: 400%;
    height: 400%;
    top: -50%;
    left: -50%;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background: grey;
    cursor: not-allowed;
  }
`;

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onClick, children, disabled, type }) => (
  <Button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    {children}
  </Button>
);