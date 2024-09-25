import React from "react";
import FileItem from "./FileItem";
import { Stack } from "@mui/material";

interface IFile {

  id: string;

  name: string;

  filename: string;

  type: 'file' | 'folder';

  size?: number;

  children?: IFile[];

  contents?: string;

}
interface IFileListProps {
  files: IFile[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onDoubleClick: (id: string) => void;
  onContextMenu: (event: React.MouseEvent, id: string) => void; // Add onContextMenu property
}

const FileList: React.FC<IFileListProps> = ({ files, onDelete, onDownload, onDoubleClick, onContextMenu }) => {
  return (
    <Stack spacing={1}>
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onDelete={onDelete}
          onDownload={onDownload}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu} // Pass onContextMenu to FileItem
        />
      ))}
    </Stack>
  );
};

export default FileList;