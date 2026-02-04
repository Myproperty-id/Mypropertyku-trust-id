/**
 * Mypropertyku Document Verification Service
 * 
 * This service connects to the AI verification backend.
 * Set VITE_VERIFICATION_API_URL in environment or use the default.
 */

// API URL - will be replaced with actual backend URL after deployment
const API_URL = import.meta.env.VITE_VERIFICATION_API_URL || "";

export type DocumentType = "SHM" | "SHGB" | "AJB" | "IMB" | "PBB" | "GIRIK";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type VerificationStatus = "VERIFIED" | "NEEDS_REVIEW" | "REJECTED" | "PENDING";

export interface RiskAssessment {
  total_score: number;
  risk_level: RiskLevel;
  color: "green" | "yellow" | "red";
  recommendation?: string;
  breakdown?: Record<string, {
    score: number;
    max: number;
    detail: string;
  }>;
}

export interface ExtractedData {
  owner_name?: string;
  certificate_number?: string;
  certificate_type?: string;
  address?: string;
  land_area?: string;
  kelurahan?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  nib?: string;
  nop?: string;
}

export interface ValidationDetails {
  is_valid: boolean;
  checks_passed: string[];
  errors: Array<{
    field: string;
    code: string;
    message: string;
  }>;
  warnings: Array<{
    field: string;
    code: string;
    message: string;
  }>;
  critical_errors: Array<{
    code: string;
    message: string;
  }>;
  total_checks: number;
  passed_checks: number;
}

export interface VerificationResult {
  success: boolean;
  verification_id: string;
  verification_status: VerificationStatus;
  risk_assessment: RiskAssessment;
  extracted_data: ExtractedData;
  validation_details?: ValidationDetails;
  created_at: string;
  error?: string;
}

export interface VerificationListItem {
  verification_id: string;
  document_type: DocumentType;
  verification_status: VerificationStatus;
  risk_level: RiskLevel;
  risk_score: number;
  created_at: string;
}

export interface VerificationListResponse {
  total: number;
  items: VerificationListItem[];
}

/**
 * Verify a property document using AI pipeline
 */
