import { useState } from "react";
import { Sparkles, ShieldCheck, AlertTriangle, Loader2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentUploader } from "./DocumentUploader";
import { verifyDocument, type DocumentType, type VerificationResult } from "@/services/verificationService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PropertyDocumentVerifierProps {
  userId: string;
  onVerificationComplete?: (result: VerificationResult) => void;
  onVerificationIdChange?: (verificationId: string | null) => void;
}

const DOCUMENT_TYPES = [
  { code: "SHM", name: "SHM (Sertifikat Hak Milik)" },
  { code: "SHGB", name: "SHGB (Sertifikat Hak Guna Bangunan)" },
  { code: "AJB", name: "AJB (Akta Jual Beli)" },
  { code: "IMB", name: "IMB (Izin Mendirikan Bangunan)" },
  { code: "PBB", name: "PBB (Pajak Bumi dan Bangunan)" },
  { code: "GIRIK", name: "Girik / Letter C" },
];

export function PropertyDocumentVerifier({
  userId,
  onVerificationComplete,
  onVerificationIdChange,
}: PropertyDocumentVerifierProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("SHM");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setVerificationResult(null);
    onVerificationIdChange?.(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setVerificationResult(null);
    setVerifyProgress(0);
    onVerificationIdChange?.(null);
  };

  const saveToDatabase = async (result: VerificationResult) => {
    try {
      const { error } = await supabase.from("verification_results").insert([{
        user_id: userId,
        verification_id: result.verification_id,
        document_type: documentType as string,
        verification_status: result.verification_status as string,
        risk_level: result.risk_assessment.risk_level as string,
        risk_score: result.risk_assessment.total_score,
        risk_recommendation: result.risk_assessment.recommendation || null,
        extracted_data: result.extracted_data ? JSON.parse(JSON.stringify(result.extracted_data)) : null,
        validation_details: result.validation_details ? JSON.parse(JSON.stringify(result.validation_details)) : null,
      }]);

      if (error) {
        console.error("Error saving verification:", error);
      }
    } catch (err) {
      console.error("Failed to save verification result:", err);
    }
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      toast.error("Pilih dokumen terlebih dahulu");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    const progressInterval = setInterval(() => {
      setVerifyProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const result = await verifyDocument(selectedFile, documentType);
      setVerificationResult(result);
      
      // Save to database
      await saveToDatabase(result);
      onVerificationIdChange?.(result.verification_id);
      onVerificationComplete?.(result);

      if (result.verification_status === "VERIFIED") {
        toast.success("Dokumen berhasil diverifikasi!");
      } else if (result.verification_status === "NEEDS_REVIEW") {
        toast.warning("Dokumen memerlukan review manual");
      } else {
        toast.error("Verifikasi mendeteksi masalah pada dokumen");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Gagal memverifikasi dokumen. Silakan coba lagi.");
    } finally {
      clearInterval(progressInterval);
      setVerifyProgress(100);
      setTimeout(() => {
        setIsVerifying(false);
        setVerifyProgress(0);
      }, 500);
    }
  };

  const getStatusBadge = () => {
    if (!verificationResult) return null;
    
    switch (verificationResult.verification_status) {
      case "VERIFIED":
        return (
          <Badge className="bg-accent/15 text-accent gap-1">
            <ShieldCheck className="w-3 h-3" />
            Terverifikasi
          </Badge>
        );
      case "NEEDS_REVIEW":
        return (
          <Badge className="bg-warning/15 text-warning gap-1">
            <AlertTriangle className="w-3 h-3" />
            Perlu Review
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-destructive/15 text-destructive gap-1">
            <AlertTriangle className="w-3 h-3" />
            Ditolak
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRiskBadge = () => {
    if (!verificationResult) return null;
    
    const { risk_level, total_score } = verificationResult.risk_assessment;
    
    switch (risk_level) {
      case "LOW":
        return (
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
            Risiko Rendah ({total_score}/100)
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            Risiko Sedang ({total_score}/100)
          </Badge>
        );
      case "HIGH":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            Risiko Tinggi ({total_score}/100)
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Verifikasi Dokumen Legalitas (AI)</CardTitle>
        </div>
        <CardDescription>
          Upload dokumen sertifikat untuk verifikasi otomatis menggunakan AI. Hasil verifikasi akan dikaitkan dengan listing properti Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Jenis Dokumen</Label>
          <Select 
            value={documentType} 
            onValueChange={(value) => setDocumentType(value as DocumentType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis dokumen" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((doc) => (
                <SelectItem key={doc.code} value={doc.code}>
                  {doc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DocumentUploader
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onClear={handleClearFile}
          isUploading={isVerifying}
          uploadProgress={verifyProgress}
        />

        <Button
          className="w-full gap-2"
          onClick={handleVerify}
          disabled={!selectedFile || isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memverifikasi...
            </>
          ) : (
            <>
              <FileCheck className="w-4 h-4" />
              Verifikasi Dokumen
            </>
          )}
        </Button>

        {/* Verification Result Summary */}
        {verificationResult && (
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Hasil Verifikasi</span>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                {getRiskBadge()}
              </div>
            </div>
            
            {verificationResult.extracted_data?.owner_name && (
              <div className="text-sm">
                <span className="text-muted-foreground">Nama Pemilik:</span>{" "}
                <span className="font-medium">{verificationResult.extracted_data.owner_name}</span>
              </div>
            )}
            
            {verificationResult.risk_assessment.recommendation && (
              <p className="text-xs text-muted-foreground">
                💡 {verificationResult.risk_assessment.recommendation}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          ⚠️ Hasil AI bersifat indikatif. Verifikasi resmi tetap dilakukan oleh tim Mypropertyku.
        </p>
      </CardContent>
    </Card>
  );
}

export default PropertyDocumentVerifier;
