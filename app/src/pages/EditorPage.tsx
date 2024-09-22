// src/pages/HomePage.tsx
import React from 'react';
import { Container } from '../components/Shared/Container';
import { TextEditor } from '../components/TextEditorComponents/TextEditor';

const EditorPage: React.FC = () => {
  return (
    <Container>
      <TextEditor />
    </Container>
  );
};

export default EditorPage;
