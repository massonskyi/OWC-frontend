import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, IconButton, Menu, MenuItem, ListItem, ListItemText, Container, TextField } from '@mui/material';
import { CreateNewFolder, Edit, InsertDriveFile, Add, Delete } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { createProject, getProjects, deleteProject } from '../api'; // Импортируем функции API

interface Project {
  id: number;
  name: string;
  language: string;
}

const ProjectCard = ({ project, onDelete }: { project: Project; onDelete: (id: number) => void }) => {
  const { workspaceName } = useParams<{ workspaceName: string }>();

  return (
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
          <ListItemText primary={project.name} secondary={project.language} />
          <IconButton component={Link} to={`/workspaces/${workspaceName}/${project.id}`}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => onDelete(project.id)}>
            <Delete />
          </IconButton>
        </ListItem>
      </Paper>
    </Grid>
  );
};

const WorkspaceProjectsPage = () => {
  const { workspaceName } = useParams<{ workspaceName: string }>();
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLanguage, setNewProjectLanguage] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const fetchProjects = async () => {
    try {
      if (workspaceName) {
        const data = await getProjects(workspaceName);
        setProjects(data);
      } else {
        console.error('Workspace name is undefined');
      }
    } catch (error) {
      console.error('Fetch Projects Error:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [workspaceName]);

  const handleAddProject = async () => {
    try {
      if (workspaceName) {
        await createProject(workspaceName, {
          name: newProjectName,
          language: newProjectLanguage,
          description: '',
          is_active: false
        });
        fetchProjects();
      } else {
        console.error('Workspace name is undefined');
      }
    } catch (error) {
      console.error('Add Project Error:', error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      if (workspaceName) {
        await deleteProject(workspaceName, projectId);
        fetchProjects();
      } else {
        console.error('Workspace name is undefined');
      }
    } catch (error) {
      console.error('Delete Project Error:', error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <Typography variant="h4">Проекты в Воркспейсе {workspaceName}</Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Название проекта"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Язык программирования"
          value={newProjectLanguage}
          onChange={(e) => setNewProjectLanguage(e.target.value)}
          margin="normal"
        />
        <IconButton onClick={handleAddProject}>
          <Add />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
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

export default WorkspaceProjectsPage;