import React from "react";

type UploadContextType = {
    uploading: boolean;
    setUploading: React.Dispatch<React.SetStateAction<boolean>>;
} | null;

export const UploadContext = React.createContext<UploadContextType>(null);
