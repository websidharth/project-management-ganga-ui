
import { CloudinaryUploader } from "@/components/common/image-uplod";
import GalleryPage from "@/components/common/image-uplod/get-all-images";
import { MediaUploader } from "@/components/common/image-uplod/upload";

 
export default function UploadPage() {
 

  return (
    <div className="container mx-auto py-10">
      <MediaUploader/>
      <GalleryPage/>
     <CloudinaryUploader   />   
    </div>
  );
}