export async function verifyDocument(
  file: File,
  documentType: DocumentType
): Promise<VerificationResult> {
  // If no API URL, use mock for development
  if (!API_URL) {
    console.warn("VITE_VERIFICATION_API_URL not set, using mock response");
    return mockVerifyDocument(file, documentType);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", documentType);

  try {
    const response = await fetch(`${API_URL}/api/v1/verify`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Verification API error:", error);
    throw error;
  }
}

/**
 * Get verification result by ID
 */
export async function getVerification(verificationId: string): Promise<VerificationResult> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  const response = await fetch(`${API_URL}/api/v1/verify/${verificationId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * List all verifications with pagination
 */
export async function listVerifications(
  skip: number = 0,
  limit: number = 20
): Promise<VerificationListResponse> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  const response = await fetch(
    `${API_URL}/api/v1/verifications?skip=${skip}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Check if verification API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  if (!API_URL) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get risk level color class for Tailwind
 */
export function getRiskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "text-green-600 bg-green-50 border-green-200";
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "HIGH":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/**
 * Get verification status display text
 */
export function getStatusDisplayText(status: VerificationStatus): string {
  switch (status) {
    case "VERIFIED":
      return "Terverifikasi";
    case "NEEDS_REVIEW":
      return "Perlu Review";
    case "REJECTED":
      return "Ditolak";
    case "PENDING":
      return "Menunggu";
    default:
      return status;
  }
}

/**
 * Get risk level display text
 */
export function getRiskLevelText(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "Risiko Rendah";
    case "MEDIUM":
      return "Risiko Sedang";
    case "HIGH":
      return "Risiko Tinggi";
    default:
      return level;
  }
}

// ============ MOCK IMPLEMENTATION FOR DEVELOPMENT ============

/**
 * Mock verification for development when backend is not available
 */
async function mockVerifyDocument(
  file: File,
  documentType: DocumentType
): Promise<VerificationResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

  const verificationId = `VER-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  // Simulate different results based on document type
  const mockResults: Record<DocumentType, Partial<VerificationResult>> = {
    SHM: {
      verification_status: "VERIFIED",
      risk_assessment: {
        total_score: 85,
        risk_level: "LOW",
        color: "green",
        recommendation: "Dokumen terlihat valid. Tetap lakukan verifikasi fisik.",
        breakdown: {
          ocr_quality: { score: 18, max: 20, detail: "OCR confidence: 92%" },
          data_extraction: { score: 22, max: 25, detail: "Passed 5/6 checks" },
          format_check: { score: 13, max: 15, detail: "0 errors, 1 warning" },
          data_completeness: { score: 16, max: 20, detail: "4/5 optional fields found" },
          document_type: { score: 20, max: 20, detail: "SHM reliability: 100%" },
        },
      },
      extracted_data: {
        owner_name: "BUDI SANTOSO",
        certificate_number: "SHM/2024/12345",
        certificate_type: "SHM",
        address: "Jl. Merdeka No. 123, Kel. Menteng, Kec. Menteng",
        land_area: "250 m²",
        kelurahan: "Menteng",
        kecamatan: "Menteng",
        kabupaten: "Jakarta Pusat",
        provinsi: "DKI Jakarta",
        nib: "12.34.56.78.90123",
      },
    },
    SHGB: {
      verification_status: "NEEDS_REVIEW",
      risk_assessment: {
        total_score: 62,
        risk_level: "MEDIUM",
        color: "yellow",
        recommendation: "Beberapa data perlu diverifikasi manual. Hubungi notaris.",
      },
      extracted_data: {
        owner_name: "PT PROPERTI MAKMUR",
        certificate_number: "SHGB/2023/67890",
        certificate_type: "SHGB",
        address: "Kawasan Industri, Bekasi",
        land_area: "1500 m²",
      },
    },
    GIRIK: {
      verification_status: "NEEDS_REVIEW",
      risk_assessment: {
        total_score: 45,
        risk_level: "MEDIUM",
        color: "yellow",
        recommendation: "Dokumen Girik memerlukan verifikasi tambahan. Konsultasi dengan notaris.",
      },
      extracted_data: {
        owner_name: "AHMAD",
        certificate_type: "GIRIK",
        address: "Desa Sukamaju, Bogor",
        land_area: "500 m²",
      },
    },
    AJB: {
      verification_status: "NEEDS_REVIEW",
      risk_assessment: {
        total_score: 55,
        risk_level: "MEDIUM",
        color: "yellow",
        recommendation: "AJB perlu dicocokkan dengan sertifikat asli.",
      },
      extracted_data: {
        owner_name: "SITI RAHAYU",
        certificate_type: "AJB",
        address: "Jl. Sudirman No. 45, Jakarta",
      },
    },
    IMB: {
      verification_status: "VERIFIED",
      risk_assessment: {
        total_score: 72,
        risk_level: "LOW",
        color: "green",
        recommendation: "IMB terlihat valid.",
      },
      extracted_data: {
        certificate_type: "IMB",
        address: "Jl. Gatot Subroto No. 100",
      },
    },
    PBB: {
      verification_status: "VERIFIED",
      risk_assessment: {
        total_score: 78,
        risk_level: "LOW",
        color: "green",
        recommendation: "Data PBB terverifikasi.",
      },
      extracted_data: {
        nop: "32.01.020.003.001-0001.0",
        address: "Jl. Kemang Raya No. 10",
        land_area: "300 m²",
      },
    },
  };

  const result = mockResults[documentType] || mockResults.SHM;

  return {
    success: true,
    verification_id: verificationId,
    verification_status: result.verification_status as VerificationStatus,
    risk_assessment: result.risk_assessment as RiskAssessment,
    extracted_data: result.extracted_data as ExtractedData,
    validation_details: {
      is_valid: result.verification_status === "VERIFIED",
      checks_passed: ["required_certificate_number", "owner_name_valid", "address_present"],
      errors: [],
      warnings: result.verification_status === "NEEDS_REVIEW" 
        ? [{ field: "format", code: "NEEDS_MANUAL_CHECK", message: "Beberapa field memerlukan verifikasi manual" }]
        : [],
      critical_errors: [],
      total_checks: 6,
      passed_checks: result.verification_status === "VERIFIED" ? 5 : 3,
    },
    created_at: new Date().toISOString(),
  };
}
