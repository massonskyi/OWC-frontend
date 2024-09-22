import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { getUserById, createUser, updateUser } from '../api';

interface User {
    name: string;
    surname: string;
    email: string;
    phone: string;
    username: string;
    hash_password: string;
    avatar?: string;
}

const UserForm: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({
        name: '',
        surname: '',
        email: '',
        phone: '',
        username: '',
        hash_password: '',
        avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    });

    useEffect(() => {
        if (id) {
            getUserById(id)
                .then((response: any) => {
                    // Explicitly typing response
                    const userData: User = response.data;
                    setUser(userData);
                })
                .catch((error: any) => console.error(error)); // Explicitly typing error
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const apiCall = id ? updateUser(id, user) : createUser(user);
        apiCall
            .then(() => navigate('/'))
            .catch((error: any) => console.error(error));
    };

    return (
        <Paper style={{ padding: 16 }}>
            <Typography variant="h6">{id ? 'Edit User' : 'Create User'}</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Surname"
                    name="surname"
                    value={user.surname}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    name="hash_password"
                    type="password"
                    value={user.hash_password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Avatar URL"
                    name="avatar"
                    value={user.avatar || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" color="primary" variant="contained">
                    {id ? 'Update' : 'Create'}
                </Button>
            </form>
        </Paper>
    );
};

export default UserForm;