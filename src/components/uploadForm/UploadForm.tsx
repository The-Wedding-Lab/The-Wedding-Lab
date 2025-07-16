"use client";

import React, { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { CloudUpload, Delete, AttachFile } from "@mui/icons-material";
import AppButton from "../ui/AppButton";

interface FileData {
  file: File;
  name: string;
  size: number;
  binaryData: ArrayBuffer;
  url: string; // data URL 추가
}

interface UploadFormProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesChange?: (filesData: FileData[]) => void;
  title?: string;
  description?: string;
}

const UploadForm: React.FC<UploadFormProps> = ({
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  onFilesChange,
  title = "파일을 선택해주세요",
  description = "업로드할 파일을 선택하세요",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const readFileAsBinary = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // 최대 파일 수 제한
    const totalFiles = uploadedFiles.length + files.length;
    if (totalFiles > maxFiles) {
      alert(`최대 ${maxFiles}개까지만 업로드 가능합니다.`);
      return;
    }

    try {
      // 파일들을 바이너리 데이터와 URL로 변환
      const filesWithData = await Promise.all(
        files.map(async (file) => {
          const [binaryData, url] = await Promise.all([
            readFileAsBinary(file),
            readFileAsDataURL(file),
          ]);
          return {
            file,
            name: file.name,
            size: file.size,
            binaryData,
            url,
          };
        })
      );

      const newFiles = [...uploadedFiles, ...filesWithData];
      setUploadedFiles(newFiles);
      onFilesChange?.(newFiles);
    } catch (error) {
      console.error("파일 읽기 실패:", error);
      alert("파일을 읽는데 실패했습니다.");
    }

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileRemove = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        p: 2,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* 업로드 영역 */}
      <Box
        onClick={handleFileSelect}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "200px",
          borderRadius: "16px",
          border: "2px dashed #2C83E9",
          backgroundColor: "rgba(44, 131, 233, 0.04)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:active": {
            backgroundColor: "rgba(44, 131, 233, 0.08)",
            transform: "scale(0.98)",
          },
          mb: 2,
        }}
      >
        <CloudUpload
          sx={{
            fontSize: 48,
            color: "#2C83E9",
            my: 1,
          }}
        />
        <Typography
          fontSize={18}
          fontWeight={600}
          color="#333"
          textAlign="center"
          mb={1}
        >
          {title}
        </Typography>
        <Typography fontSize={14} color="#666" textAlign="center" px={2}>
          {description}
        </Typography>
        <AppButton
          variant="contained"
          startIcon={<AttachFile />}
          sx={{
            width: "90%",
            my: 2,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleFileSelect();
          }}
        >
          파일 선택
        </AppButton>
      </Box>

      {/* 파일 리스트 */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography fontSize={16} fontWeight={600} mb={1} color="#333">
            선택된 파일 ({uploadedFiles.length}개)
          </Typography>
          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              p: 1,
            }}
          >
            {uploadedFiles.map((fileData, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1,
                  mb: 1,
                  backgroundColor: "white",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fileData.name}
                  </Typography>
                  <Typography fontSize={12} color="#666">
                    {formatFileSize(fileData.size)}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleFileRemove(index)}
                  sx={{ ml: 1 }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UploadForm;
