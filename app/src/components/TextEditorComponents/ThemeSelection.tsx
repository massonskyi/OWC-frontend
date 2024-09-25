import React from 'react';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface ThemeSelectionProps {
    themeList: { name: string }[];
    handleThemeChange: (event: SelectChangeEvent<string>) => void;
}

const ThemeSelection: React.FC<ThemeSelectionProps> = ({ themeList, handleThemeChange }) => {
    return (
        <FormControl fullWidth sx={{ width: '300px' }}> {/* Установите желаемую ширину */}
            <Select
                id="theme"
                className="theme-select"
                defaultValue={themeList[0]?.name || ''}
                onChange={handleThemeChange}
                sx={{
                    color: "#FB1FD3FF",
                    background: (theme) => (theme.palette.mode === 'dark' ? '#333333' : '#ffffff'),
                    '& .MuiSelect-icon': {
                        color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#333333')
                    },
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    '&:hover': {
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#444444' : '#f0f0f0')
                    }
                }}
            >
                {themeList.map((theme) => (
                    <MenuItem key={theme.name} value={theme.name}>
                        {theme.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ThemeSelection;