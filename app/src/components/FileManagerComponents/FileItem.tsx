import React, { useState, MouseEvent } from "react";
import { Stack, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import {
  Delete as DeleteIcon,
  GetApp as GetAppIcon,
  Html as HtmlIcon,
  Javascript as JavascriptIcon,
  Css as CssIcon,
  Php as PhpIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  MusicNote as MusicIcon,
  Movie as MovieIcon,
  TextSnippet as TextIcon,
  Folder as FolderIcon // Добавляем иконку папки
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPython, faCuttlefish, faGolang } from "@fortawesome/free-brands-svg-icons";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";

interface IFile {
  id: number;
  name: string;
  filename: string;
  type: 'file' | 'folder';
  size?: number;
  children?: IFile[];
}

interface IFileItemProps {
  file: IFile;
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
  onDoubleClick: (id: number) => void;
}

const FileItem: React.FC<IFileItemProps> = ({ file, onDelete, onDownload, onDoubleClick }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getIcon = (filename: string, type: 'file' | 'folder') => {
    if (type === 'folder') return <FolderIcon />; // Возвращаем иконку папки для папок

    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case "html": return <HtmlIcon />;
      case "js": return <JavascriptIcon />;
      case "css": return <CssIcon />;
      case "php": return <PhpIcon />;
      case "txt": return <TextIcon />;
      case "pdf": return <PdfIcon />;
      case "jpg": case "jpeg": case "png": case "gif": return <ImageIcon />;
      case "mp3": case "wav": return <MusicIcon />;
      case "mp4": case "avi": return <MovieIcon />;
      case "doc": case "docx": case "xls": case "xlsx": case "ppt": case "pptx": return <DescriptionIcon />;
      case "py": return <FontAwesomeIcon icon={faPython} />;
      case "c": return <FontAwesomeIcon icon={faCuttlefish} />;
      case "cpp": return <FontAwesomeIcon icon={faFileCode} />;
      case "go": return <FontAwesomeIcon icon={faGolang} />;
      case "cs": return <FontAwesomeIcon icon={faFileCode} />;
      default: return <FileIcon />;
    }
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      onDoubleClick={() => onDoubleClick(file.id)} // Раскрываем папку при двойном клике
      onContextMenu={handleContextMenu}
      sx={{ padding: 1, borderBottom: "1px solid #ccc", cursor: 'pointer' }}
    >
      {getIcon(file.filename, file.type)}
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        {file.name}
      </Typography>
      {file.type === 'file' && showButtons && (
        <>
          <IconButton onClick={() => onDownload(file.id)} color="primary">
            <GetAppIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(file.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { onDownload(file.id); handleClose(); }}>Download</MenuItem>
        <MenuItem onClick={() => { onDelete(file.id); handleClose(); }}>Delete</MenuItem>
      </Menu>
    </Stack>
  );
};

export default FileItem;