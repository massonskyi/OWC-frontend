import React from "react";
import FileItem from "./FileItem";
import { Stack } from "@mui/material";

interface IFile {
  id: number;
  name: string;
  filename: string; // Add filename property
  type: 'file' | 'folder'; // Add type property
  size?: number; // Optional size for files
  children?: IFile[]; // Children for folders
}
interface IFileListProps {
  files: IFile[];
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
  onDoubleClick: (id: number) => void;
}

const FileList: React.FC<IFileListProps> = ({ files, onDelete, onDownload, onDoubleClick }) => {
  return (
    <Stack spacing={1}>
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onDelete={onDelete}
          onDownload={onDownload}
          onDoubleClick={onDoubleClick}
        />
      ))}
    </Stack>
  );
};

export default FileList;