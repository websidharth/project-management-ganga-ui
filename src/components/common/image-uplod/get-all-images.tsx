"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/images/get-all-images");
      const data = await response.json();

      setImages(data.images);
    };

    fetchImages();
  }, []);


  
  const deleteImage = async (
  publicId: string
) => {
  try {
    const response = await fetch(
      "/api/images/delete-image",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setImages((prev) =>
        prev.filter(
          (img) =>
            img.public_id !== publicId
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
   <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {images.map((image) => (
    <div
      key={image.public_id}
      className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={image.secure_url}
          alt={image.public_id}
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute right-3 top-3 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() =>
                navigator.clipboard.writeText(
                  image.secure_url
                )
              }
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={() => deleteImage(image.public_id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 left-3 flex gap-2">
            <a
              href={image.secure_url}
              target="_blank"
            >
              <Button size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </a>

            <a
              href={image.secure_url}
              download
            >
              <Button size="sm" variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="truncate font-medium">
          {image.public_id}
        </h3>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {image.width} × {image.height}
          </span>

          <span>
            {new Date(
              image.created_at
            ).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  ))}
</div>
  );
}