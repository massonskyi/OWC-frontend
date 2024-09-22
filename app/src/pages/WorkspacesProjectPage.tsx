import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

interface Project {
  id: number;
  name: string;
  language: string;
  description: string;
}

const WorkspaceProjectsPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLanguage, setNewProjectLanguage] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/workspaces/${workspaceId}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [workspaceId]);

  const handleAddProject = async () => {
    if (newProjectName.trim() && newProjectLanguage.trim()) {
      try {
        const response = await axios.post(`/api/workspaces/${workspaceId}/projects`, {
          name: newProjectName,
          language: newProjectLanguage,
        });
        setProjects([...projects, response.data]);
        setNewProjectName('');
        setNewProjectLanguage('');
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}/projects/${projectId}`);
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Projects in Workspace {workspaceId}</Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Programming Language"
          value={newProjectLanguage}
          onChange={(e) => setNewProjectLanguage(e.target.value)}
          margin="normal"
        />
        <IconButton onClick={handleAddProject}>
          <Add />
        </IconButton>
      </Box>
      <List>
        {projects.map((project) => (
          <ListItem key={project.id}>
            <ListItemText primary={project.name} secondary={`${project.language} - ${project.description}`} />
            <IconButton component={Link} to={`/editor/${project.id}`}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteProject(project.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default WorkspaceProjectsPage;
