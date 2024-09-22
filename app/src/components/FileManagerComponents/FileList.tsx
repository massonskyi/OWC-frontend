import React from "react";
import FileItem from "./FileItem";
interface IFileListProps {
    files: {
      id: number;
      name: string;
      filename: string;
      [key: string]: any;
    }[];
    onDelete: (file: any) => void;
    onDownload: (file: any) => void;
    onDoubleClick: (file: any) => void;
  }
const FileList: React.FC<IFileListProps> = ({ files, onDelete, onDownload, onDoubleClick }) => {
  return (
    <div className="file-list">
      {files.map((file) => (
        <FileItem
          key={file.id} // Unique key prop set to file.id
          file={file}
          onDelete={onDelete}
          onDownload={onDownload}
          onDoubleClick={onDoubleClick} // Pass to FileItem
        />
      ))}
    </div>
  );
};

export default FileList;