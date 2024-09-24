import React, { ChangeEvent, FC, useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";

interface IUploadButtonProps {
  onUpload: (file: File, fileContents: string) => void;
  onCodeLoader: (fileContents: string) => void;
}

const UploadButton: FC<IUploadButtonProps> = ({ onUpload, onCodeLoader }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files![0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const fileContents = event.target!.result as string;
      onUpload(file, fileContents);
      onCodeLoader(fileContents);
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        id="file-input"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      <label htmlFor="file-input">
        <IconButton component="span" color="primary">
          {isLoading ? <CircularProgress size={24} /> : <UploadIcon />}
        </IconButton>
      </label>
    </>
  );
};

export default UploadButton;