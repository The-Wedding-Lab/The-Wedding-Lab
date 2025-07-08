"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete, AttachFile } from "@mui/icons-material";
import AppButton from "../ui/AppButton";

interface UploadFormProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  title?: string;
  description?: string;
  uploadButtonText?: string;
}

const UploadForm: React.FC<UploadFormProps> = ({
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  onFilesChange,
  onUpload,
  title = "파일을 선택해주세요",
  description = "업로드할 파일을 선택하세요",
  uploadButtonText = "업로드",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // 최대 파일 수 제한
    const totalFiles = uploadedFiles.length + files.length;
    if (totalFiles > maxFiles) {
      alert(`최대 ${maxFiles}개까지만 업로드 가능합니다.`);
      return;
    }

    const newFiles = [...uploadedFiles, ...files];
    setUploadedFiles(newFiles);
    onFilesChange?.(newFiles);

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

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || !onUpload) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 프로그레스 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      await onUpload(uploadedFiles);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // 업로드 완료 후 파일 리스트 초기화
      setTimeout(() => {
        setUploadedFiles([]);
        onFilesChange?.([]);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("업로드 실패:", error);
      setIsUploading(false);
      setUploadProgress(0);
      alert("업로드에 실패했습니다.");
    }
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
            {uploadedFiles.map((file, index) => (
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
                    {file.name}
                  </Typography>
                  <Typography fontSize={12} color="#666">
                    {formatFileSize(file.size)}
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

      {/* 업로드 버튼 & 프로그레스 */}
      {uploadedFiles.length > 0 && (
        <Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={isUploading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "16px",
              py: 1.5,
            }}
          >
            {isUploading ? "업로드 중..." : uploadButtonText}
          </Button>

          {isUploading && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={12}
                  >
                    {`${Math.round(uploadProgress)}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                display="block"
                fontSize={12}
              >
                파일을 업로드하는 중입니다...
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UploadForm;
