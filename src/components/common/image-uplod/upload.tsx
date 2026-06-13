"use client";

import { useState, useCallback } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Image, Video, File } from "lucide-react";

interface UploadedFile {
  id: string;
  publicId: string;
  secureUrl: string;
  format: string;
  resourceType: "image" | "video" | "raw";
  bytes: number;
  createdAt: Date;
}

interface MediaUploaderProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedFormats?: string[];
}

export function MediaUploader({
  onFilesUploaded,
  maxFiles = 10,
  acceptedFormats = ["image/*", "video/*", "application/pdf"],
}: MediaUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = useCallback(
    (result: any, { widget }: any) => {
      if (typeof result?.info !== "string") {
        const newFile: UploadedFile = {
          id: crypto.randomUUID(),
          publicId: result.info.public_id,
          secureUrl: result.info.secure_url,
          format: result.info.format,
          resourceType: result.info.resource_type,
          bytes: result.info.bytes,
          createdAt: new Date(),
        };

        setUploadedFiles((prev) => {
          const updated = [...prev, newFile];
          onFilesUploaded?.(updated);
          return updated;
        });
      }
      widget.close();
    },
    [onFilesUploaded]
  );

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      onFilesUploaded?.(updated);
      return updated;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (resourceType: string, format: string) => {
    if (resourceType === "image") return <Image className="h-5 w-5" />;
    if (resourceType === "video") return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CldUploadWidget
         
        options={{
          sources: ["local", "camera"],
          multiple: false,
           showPoweredBy: false,
           showAdvancedOptions: false,
        }}

          uploadPreset="assets"  // ← use this instead

         
          // options={{
          //   maxFiles,
          //   clientAllowedFormats: acceptedFormats.map((f) => f.replace("/*", "")),
          //   multiple: true,
          //   showAdvancedOptions: true,
          //   showPoweredBy: false,
          // }}
          onSuccess={handleUploadSuccess}
          onError={(error) => console.error("Upload error:", error)}
          onQueuesStart={() => setIsUploading(true)}
          onQueuesEnd={() => setIsUploading(false)}
        >
          {({ open }) => (
            <Button onClick={() => open()} disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </>
              )}
            </Button>
          )}
        </CldUploadWidget>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getFileIcon(file.resourceType, file.format)}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.publicId}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.format.toUpperCase()} • {formatFileSize(file.bytes)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Files are securely stored in Cloudinary. URLs are permanent.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}