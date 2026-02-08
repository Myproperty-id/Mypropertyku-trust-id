import { useState, useCallback, useEffect } from "react";
import { Upload, X, FileImage, FileText, Loader2, Camera, CheckCircle2 } from "lucide-react";
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
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset success animation when file changes
  useEffect(() => {
    if (selectedFile) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedFile]);

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

  // Show selected file preview with success animation
  if (selectedFile && !isUploading) {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Success overlay animation */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-scale-in">
              <div className="relative">
                {/* Ripple effect */}
                <div className="absolute inset-0 animate-ping">
                  <div className="w-24 h-24 rounded-full bg-accent/30" />
                </div>
                <div className="absolute inset-0 animate-ping" style={{ animationDelay: '150ms' }}>
                  <div className="w-24 h-24 rounded-full bg-accent/20" />
                </div>
                {/* Checkmark */}
                <div className="relative w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-2xl shadow-accent/50">
                  <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
                </div>
              </div>
              <p className="text-center mt-4 font-semibold text-accent text-lg animate-fade-in">
                File Berhasil Ditambahkan!
              </p>
            </div>
          </div>
        )}

        <div className={cn(
          "relative border-2 rounded-xl p-6 transition-all duration-500",
          showSuccess 
            ? "border-accent bg-accent/10 shadow-lg shadow-accent/20" 
            : "border-primary/50 bg-primary/5"
        )}>
          {/* Success checkmark badge */}
          <div className={cn(
            "absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg transition-all duration-300",
            showSuccess ? "scale-110 animate-bounce" : "scale-100"
          )}>
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-10 h-8 w-8"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-start gap-4">
            {/* Preview with success glow */}
            {preview ? (
              <div className={cn(
                "w-20 h-20 rounded-lg overflow-hidden bg-white border flex-shrink-0 transition-all duration-300",
                showSuccess && "ring-4 ring-accent/30 shadow-lg"
              )}>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={cn(
                "w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                showSuccess ? "bg-accent/20" : "bg-primary/10"
              )}>
                <FileText className={cn(
                  "w-8 h-8 transition-colors duration-300",
                  showSuccess ? "text-accent" : "text-primary"
                )} />
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
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-colors duration-300",
                  showSuccess ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                )}>
                  {selectedFile.type.includes("pdf") ? "PDF" : "Gambar"}
                </span>
                <span className={cn(
                  "text-xs flex items-center gap-1 transition-all duration-300",
                  showSuccess ? "text-accent font-medium" : "text-accent/80"
                )}>
                  <CheckCircle2 className="w-3 h-3" />
                  Siap diverifikasi
                </span>
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
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center cursor-pointer overflow-hidden",
          dragActive 
            ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20 ring-4 ring-primary/30" 
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          error && "border-red-300 bg-red-50"
        )}
      >
        {/* Animated overlay when dragging */}
        {dragActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 animate-pulse pointer-events-none" />
        )}
        
        {/* Animated corner indicators when dragging */}
        {dragActive && (
          <>
            <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-primary rounded-tl-lg animate-pulse" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-primary rounded-tr-lg animate-pulse" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-primary rounded-bl-lg animate-pulse" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-primary rounded-br-lg animate-pulse" />
          </>
        )}

        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="flex flex-col items-center gap-4 relative z-0">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            dragActive 
              ? "bg-primary/30 scale-110 shadow-lg shadow-primary/30" 
              : "bg-primary/10"
          )}>
            {dragActive ? (
              <Upload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <FileImage className="w-8 h-8 text-primary" />
            )}
          </div>

          <div className={cn(
            "transition-all duration-300",
            dragActive && "transform -translate-y-1"
          )}>
            <p className={cn(
              "font-medium transition-all duration-300",
              dragActive ? "text-primary text-lg" : "text-foreground"
            )}>
              {dragActive ? "✨ Lepaskan file di sini!" : "Drag & drop dokumen di sini"}
            </p>
            <p className={cn(
              "text-sm mt-1 transition-all duration-300",
              dragActive ? "text-primary/70" : "text-muted-foreground"
            )}>
              {dragActive ? "File siap diterima" : "atau klik untuk memilih file"}
            </p>
          </div>

          <div className={cn(
            "flex flex-wrap justify-center gap-2 text-xs transition-all duration-300",
            dragActive ? "opacity-0 scale-95" : "opacity-100 scale-100 text-muted-foreground"
          )}>
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
