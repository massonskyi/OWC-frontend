import React, { useEffect, useState } from "react";
import FileItem from "./FileItem";
import { Box, Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { getWorkspaceByName, createFile, createFolder, copyItem, deleteItem, renameItem, editFile, openFile } from "../../api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../../styles/FileListComponent.css"; // Добавьте CSS файл для анимаций

interface IFile {
  id: number;
  name: string;
  filename: string;
  type: 'file' | 'folder';
  size?: number;
  children?: IFile[];
  contents?: string;
}

interface IFileListComponentProps {
  onCodeLoaded: (code: string) => void;
  workspaceName: string;
}

const FileListComponent: React.FC<IFileListComponentProps> = ({ onCodeLoaded, workspaceName }) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [newFileName, setNewFileName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const workspace = await getWorkspaceByName(workspaceName);
        const data = workspace.files;

        const transformFiles = (files: any[]): IFile[] => {
          return files.map((file: any, index: number) => ({
            id: index,
            name: file.name,
            filename: file.filename || file.name,
            type: file.type,
            size: file.size,
            children: file.children ? transformFiles(file.children) : [],
          }));
        };

        const fetchedFiles = transformFiles(data);
        setFiles(fetchedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [workspaceName]);

  const handleUpload = async (file: File, fileContents: string) => {
    try {
      await createFile(workspaceName, file.name);
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const newFile: IFile = {
        id: files.length + 1,
        name: file.name,
        filename: fileExtension,
        type: 'file',
        contents: fileContents,
      };
      setFiles((prevFiles) => [...prevFiles, newFile]);
      onCodeLoaded(fileContents); // Вызов onCodeLoaded при загрузке файла
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDoubleClick = async (fileId: number) => {
    const selectedFile = files.find((file) => file.id === fileId);
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
          const fileContents = await openFile(workspaceName, selectedFile.name);
          onCodeLoaded(fileContents); // Вызов onCodeLoaded при двойном клике на файл
        } catch (error) {
          console.error("Error opening file:", error);
        }
      }
    }
  };

  const handleDelete = async (fileId: number) => {
    const fileToDelete = files.find((file) => file.id === fileId);
    if (fileToDelete) {
      try {
        await deleteItem(workspaceName, fileToDelete.name);
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const handleDownload = (fileId: number) => {
    const selectedFile = files.find((file) => file.id === fileId);
    if (selectedFile) {
      const element = document.createElement("a");
      const file = new Blob([selectedFile.contents || ""], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = selectedFile.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleOpen = async (fileId: number) => {
    const selectedFile = files.find((file) => file.id === fileId);
    if (selectedFile) {
      try {
        const fileContents = await openFile(workspaceName, selectedFile.name);
        onCodeLoaded(fileContents);
      } catch (error) {
        console.error("Error opening file:", error);
      }
    }
  };

  const handleSave = async (fileId: number, newContents: string) => {
    const selectedFile = files.find((file) => file.id === fileId);
    if (selectedFile) {
      try {
        await editFile(workspaceName, selectedFile.name, newContents);
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, contents: newContents } : file
          )
        );
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  };

  const handleCreateNewFile = async () => {
    if (newFileName.trim()) {
      try {
        await createFile(workspaceName, newFileName);
        const newFile: IFile = {
          id: files.length + 1,
          name: newFileName,
          filename: newFileName,
          type: 'file',
          contents: '',
        };
        setFiles((prevFiles) => [...prevFiles, newFile]);
        setNewFileName("");
        setOpenDialog(false);
        onCodeLoaded(''); // Вызов onCodeLoaded при создании нового файла
      } catch (error) {
        console.error("Error creating new file:", error);
      }
    }
  };

  const renderFiles = (files: IFile[], parentId?: number) => {
    return files.map((file) => (
      <React.Fragment key={file.id}>
        <FileItem
          file={file}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onDoubleClick={handleDoubleClick}
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
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <Button variant="contained" onClick={() => handleOpen(files[0]?.id)}>Открыть</Button>
        <Button variant="contained" onClick={() => handleSave(files[0]?.id, files[0]?.contents || '')}>Сохранить</Button>
        <Button variant="contained" onClick={() => document.getElementById('upload-button')?.click()}>Загрузить</Button>
        <Button variant="contained" color="error" onClick={() => handleDelete(files[0]?.id)}>Удалить</Button>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>Создать файл</Button>
      </Stack>
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
    </Box>
  );
};

export default FileListComponent;