import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, IconButton, Menu, MenuItem, ListItem, ListItemText, Container, TextField } from '@mui/material';
import { CreateNewFolder, Edit, InsertDriveFile, Add, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

interface File {
  id: string;
  name: string;
}

const FileCard = ({ file, onDelete }: { file: File; onDelete: (id: string) => void }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper
      sx={{ 
        p: 2, 
        borderRadius: 1, 
        bgcolor: "background.paper",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)"
        }
      }}
    >
      <ListItem>
        <InsertDriveFile />
        <ListItemText primary={file.name} />
        <IconButton onClick={() => onDelete(file.id)}>
          <Delete />
        </IconButton>
      </ListItem>
    </Paper>
  </Grid>
);

const ProjectPage = () => {
  const { projectId } = useParams();
  const [newFileName, setNewFileName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const fetchFiles = async () => {
    const response = await fetch(`/api/projects/${projectId}/files`);
    const data = await response.json();
    setFiles(data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const handleAddFile = async () => {
    await fetch(`/api/projects/${projectId}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newFileName,
      }),
    });
    fetchFiles();
  };

  const handleDeleteFile = async (fileId: string) => {
    await fetch(`/api/files/${fileId}`, {
      method: 'DELETE',
    });
    fetchFiles();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <Typography variant="h4">Файлы проекта {projectId}</Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Название файла"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          margin="normal"
        />
        <IconButton onClick={handleAddFile}>
          <Add />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {files.map((file) => (
          <FileCard key={file.id} file={file} onDelete={handleDeleteFile} />
        ))}
      </Grid>
      <IconButton onClick={handleMenuClick} color="primary">
        <Edit />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Редактор</MenuItem>
        <MenuItem onClick={handleMenuClose}>Создать файл</MenuItem>
      </Menu>
    </Container>
  );
};

export default ProjectPage;