import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Импортируем контекст аутентификации
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";
import { createWorkspace, getWorkspaces, Workspace,deleteWorkspace } from "../api"; // Импортируем API-запросы
import Loader from "../components/Loader";
interface UserProfileProps {
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    username: string;
    avatar: string;
    hash_password: string;
  } | null; // Изменено: user может быть null
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const {
    currentUserId,
    workspaces = [],
    fetchUserWorkspaces,
    addWorkspace,
    deleteWorkspaceFromStorage,
  } = useAuth();
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState(user ? { ...user } : null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");
  const [newWorkspaceIsActive, setNewWorkspaceIsActive] = useState(true);
  const [newWorkspaceIsPublic, setNewWorkspaceIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Состояние для отслеживания загрузки
  const [serverWorkspaces, setServerWorkspaces] = useState<Workspace[]>([]); // Состояние для воркспейсов с сервера
  
  const isCurrentUser = user && user.id === currentUserId;

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
      if (isCurrentUser) {
        fetchUserWorkspaces();
      }
      setIsLoading(false); // Устанавливаем isLoading в false после загрузки данных
    }
  }, [user, isCurrentUser, fetchUserWorkspaces]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const workspaces = await getWorkspaces();
        console.log(workspaces)
        setServerWorkspaces(workspaces);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
  
    fetchWorkspaces();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = () => {
    console.log("Сохранено:", formData);
  };

  const handleAddWorkspace = async () => {
    if (newWorkspaceName.trim()) {
      try {
        const workspaceData = {
          name: newWorkspaceName,
          description: newWorkspaceDescription,
          is_active: newWorkspaceIsActive,
          is_public: newWorkspaceIsPublic,
        };

        const newWorkspace = await createWorkspace(workspaceData);

        addWorkspace({
          name: newWorkspace.name,
          description: newWorkspace.description,
          is_public: newWorkspace.is_public,
          is_active: newWorkspace.is_active,
        });

        setNewWorkspaceName("");
      } catch (error) {
        console.error("Error adding workspace:", error);
      }
    }
  };

  const handleDeleteWorkspace = async (workspaceName: string) => {
    try {
      await deleteWorkspace(workspaceName);
      deleteWorkspaceFromStorage(workspaceName);
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  if (isLoading) {
    return <Loader />; // Отображаем Loader, пока данные загружаются
  }

  if (!user) {
    return <Typography variant="h6">Пользователь не найден</Typography>;
  }

  return (
    <Container>
      <AppBar position="static" sx={{ borderRadius: 1, mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Профиль" />
          <Tab label="Настройки" />
          <Tab label="Воркспейсы" />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={formData?.avatar}
              alt={formData?.username || ""}
              sx={{ width: 56, height: 56 }}
            />
            <Typography variant="h6" sx={{ ml: 2 }}>
              {formData?.name} {formData?.surname}
            </Typography>
          </Box>
          <TextField
            label="Имя"
            name="name"
            value={formData?.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isCurrentUser}
          />
          <TextField
            label="Фамилия"
            name="surname"
            value={formData?.surname || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isCurrentUser}
          />
          <TextField
            label="Email"
            name="email"
            value={formData?.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isCurrentUser}
          />
          <TextField
            label="Телефон"
            name="phone"
            value={formData?.phone || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isCurrentUser}
          />
          <TextField
            label="Возраст"
            type="number"
            name="age"
            value={formData?.age || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isCurrentUser}
          />
          {isCurrentUser && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              Сохранить
            </Button>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Настройки
          </Typography>
          <TextField
            label="Имя пользователя"
            name="username"
            value={formData?.username || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isCurrentUser}
          />
          <TextField
            label="Пароль"
            type="password"
            name="hash_password"
            value={formData?.hash_password || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isCurrentUser}
          />
          {isCurrentUser && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              Сохранить настройки
            </Button>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Мои Воркспейсы
          </Typography>
          {isCurrentUser && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
            >
              <TextField
                label="Название воркспейса"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <TextField
                label="Описание воркспейса"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <Box display="flex" justifyContent="space-between" width="100%">
                <FormControlLabel
                  control={
                    <Switch
                      checked={newWorkspaceIsActive}
                      onChange={(e) =>
                        setNewWorkspaceIsActive(e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Активный"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newWorkspaceIsPublic}
                      onChange={(e) =>
                        setNewWorkspaceIsPublic(e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Публичный"
                />
                <IconButton onClick={handleAddWorkspace} color="primary">
                  <Add />
                </IconButton>
              </Box>
            </Box>
          )}
          <Grid container spacing={2}>
            {serverWorkspaces.map((workspace) => (
              <Grid item xs={12} sm={6} md={4} key={workspace.name}>
                  <Link to={`/workspaces/${workspace.name}/editor`} style={{ textDecoration: 'none' }}>
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
                        <ListItemText
                          primary={workspace.name}
                          secondary={workspace.description}
                        />
                        {isCurrentUser && (
                          <IconButton
                            onClick={() => handleDeleteWorkspace(workspace.name)}
                            color="secondary"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </ListItem>
                    </Paper>
                  </Link>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </TabPanel>
    </Container>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default UserProfile;