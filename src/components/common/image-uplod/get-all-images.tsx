"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Copy, ExternalLink, FileImage, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Assuming you're using sonner for toasts

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/images/get-all-images");
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (publicId: string) => {
    try {
      const response = await fetch("/api/images/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      const data = await response.json();

      if (data.success) {
        setImages((prev) => prev.filter((img) => img.public_id !== publicId));
        toast.success("Image deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting image");
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with count and actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
          <p className="text-sm text-muted-foreground">
            {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchImages}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Thumbnail</th>
                <th className="px-4 py-3 text-left font-medium">File Name</th>
                <th className="px-4 py-3 text-left font-medium">Image URL</th>
                <th className="px-4 py-3 text-center font-medium w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr
                  key={image.public_id}
                  className="border-b transition-colors hover:bg-muted/30 last:border-0 group"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded border bg-muted/20">
                      <img
                        src={image.secure_url}
                        alt={image.public_id}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  </td>

                  {/* File Name & Details */}
                  <td className="px-4 py-3">
                    <div className="max-w-[200px]">
                      <p className="truncate font-medium" title={image.public_id}>
                        {image.public_id}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {image.width && image.height && (
                          <span className="flex items-center gap-1">
                            <FileImage className="h-3 w-3" />
                            {image.width} × {image.height}
                          </span>
                        )}
                        {image.bytes && (
                          <span>{formatFileSize(image.bytes)}</span>
                        )}
                        {image.created_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(image.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Image URL */}
                  <td className="px-4 py-3">
                    <div
                      className="flex cursor-pointer items-center gap-2 rounded-md hover:bg-muted/50 p-1 transition-colors"
                      onClick={() => copyToClipboard(image.secure_url, image.public_id)}
                      title="Click to copy URL"
                    >
                      <code className="flex-1 truncate text-xs text-muted-foreground">
                        {truncateUrl(image.secure_url)}
                      </code>
                      <Copy
                        className={`h-4 w-4 flex-shrink-0 transition-all ${copiedId === image.public_id
                          ? 'text-green-500'
                          : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                          }`}
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href={image.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => deleteImage(image.public_id)}
                        className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted/20 p-4">
              <FileImage className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No images uploaded</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your first image to get started
            </p>
            <Button className="mt-4">
              Upload Image
            </Button>
          </div>
        )}
      </div>

      {/* Footer with pagination info (optional) */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {images.length} {images.length === 1 ? 'image' : 'images'}</p>
        </div>
      )}
    </div>
  );
}
