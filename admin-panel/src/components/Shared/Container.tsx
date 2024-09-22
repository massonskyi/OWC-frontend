// Container Component
import { motion } from 'framer-motion';
import styled from '@emotion/styled'

export const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(circle, #1e1e1e, #434343);
  overflow: hidden;
`;
