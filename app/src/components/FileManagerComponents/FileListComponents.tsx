import React, { useEffect, useState } from "react";
import FileItem from "./FileItem";
import { Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Button, Snackbar, Alert } from "@mui/material";
import { getWorkspaceByName, createFile, createFolder, deleteItem, renameItem, editFile, openFile, copyItem } from "../../api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../../styles/FileListComponent.css"; // Добавьте CSS файл для анимаций

interface IFile {
  id: string;
  name: string;
  filename: string;
  type: 'file' | 'folder';
  size?: number;
  children?: IFile[];
  contents?: string;
}

interface IFileListComponentProps {
  onCodeLoaded: (code: string, filename: string) => void;
  workspaceName: string;
}

const FileListComponent: React.FC<IFileListComponentProps> = ({ onCodeLoaded, workspaceName }) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newFileName, setNewFileName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; fileId: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const workspace = await getWorkspaceByName(workspaceName);
        const data = workspace.files;

        const transformFiles = (files: any[], parentId: string = ''): IFile[] => {
          return files.map((file: any, index: number) => ({
            id: `${parentId}-${file.name}`,
            name: file.name,
            filename: file.filename || file.name,
            type: file.type,
            size: file.size,
            children: file.children ? transformFiles(file.children, `${parentId}-${file.name}`) : [],
          }));
        };

        const fetchedFiles = transformFiles(data || []);
        setFiles(fetchedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Ошибка при загрузке файлов.");
      }
    };

    fetchFiles();
  }, [workspaceName]);

  const findFileById = (files: IFile[], id: string, parentPath: string = ''): { file?: IFile, path: string } => {
    for (const file of files) {
      const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
      if (file.id === id) return { file, path: currentPath };
      if (file.children) {
        const found = findFileById(file.children, id, currentPath);
        if (found.file) return found;
      }
    }
    return { path: '' };
  };

  const handleDoubleClick = async (fileId: string) => {
    const { file: selectedFile, path: filePath } = findFileById(files, fileId);
    if (selectedFile) {
      if (selectedFile.type === 'folder') {
        setExpandedFolders((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(fileId)) {
            newSet.delete(fileId);
          } else {
            newSet.add(fileId);
          }
          return newSet;
        });
      } else {
        try {
          const fileContents = await openFile(workspaceName, filePath);
          onCodeLoaded(fileContents, selectedFile.name);
        } catch (error) {
          console.error("Error opening file:", error);
          setError("Ошибка при открытии файла.");
        }
      }
    }
  };

  const handleDelete = async (fileId: string) => {
    const { file: fileToDelete, path: filePath } = findFileById(files, fileId);
    if (fileToDelete) {
      try {
        await deleteItem(workspaceName, filePath);
        const updatedFiles = removeFileById(files, fileId);
        setFiles(updatedFiles);
      } catch (error) {
        console.error("Error deleting file:", error);
        setError("Ошибка при удалении файла.");
      }
    }
  };

  const removeFileById = (files: IFile[], id: string): IFile[] => {
    return files.reduce((acc: IFile[], file) => {
      if (file.id === id) return acc;
      if (file.children) {
        file.children = removeFileById(file.children, id);
      }
      acc.push(file);
      return acc;
    }, []);
  };

  const handleDownload = async (fileId: string) => {
    const { file: selectedFile, path: filePath } = findFileById(files, fileId);
    if (selectedFile) {
      try {
        const fileContents = await openFile(workspaceName, filePath);
        const blob = new Blob([fileContents], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
        setError("Ошибка при скачивании файла.");
      }
    }
  };

  const handleOpen = async (fileId: string) => {
    const { file: selectedFile, path: filePath } = findFileById(files, fileId);
    if (selectedFile) {
      try {
        const fileContents = await openFile(workspaceName, filePath);
        onCodeLoaded(fileContents, selectedFile.name);
      } catch (error) {
        console.error("Error opening file:", error);
        setError("Ошибка при открытии файла.");
      }
    }
  };

  const handleSave = async (fileId: string, newContents: string) => {
    const { file: selectedFile, path: filePath } = findFileById(files, fileId);
    if (selectedFile) {
      try {
        await editFile(workspaceName, filePath, newContents);
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, contents: newContents } : file
          )
        );
      } catch (error) {
        console.error("Error saving file:", error);
        setError("Ошибка при сохранении файла.");
      }
    }
  };

  const handleCreateNewFile = async () => {
    if (newFileName.trim()) {
      try {
        await createFile(workspaceName, newFileName);
        const newFile: IFile = {
          id: `${newFileName}-${Date.now()}`,
          name: newFileName,
          filename: newFileName,
          type: 'file',
          contents: '',
        };
        setFiles((prevFiles) => [...prevFiles, newFile]);
        setNewFileName("");
        setOpenDialog(false);
        onCodeLoaded('', newFileName);
      } catch (error) {
        console.error("Error creating new file:", error);
        setError("Ошибка при создании нового файла.");
      }
    }
  };

  const handleCreateNewFolder = async () => {
    if (newFileName.trim()) {
      try {
        await createFolder(workspaceName, newFileName);
        const newFolder: IFile = {
          id: `${newFileName}-${Date.now()}`,
          name: newFileName,
          filename: newFileName,
          type: 'folder',
          children: [],
        };
        setFiles((prevFiles) => [...prevFiles, newFolder]);
        setNewFileName("");
        setOpenDialog(false);
      } catch (error) {
        console.error("Error creating new folder:", error);
        setError("Ошибка при создании новой папки.");
      }
    }
  };

  const handleContextMenu = (event: React.MouseEvent, fileId: string | null) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      fileId: fileId,
    });
  };
  const handleCopy = async (fileId: string, destinationPath: string) => {
    const { file: selectedFile, path: filePath } = findFileById(files, fileId);
    if (selectedFile) {
      try {
        await copyItem(workspaceName, filePath, destinationPath);
        const newFile: IFile = { ...selectedFile, id: `${destinationPath}-${selectedFile.name}`, name: selectedFile.name };
        setFiles((prevFiles) => [...prevFiles, newFile]);
      } catch (error) {
        console.error("Error copying file:", error);
        setError("Ошибка при копировании файла.");
      }
    }
  };
  const handleRename = async (fileId: string, newName: string) => {
    const { file: selectedFile, path: filePath } = findFileById(files, fileId);
    if (selectedFile) {
      try {
        await renameItem(workspaceName, filePath, newName);
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, name: newName, filename: newName } : file
          )
        );
      } catch (error) {
        console.error("Error renaming file:", error);
        setError("Ошибка при переименовании файла.");
      }
    }
  };
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const renderFiles = (files: IFile[], parentId?: string) => {
    return files.map((file) => (
      <React.Fragment key={file.id}>
        <FileItem
          file={file}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
        />
        {file.type === 'folder' && expandedFolders.has(file.id) && file.children && (
          <CSSTransition
            key={file.id}
            timeout={300}
            classNames="folder"
          >
            <Box sx={{ pl: 4 }}>
              {renderFiles(file.children, file.id)}
            </Box>
          </CSSTransition>
        )}
      </React.Fragment>
    ));
  };

  return (
    <Box sx={{ padding: 2, height: '100%', width: '100%', position: 'relative' }} onContextMenu={(e) => handleContextMenu(e, null)}>
  <TransitionGroup>
        {renderFiles(files)}
      </TransitionGroup>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Создать новый файл</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Имя файла"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleCreateNewFile} color="primary">
            Создать
          </Button>
        </DialogActions>
        
      </Dialog>
      {/* <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Создать новый файл</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Имя файла"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleCreateNewFile} color="primary">
            Создать
          </Button>
        </DialogActions>
        
      </Dialog> */}
      <Menu
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => handleOpen(contextMenu?.fileId || '')}>Открыть</MenuItem>
          <MenuItem onClick={() => handleSave(contextMenu?.fileId || '', files.find(file => file.id === contextMenu?.fileId)?.contents || '')}>Сохранить</MenuItem>
          <MenuItem onClick={() => handleCreateNewFolder()}>Создать папку</MenuItem>
          <MenuItem onClick={() => contextMenu && handleRename(contextMenu.fileId!, prompt('Введите новое имя') || '')}>Редактировать</MenuItem>
          <MenuItem onClick={() => contextMenu && handleCopy(contextMenu.fileId!, prompt('Введите путь назначения') || '')}>Копировать</MenuItem>
          <MenuItem onClick={() => contextMenu && handleDelete(contextMenu.fileId!)}>Удалить</MenuItem>
          <MenuItem onClick={() => setOpenDialog(true)}>Создать файл</MenuItem>
        </Menu>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileListComponent;