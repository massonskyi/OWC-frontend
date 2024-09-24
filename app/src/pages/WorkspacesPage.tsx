import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Grid,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // Импортируем компонент Loader
import { getWorkspaces, Workspace } from "../api";

interface Project {
  id: number;
  name: string;
  language: string; // Язык программирования
}

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  username: string;
  avatar: string;
  hash_password: string;
}

interface WorkspacesPageProps {
  user: User;
}

const WorkspacesPage: React.FC<WorkspacesPageProps> = ({ user }) => {
  const { workspaceName } = useParams<{ workspaceName: string }>();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLanguage, setNewProjectLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Состояние для отслеживания загрузки

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const workspaces = await getWorkspaces();
        console.log('Fetched workspaces:', workspaces);
        setWorkspaces(workspaces);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
  
    const fetchData = async () => {
      await fetchWorkspaces();
      setTimeout(() => {
        setIsLoading(false); // Устанавливаем isLoading в false после задержки
      }, 1500); // Задержка в 1500 миллисекунд
    };

    fetchData();
    console.log('Fetching projects for workspace:', workspaceName);
  }, [workspaceName, user.id]);

  if (isLoading) {
    return <Loader />; // Отображаем Loader, пока данные загружаются
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Workspaces</Typography>
      <Typography variant="h6" gutterBottom>Welcome, {user.username}</Typography>
      <Grid container spacing={3}>
        {workspaces.map((workspace) => (
          <Grid item xs={12} sm={6} md={4} key={workspace.name}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {workspace.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {workspace.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/workspaces/${workspace.name}/editor`)}>View Projects</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {workspaceName && (
        <>
          <Typography variant="h5" gutterBottom>Projects in Workspace {workspaceName}</Typography>
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
          </Box>
        </>
      )}
    </Container>
  );
};

export default WorkspacesPage;