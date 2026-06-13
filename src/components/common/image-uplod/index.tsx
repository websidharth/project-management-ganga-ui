"use client";

import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CloudinaryUploaderProps {
  onUploadSuccess?: (result: CloudinaryUploadWidgetInfo) => void;
  onUploadError?: (error: any) => void;
}

export function CloudinaryUploader({
  onUploadSuccess,
  onUploadError,
}: CloudinaryUploaderProps) {
  const [resource, setResource] = useState<CloudinaryUploadWidgetInfo | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
       options={{
          sources: ["local", "camera"],
          multiple: false,
           showPoweredBy: false,
           showAdvancedOptions: false,
        }}

      onSuccess={(result, { widget }) => {
        if (typeof result?.info !== "string" && result?.info) {
          setResource(result?.info);
          onUploadSuccess?.(result?.info);
          console.log("Upload successful:", result?.info);
          widget.close();
        }
        setIsUploading(false);
      }}
      onError={(error, { widget }) => {
        console.error("Upload error:", error);
        onUploadError?.(error);
        setIsUploading(false);
      }}
      onQueuesStart={() => setIsUploading(true)}
      onClose={() => setIsUploading(false)}
    >
      {({ open }) => (
        <Button onClick={() => open()} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      )}
    </CldUploadWidget>
  );
}