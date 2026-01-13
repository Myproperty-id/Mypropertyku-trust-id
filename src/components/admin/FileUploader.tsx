import { useState, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  bucket: "property-images" | "legal-documents";
  userId: string;
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

const FileUploader = ({
  bucket,
  userId,
  onUploadComplete,
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedTypes = bucket === "property-images" 
    ? ["image/jpeg", "image/png", "image/webp"] 
    : ["application/pdf", "image/jpeg", "image/png"],
  className,
}: FileUploaderProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipe file ${file.type} tidak diizinkan`;
    }
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `Ukuran file melebihi ${maxSizeInMB}MB`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message);
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      toast({
        title: "Batas file tercapai",
        description: `Maksimal ${maxFiles} file dapat diupload`,
        variant: "destructive",
      });
      return;
    }

    // Validate all files first
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "File tidak valid",
          description: error,
          variant: "destructive",
        });
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    const newUrls: string[] = [];
    const newFiles: UploadedFile[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const url = await uploadFile(file);
        
        if (url) {
          newUrls.push(url);
          newFiles.push({
            name: file.name,
            url,
            size: file.size,
          });
        }
        
        setUploadProgress(((i + 1) / fileArray.length) * 100);
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      onUploadComplete([...uploadedFiles.map(f => f.url), ...newUrls]);

      toast({
        title: "Upload berhasil",
        description: `${newFiles.length} file berhasil diupload`,
      });
    } catch (error) {
      toast({
        title: "Upload gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const removeFile = async (index: number) => {
    const file = uploadedFiles[index];
    
    // Extract path from URL
    const urlParts = file.url.split(`${bucket}/`);
    if (urlParts.length > 1) {
      const path = urlParts[1];
      await supabase.storage.from(bucket).remove([path]);
    }

    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onUploadComplete(newFiles.map(f => f.url));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-colors text-center",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          uploading && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
          )}
          
          <div>
            <p className="font-medium text-foreground">
              {uploading ? "Mengupload..." : "Drag & drop file di sini"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              atau klik untuk memilih file
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {bucket === "property-images" ? "JPG, PNG, WebP" : "PDF, JPG, PNG"} • Maks {maxSizeInMB}MB per file • Maks {maxFiles} file
          </p>
        </div>

        {uploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            File yang diupload ({uploadedFiles.length}/{maxFiles})
          </p>
          {uploadedFiles.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {bucket === "property-images" ? (
                  <ImageIcon className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;