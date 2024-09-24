// src/pages/HomePage.tsx
import React from 'react';
import { Container } from '../components/Shared/Container';
import { UserTextEditor } from '../components/TextEditorComponents/UserTextEditor';

const UserWorkspacePage: React.FC = () => {
  return (
    <Container>
      <UserTextEditor />
    </Container>
  );
};

export default UserWorkspacePage;
