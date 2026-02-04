import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileCheck,
  User,
  MapPin,
  Ruler,
  FileText,
  Shield,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { 
  VerificationResult as VerificationResultType,
  RiskLevel,
  VerificationStatus 
} from "@/services/verificationService";
import { getRiskLevelText, getStatusDisplayText } from "@/services/verificationService";

interface VerificationResultProps {
  result: VerificationResultType;
}

const StatusIcon = ({ status }: { status: VerificationStatus }) => {
  switch (status) {
    case "VERIFIED":
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    case "NEEDS_REVIEW":
      return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    case "REJECTED":
      return <XCircle className="w-6 h-6 text-red-600" />;
    default:
      return <Info className="w-6 h-6 text-gray-600" />;
  }
};

const getRiskBgColor = (level: RiskLevel) => {
  switch (level) {
    case "LOW":
      return "bg-green-50 border-green-200";
    case "MEDIUM":
      return "bg-yellow-50 border-yellow-200";
    case "HIGH":
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getRiskTextColor = (level: RiskLevel) => {
  switch (level) {
    case "LOW":
      return "text-green-700";
    case "MEDIUM":
      return "text-yellow-700";
    case "HIGH":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

const getStatusBadgeVariant = (status: VerificationStatus) => {
  switch (status) {
    case "VERIFIED":
      return "default";
    case "NEEDS_REVIEW":
      return "secondary";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
};

export function VerificationResultCard({ result }: VerificationResultProps) {
  const { risk_assessment, extracted_data, validation_details, verification_status } = result;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Status Header */}
      <Card className={`${getRiskBgColor(risk_assessment.risk_level)} border-2`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-white shadow-sm">
              <StatusIcon status={verification_status} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-xl font-bold ${getRiskTextColor(risk_assessment.risk_level)}`}>
                  {getStatusDisplayText(verification_status)}
                </h3>
                <Badge variant={getStatusBadgeVariant(verification_status)}>
                  {getRiskLevelText(risk_assessment.risk_level)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                ID Verifikasi: <code className="bg-white px-2 py-0.5 rounded">{result.verification_id}</code>
              </p>
              {risk_assessment.recommendation && (
                <p className={`text-sm ${getRiskTextColor(risk_assessment.risk_level)}`}>
                  {risk_assessment.recommendation}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Skor Kepercayaan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{risk_assessment.total_score}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <Progress 
              value={risk_assessment.total_score} 
              className="h-3"
            />
            
            {/* Score Breakdown */}
            {risk_assessment.breakdown && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="breakdown">
                  <AccordionTrigger className="text-sm">
                    Lihat Detail Penilaian
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {Object.entries(risk_assessment.breakdown).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{key.replace(/_/g, " ")}</span>
                            <span className="font-medium">{value.score}/{value.max}</span>
                          </div>
                          <Progress 
                            value={(value.score / value.max) * 100} 
                            className="h-1.5"
                          />
                          <p className="text-xs text-muted-foreground">{value.detail}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Extracted Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileCheck className="w-5 h-5 text-primary" />
            Data yang Diekstrak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {extracted_data.owner_name && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Nama Pemilik</p>
                  <p className="font-medium">{extracted_data.owner_name}</p>
                </div>
              </div>
            )}

            {(extracted_data.certificate_number || extracted_data.nop) && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {extracted_data.nop ? "Nomor Objek Pajak (NOP)" : "Nomor Sertifikat"}
                  </p>
                  <p className="font-medium font-mono">
                    {extracted_data.certificate_number || extracted_data.nop}
                  </p>
                </div>
              </div>
            )}

            {extracted_data.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  <p className="font-medium">{extracted_data.address}</p>
                </div>
              </div>
            )}

            {extracted_data.land_area && (
              <div className="flex items-start gap-3">
                <Ruler className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Luas Tanah</p>
                  <p className="font-medium">{extracted_data.land_area}</p>
                </div>
              </div>
            )}

            {/* Additional location details */}
            {(extracted_data.kelurahan || extracted_data.kecamatan || extracted_data.kabupaten) && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  {extracted_data.kelurahan && (
                    <div>
                      <p className="text-xs text-muted-foreground">Kelurahan</p>
                      <p className="text-sm font-medium">{extracted_data.kelurahan}</p>
                    </div>
                  )}
                  {extracted_data.kecamatan && (
                    <div>
                      <p className="text-xs text-muted-foreground">Kecamatan</p>
                      <p className="text-sm font-medium">{extracted_data.kecamatan}</p>
                    </div>
                  )}
                  {extracted_data.kabupaten && (
                    <div>
                      <p className="text-xs text-muted-foreground">Kab/Kota</p>
                      <p className="text-sm font-medium">{extracted_data.kabupaten}</p>
                    </div>
                  )}
                  {extracted_data.provinsi && (
                    <div>
                      <p className="text-xs text-muted-foreground">Provinsi</p>
                      <p className="text-sm font-medium">{extracted_data.provinsi}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {extracted_data.nib && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">NIB (Nomor Identifikasi Bidang)</p>
                  <p className="font-medium font-mono">{extracted_data.nib}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Details */}
      {validation_details && (validation_details.errors.length > 0 || validation_details.warnings.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Catatan Validasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validation_details.errors.map((error, index) => (
                <div 
                  key={`error-${index}`}
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{error.message}</p>
                    <p className="text-xs text-red-600">Field: {error.field}</p>
                  </div>
                </div>
              ))}
              
              {validation_details.warnings.map((warning, index) => (
                <div 
                  key={`warning-${index}`}
                  className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{warning.message}</p>
                    <p className="text-xs text-yellow-600">Field: {warning.field}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground mb-1">Disclaimer</p>
          <p>
            Hasil verifikasi ini bersifat indikatif dan bukan merupakan nasihat hukum. 
            Selalu lakukan verifikasi fisik dan konsultasi dengan notaris/PPAT untuk 
            keputusan transaksi properti.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificationResultCard;
