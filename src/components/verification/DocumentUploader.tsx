import { useState, useCallback } from "react";
import { Upload, X, FileImage, FileText, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  selectedFile?: File | null;
  onClear?: () => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE_MB = 10;

export function DocumentUploader({
  onFileSelect,
  isUploading = false,
  uploadProgress = 0,
  selectedFile = null,
  onClear,
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  maxSizeMB = MAX_SIZE_MB,
  className,
}: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Format file tidak didukung. Gunakan JPG, PNG, atau PDF.";
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Ukuran file maksimal ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  }, [onFileSelect, maxSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    onClear?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Show selected file preview
  if (selectedFile && !isUploading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="relative border-2 border-primary/50 rounded-xl p-6 bg-primary/5">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-start gap-4">
            {/* Preview */}
            {preview ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border flex-shrink-0">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" />
              </div>
            )}

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  {selectedFile.type.includes("pdf") ? "PDF" : "Gambar"}
                </span>
                <span className="text-xs text-green-600">✓ Siap diverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Uploading state
  if (isUploading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="border-2 border-dashed border-primary/50 rounded-xl p-8 bg-primary/5">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium text-foreground">
                Memverifikasi dokumen...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                AI sedang menganalisis dokumen Anda
              </p>
            </div>
            <div className="w-full max-w-xs">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground mt-2">
                {Math.round(uploadProgress)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Drop zone
  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer",
          dragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          error && "border-red-300 bg-red-50"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            dragActive ? "bg-primary/20" : "bg-primary/10"
          )}>
            {dragActive ? (
              <Upload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <FileImage className="w-8 h-8 text-primary" />
            )}
          </div>

          <div>
            <p className="font-medium text-foreground">
              {dragActive ? "Lepaskan file di sini" : "Drag & drop dokumen di sini"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              atau klik untuk memilih file
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded">JPG</span>
            <span className="px-2 py-1 bg-muted rounded">PNG</span>
            <span className="px-2 py-1 bg-muted rounded">PDF</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Maks {maxSizeMB}MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Mobile camera option */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">atau</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.capture = "environment";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
          };
          input.click();
        }}
      >
        <Camera className="w-4 h-4" />
        Ambil Foto dengan Kamera
      </Button>
    </div>
  );
}

export default DocumentUploader;
