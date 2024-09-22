import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Workspace, createWorkspace, deleteWorkspace } from '../api'; // Импортируем API-запросы

interface UserProfileProps {
    user: {
        name: string;
        surname: string;
        email: string;
        phone: string;
        age: number;
        username: string;
        avatar: string;
        hash_password: string;
    };
    workspaces: Workspace[];
    onAddWorkspace: (workspace: Workspace) => void;
    onDeleteWorkspace: (workspaceId: number) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, workspaces, onAddWorkspace, onDeleteWorkspace }) => {
    const [value, setValue] = useState(0);
    const [formData, setFormData] = useState({ ...user });
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log('Сохранено:', formData);
    };

    const handleAddWorkspace = async () => {
        if (newWorkspaceName.trim()) {
            try {
                const newWorkspace = await createWorkspace({
                    name: newWorkspaceName,
                    description: '', // Можно добавить поле для описания
                });
                onAddWorkspace(newWorkspace);
                setNewWorkspaceName('');
            } catch (error) {
                console.error('Error adding workspace:', error);
            }
        }
    };

    const handleDeleteWorkspace = async (workspaceId: number) => {
        try {
            await deleteWorkspace(workspaceId);
            onDeleteWorkspace(workspaceId);
        } catch (error) {
            console.error('Error deleting workspace:', error);
        }
    };

    return (
        <Container>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Профиль" />
                    <Tab label="Настройки" />
                    <Tab label="Воркспейсы" />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={formData.avatar} alt="Аватар" sx={{ width: 56, height: 56 }} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        {formData.name} {formData.surname}
                    </Typography>
                </Box>
                <TextField
                    label="Имя"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Фамилия"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Возраст"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleSave}>
                    Сохранить
                </Button>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Typography variant="h6">Настройки</Typography>
                <TextField
                    label="Имя пользователя"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Пароль"
                    type="password"
                    name="hash_password"
                    value={formData.hash_password}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleSave}>
                    Сохранить настройки
                </Button>
            </TabPanel>

            <TabPanel value={value} index={2}>
                <Typography variant="h6">Мои Воркспейсы</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                    <TextField
                        label="Название воркспейса"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        fullWidth
                    />
                    <IconButton onClick={handleAddWorkspace}>
                        <Add />
                    </IconButton>
                </Box>
                <List>
                    {workspaces.map((workspace) => (
                        <ListItem key={workspace.id}>
                            <ListItemText 
                                primary={workspace.name} 
                                secondary={workspace.description} 
                            />
                            <IconButton onClick={() => handleDeleteWorkspace(workspace.id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </TabPanel>
        </Container>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

export default UserProfile;
