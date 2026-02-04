# Mypropertyku AI Document Verification Backend

Backend Python FastAPI untuk verifikasi dokumen properti dengan OCR dan AI Agent pipeline.

## 🏗️ Arsitektur

```
Lovable Frontend (React)
        ↓ REST API
FastAPI Backend (Python)
        ↓
AI Agent Pipeline
(OCR → NLP → Validation → Risk Scoring)
        ↓
Database (SQLite/PostgreSQL)
```

## 📁 Struktur Project

```
mypropertyku-ai-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── verify.py
│   ├── agents/
│   │   ├── __init__.py
│   │   └── verification_agent.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ocr_service.py
│   │   ├── nlp_service.py
│   │   ├── validation_service.py
│   │   └── risk_scoring_service.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── models.py
├── uploads/
│   └── .gitkeep
├── requirements.txt
├── .env.example
├── .gitignore
├── Dockerfile
├── railway.toml
└── README.md
```

## 🚀 Quick Start (Local Development)

### 1. Prerequisites

- Python 3.10+
- Tesseract OCR installed on your system

**Install Tesseract:**

```bash
# macOS
brew install tesseract tesseract-lang

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-ind

# Windows
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH after installation
```

### 2. Setup Project

```bash
# Clone or create directory
mkdir mypropertyku-ai-backend
cd mypropertyku-ai-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download xx_ent_wiki_sm
```

### 3. Run Server

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Access API

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## 📦 requirements.txt

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
sqlalchemy==2.0.25
aiosqlite==0.19.0
pytesseract==0.3.10
Pillow==10.2.0
pdf2image==1.17.0
spacy==3.7.4
pydantic==2.5.3
python-dotenv==1.0.0
aiofiles==23.2.1
```

---

## 📝 Complete Code Files

### app/__init__.py

```python
# Mypropertyku AI Backend
```

### app/config.py

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "Mypropertyku AI Verification"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./mypropertyku.db")
    
    # Upload
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {"jpg", "jpeg", "png", "pdf"}
    
    # CORS
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS", 
        "http://localhost:3000,http://localhost:5173,https://mypropertyku.lovable.app"
    ).split(",")

settings = Settings()
```

### app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.config import settings
from app.api.verify import router as verify_router
from app.db.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(verify_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### app/api/__init__.py

```python
# API Routes
```

### app/api/verify.py

```python
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import aiofiles
import os
import uuid
from datetime import datetime

from app.config import settings
from app.agents.verification_agent import VerificationAgent
from app.db.database import get_db
from app.db.models import VerificationResult
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

router = APIRouter(tags=["Verification"])

ALLOWED_DOCUMENT_TYPES = ["SHM", "SHGB", "AJB", "IMB", "PBB", "GIRIK"]

def validate_file(file: UploadFile) -> bool:
    if not file.filename:
        return False
    ext = file.filename.split(".")[-1].lower()
    return ext in settings.ALLOWED_EXTENSIONS

@router.post("/verify")
async def verify_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Verify a property document using AI pipeline.
    
    - **file**: Document image (JPG, PNG) or PDF
    - **document_type**: SHM | SHGB | AJB | IMB | PBB | GIRIK
    """
    
    # Validate document type
    if document_type.upper() not in ALLOWED_DOCUMENT_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid document type. Must be one of: {', '.join(ALLOWED_DOCUMENT_TYPES)}"
        )
    
    # Validate file
    if not validate_file(file):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Generate verification ID
    verification_id = f"VER-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
    
    # Save file
    file_ext = file.filename.split(".")[-1].lower()
    file_path = os.path.join(settings.UPLOAD_DIR, f"{verification_id}.{file_ext}")
    
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)
    
    try:
        # Run AI verification pipeline
        agent = VerificationAgent()
        result = await agent.verify(
            file_path=file_path,
            document_type=document_type.upper()
        )
        
        # Save to database
        db_result = VerificationResult(
            verification_id=verification_id,
            document_type=document_type.upper(),
            file_path=file_path,
            extracted_data=result["extracted_data"],
            risk_score=result["risk_assessment"]["total_score"],
            risk_level=result["risk_assessment"]["risk_level"],
            verification_status=result["verification_status"],
            raw_text=result.get("raw_text", ""),
            validation_details=result.get("validation_details", {})
        )
        
        db.add(db_result)
        await db.commit()
        await db.refresh(db_result)
        
        return JSONResponse(content={
            "success": True,
            "verification_id": verification_id,
            "verification_status": result["verification_status"],
            "risk_assessment": result["risk_assessment"],
            "extracted_data": result["extracted_data"],
            "validation_details": result.get("validation_details", {}),
            "created_at": db_result.created_at.isoformat()
        })
        
    except Exception as e:
        # Cleanup file on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify/{verification_id}")
async def get_verification(
    verification_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get verification result by ID"""
    from sqlalchemy import select
    
    result = await db.execute(
        select(VerificationResult).where(
            VerificationResult.verification_id == verification_id
        )
    )
    verification = result.scalar_one_or_none()
    
    if not verification:
        raise HTTPException(status_code=404, detail="Verification not found")
    
    return {
        "verification_id": verification.verification_id,
        "document_type": verification.document_type,
        "verification_status": verification.verification_status,
        "risk_assessment": {
            "total_score": verification.risk_score,
            "risk_level": verification.risk_level,
            "color": "green" if verification.risk_level == "LOW" else "yellow" if verification.risk_level == "MEDIUM" else "red"
        },
        "extracted_data": verification.extracted_data,
        "validation_details": verification.validation_details,
        "created_at": verification.created_at.isoformat()
    }

@router.get("/verifications")
async def list_verifications(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """List all verifications"""
    from sqlalchemy import select, func
    
    # Count total
    count_result = await db.execute(select(func.count(VerificationResult.id)))
    total = count_result.scalar()
    
    # Get paginated results
    result = await db.execute(
        select(VerificationResult)
        .order_by(VerificationResult.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    verifications = result.scalars().all()
    
    return {
        "total": total,
        "items": [
            {
                "verification_id": v.verification_id,
                "document_type": v.document_type,
                "verification_status": v.verification_status,
                "risk_level": v.risk_level,
                "risk_score": v.risk_score,
                "created_at": v.created_at.isoformat()
            }
            for v in verifications
        ]
    }
```

### app/agents/__init__.py

```python
# AI Agents
```

### app/agents/verification_agent.py

```python
from app.services.ocr_service import OCRService
from app.services.nlp_service import NLPService
from app.services.validation_service import ValidationService
from app.services.risk_scoring_service import RiskScoringService

class VerificationAgent:
    """
    AI Agent that orchestrates document verification pipeline.
    
    Pipeline:
    1. OCR Service - Extract text from document
    2. NLP Service - Extract structured data (names, numbers, addresses)
    3. Validation Service - Validate format and consistency
    4. Risk Scoring Service - Calculate risk score and level
    5. Decision Engine - Final verification status
    """
    
    def __init__(self):
        self.ocr_service = OCRService()
        self.nlp_service = NLPService()
        self.validation_service = ValidationService()
        self.risk_scoring_service = RiskScoringService()
    
    async def verify(self, file_path: str, document_type: str) -> dict:
        """
        Run full verification pipeline on document.
        
        Args:
            file_path: Path to document file
            document_type: Type of document (SHM, SHGB, etc.)
            
        Returns:
            Complete verification result
        """
        
        # Step 1: OCR - Extract text
        ocr_result = await self.ocr_service.extract_text(file_path)
        
        if not ocr_result["success"]:
            return self._create_error_result(
                "OCR_FAILED", 
                "Gagal membaca dokumen. Pastikan gambar jelas dan tidak blur."
            )
        
        raw_text = ocr_result["text"]
        confidence = ocr_result["confidence"]
        
        # Step 2: NLP - Extract structured data
        extracted_data = await self.nlp_service.extract_data(
            text=raw_text,
            document_type=document_type
        )
        
        # Step 3: Validation - Check format and consistency
        validation_result = await self.validation_service.validate(
            extracted_data=extracted_data,
            document_type=document_type,
            raw_text=raw_text
        )
        
        # Step 4: Risk Scoring - Calculate risk
        risk_assessment = await self.risk_scoring_service.calculate(
            extracted_data=extracted_data,
            validation_result=validation_result,
            ocr_confidence=confidence,
            document_type=document_type
        )
        
        # Step 5: Decision Engine - Final status
        verification_status = self._determine_status(
            risk_assessment=risk_assessment,
            validation_result=validation_result
        )
        
        return {
            "verification_status": verification_status,
            "risk_assessment": risk_assessment,
            "extracted_data": extracted_data,
            "validation_details": validation_result,
            "raw_text": raw_text[:500] + "..." if len(raw_text) > 500 else raw_text,
            "ocr_confidence": confidence
        }
    
    def _determine_status(self, risk_assessment: dict, validation_result: dict) -> str:
        """
        Determine final verification status based on risk and validation.
        
        Returns:
            VERIFIED | NEEDS_REVIEW | REJECTED
        """
        risk_level = risk_assessment["risk_level"]
        is_valid = validation_result.get("is_valid", False)
        critical_errors = validation_result.get("critical_errors", [])
        
        # Rejected if critical errors exist
        if critical_errors:
            return "REJECTED"
        
        # Verified if low risk and valid
        if risk_level == "LOW" and is_valid:
            return "VERIFIED"
        
        # High risk = needs review
        if risk_level == "HIGH":
            return "NEEDS_REVIEW"
        
        # Medium risk or not fully valid = needs review
        return "NEEDS_REVIEW"
    
    def _create_error_result(self, error_code: str, message: str) -> dict:
        """Create error result structure"""
        return {
            "verification_status": "REJECTED",
            "risk_assessment": {
                "total_score": 0,
                "risk_level": "HIGH",
                "color": "red",
                "details": {"error": message}
            },
            "extracted_data": {},
            "validation_details": {
                "is_valid": False,
                "critical_errors": [{"code": error_code, "message": message}]
            }
        }
```

### app/services/__init__.py

```python
# Services
```

### app/services/ocr_service.py

```python
import pytesseract
from PIL import Image
import os
from typing import Optional

class OCRService:
    """
    OCR Service using Tesseract for text extraction.
    Supports JPG, PNG, and PDF files.
    """
    
    def __init__(self):
        # Configure Tesseract path if needed
        # pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'
        pass
    
    async def extract_text(self, file_path: str) -> dict:
        """
        Extract text from document image or PDF.
        
        Args:
            file_path: Path to the document file
            
        Returns:
            dict with text, confidence, and success status
        """
        try:
            ext = file_path.split(".")[-1].lower()
            
            if ext == "pdf":
                return await self._extract_from_pdf(file_path)
            else:
                return await self._extract_from_image(file_path)
                
        except Exception as e:
            return {
                "success": False,
                "text": "",
                "confidence": 0,
                "error": str(e)
            }
    
    async def _extract_from_image(self, file_path: str) -> dict:
        """Extract text from image file"""
        image = Image.open(file_path)
        
        # Preprocess for better OCR
        image = self._preprocess_image(image)
        
        # Get detailed OCR data
        data = pytesseract.image_to_data(
            image, 
            lang="ind+eng",
            output_type=pytesseract.Output.DICT
        )
        
        # Calculate average confidence
        confidences = [int(c) for c in data["conf"] if int(c) > 0]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Get full text
        text = pytesseract.image_to_string(image, lang="ind+eng")
        
        return {
            "success": True,
            "text": text.strip(),
            "confidence": round(avg_confidence, 2),
            "word_count": len([w for w in data["text"] if w.strip()])
        }
    
    async def _extract_from_pdf(self, file_path: str) -> dict:
        """Extract text from PDF file"""
        try:
            from pdf2image import convert_from_path
            
            # Convert PDF pages to images
            pages = convert_from_path(file_path, dpi=300)
            
            all_text = []
            all_confidences = []
            
            for page in pages[:5]:  # Limit to first 5 pages
                page = self._preprocess_image(page)
                
                data = pytesseract.image_to_data(
                    page,
                    lang="ind+eng", 
                    output_type=pytesseract.Output.DICT
                )
                
                confidences = [int(c) for c in data["conf"] if int(c) > 0]
                all_confidences.extend(confidences)
                
                text = pytesseract.image_to_string(page, lang="ind+eng")
                all_text.append(text)
            
            avg_confidence = sum(all_confidences) / len(all_confidences) if all_confidences else 0
            
            return {
                "success": True,
                "text": "\n\n".join(all_text).strip(),
                "confidence": round(avg_confidence, 2),
                "page_count": len(pages)
            }
            
        except ImportError:
            # Fallback if pdf2image not available
            return {
                "success": False,
                "text": "",
                "confidence": 0,
                "error": "PDF support requires pdf2image and poppler"
            }
    
    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess image for better OCR accuracy"""
        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Convert to grayscale
        image = image.convert("L")
        
        # Increase contrast
        from PIL import ImageEnhance
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)
        
        # Sharpen
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)
        
        return image
```

### app/services/nlp_service.py

```python
import re
from typing import Dict, List, Optional

class NLPService:
    """
    NLP Service for extracting structured data from OCR text.
    Uses pattern matching and rule-based extraction.
    """
    
    def __init__(self):
        self._load_patterns()
    
    def _load_patterns(self):
        """Load regex patterns for different document types"""
        
        # Common patterns
        self.patterns = {
            # Certificate numbers
            "shm_number": [
                r"(?:SHM|Sertifikat Hak Milik)[:\s]*(?:No\.?|Nomor)?[:\s]*(\d+[\w\-\/]*)",
                r"Hak Milik[:\s]*(?:No\.?|Nomor)?[:\s]*(\d+[\w\-\/]*)",
                r"HM[.\s]*(\d+)",
            ],
            "shgb_number": [
                r"(?:SHGB|Sertifikat Hak Guna Bangunan)[:\s]*(?:No\.?|Nomor)?[:\s]*(\d+[\w\-\/]*)",
                r"Hak Guna Bangunan[:\s]*(?:No\.?|Nomor)?[:\s]*(\d+[\w\-\/]*)",
                r"HGB[.\s]*(\d+)",
            ],
            "certificate_number": [
                r"(?:Nomor|No\.?)[:\s]*(?:Sertifikat)?[:\s]*(\d+[\w\-\/]*\d+)",
                r"Sertifikat[:\s]*(?:No\.?|Nomor)?[:\s]*(\d+[\w\-\/]*)",
            ],
            
            # Owner names
            "owner_name": [
                r"(?:Nama|Atas Nama|Pemegang Hak)[:\s]*([A-Z][A-Za-z\s\.]+)",
                r"(?:Pemilik|Tuan|Nyonya|Tn\.|Ny\.)[:\s]*([A-Z][A-Za-z\s\.]+)",
            ],
            
            # Addresses
            "address": [
                r"(?:Alamat|Terletak di|Lokasi)[:\s]*([A-Za-z0-9\s,\.\-]+(?:Kelurahan|Kecamatan|Kabupaten|Kota|Provinsi)[A-Za-z0-9\s,\.\-]*)",
                r"(?:Jl\.|Jalan)[:\s]*([A-Za-z0-9\s,\.\-]+)",
            ],
            
            # Land area
            "land_area": [
                r"(?:Luas|Luas Tanah)[:\s]*(\d+[\.,]?\d*)\s*(?:M2|m2|M²|m²|meter)",
                r"(\d+[\.,]?\d*)\s*(?:M2|m2|M²|m²)",
            ],
            
            # NIB (Nomor Identifikasi Bidang)
            "nib": [
                r"(?:NIB|Nomor Identifikasi Bidang)[:\s]*(\d+[\.\-]?\d+)",
            ],
            
            # NOP (Nomor Objek Pajak) for PBB
            "nop": [
                r"(?:NOP|Nomor Objek Pajak)[:\s]*(\d+[\.\-]?\d+)",
            ],
            
            # Kelurahan/Desa
            "kelurahan": [
                r"(?:Kelurahan|Desa|Kel\.)[:\s]*([A-Za-z\s]+)",
            ],
            
            # Kecamatan
            "kecamatan": [
                r"(?:Kecamatan|Kec\.)[:\s]*([A-Za-z\s]+)",
            ],
            
            # Kabupaten/Kota
            "kabupaten": [
                r"(?:Kabupaten|Kab\.|Kota)[:\s]*([A-Za-z\s]+)",
            ],
            
            # Provinsi
            "provinsi": [
                r"(?:Provinsi|Prov\.)[:\s]*([A-Za-z\s]+)",
            ],
        }
    
    async def extract_data(self, text: str, document_type: str) -> dict:
        """
        Extract structured data from OCR text.
        
        Args:
            text: Raw OCR text
            document_type: Type of document for context
            
        Returns:
            Extracted data dictionary
        """
        # Normalize text
        text_normalized = self._normalize_text(text)
        
        result = {
            "owner_name": self._extract_pattern(text_normalized, "owner_name"),
            "address": self._extract_address(text_normalized),
            "land_area": self._extract_land_area(text_normalized),
            "kelurahan": self._extract_pattern(text_normalized, "kelurahan"),
            "kecamatan": self._extract_pattern(text_normalized, "kecamatan"),
            "kabupaten": self._extract_pattern(text_normalized, "kabupaten"),
            "provinsi": self._extract_pattern(text_normalized, "provinsi"),
        }
        
        # Document-specific extraction
        if document_type in ["SHM"]:
            result["certificate_number"] = self._extract_certificate_number(
                text_normalized, "shm_number"
            )
            result["certificate_type"] = "SHM"
            
        elif document_type in ["SHGB"]:
            result["certificate_number"] = self._extract_certificate_number(
                text_normalized, "shgb_number"
            )
            result["certificate_type"] = "SHGB"
            
        elif document_type in ["PBB"]:
            result["nop"] = self._extract_pattern(text_normalized, "nop")
            result["certificate_type"] = "PBB"
            
        else:
            result["certificate_number"] = self._extract_certificate_number(
                text_normalized, "certificate_number"
            )
            result["certificate_type"] = document_type
        
        # Add NIB if found
        nib = self._extract_pattern(text_normalized, "nib")
        if nib:
            result["nib"] = nib
        
        # Clean None values
        result = {k: v for k, v in result.items() if v is not None}
        
        return result
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text for better pattern matching"""
        # Replace multiple spaces
        text = re.sub(r'\s+', ' ', text)
        # Fix common OCR mistakes
        text = text.replace('0', 'O').replace('|', 'I')
        return text.strip()
    
    def _extract_pattern(self, text: str, pattern_name: str) -> Optional[str]:
        """Extract first match for a pattern"""
        patterns = self.patterns.get(pattern_name, [])
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = match.group(1).strip()
                # Clean up the value
                value = re.sub(r'\s+', ' ', value)
                return value
        
        return None
    
    def _extract_certificate_number(self, text: str, pattern_name: str) -> Optional[str]:
        """Extract certificate number with fallback"""
        # Try specific pattern first
        result = self._extract_pattern(text, pattern_name)
        if result:
            return result
        
        # Fallback to generic pattern
        return self._extract_pattern(text, "certificate_number")
    
    def _extract_address(self, text: str) -> Optional[str]:
        """Extract and compose full address"""
        address_parts = []
        
        # Try to get direct address
        address = self._extract_pattern(text, "address")
        if address:
            return address
        
        # Compose from parts
        kelurahan = self._extract_pattern(text, "kelurahan")
        kecamatan = self._extract_pattern(text, "kecamatan")
        kabupaten = self._extract_pattern(text, "kabupaten")
        
        if kelurahan:
            address_parts.append(f"Kel. {kelurahan}")
        if kecamatan:
            address_parts.append(f"Kec. {kecamatan}")
        if kabupaten:
            address_parts.append(kabupaten)
        
        return ", ".join(address_parts) if address_parts else None
    
    def _extract_land_area(self, text: str) -> Optional[str]:
        """Extract land area with unit"""
        result = self._extract_pattern(text, "land_area")
        if result:
            # Clean and standardize
            result = result.replace(",", ".")
            return f"{result} m²"
        return None
```

### app/services/validation_service.py

```python
import re
from typing import Dict, List

class ValidationService:
    """
    Validation Service for checking document data quality and consistency.
    """
    
    def __init__(self):
        self.required_fields = {
            "SHM": ["certificate_number", "owner_name"],
            "SHGB": ["certificate_number", "owner_name"],
            "AJB": ["owner_name"],
            "IMB": [],
            "PBB": ["nop"],
            "GIRIK": ["owner_name"],
        }
    
    async def validate(
        self, 
        extracted_data: dict, 
        document_type: str,
        raw_text: str
    ) -> dict:
        """
        Validate extracted data against rules.
        
        Returns:
            Validation result with is_valid, warnings, and errors
        """
        errors = []
        warnings = []
        critical_errors = []
        checks_passed = []
        
        # 1. Required fields check
        required = self.required_fields.get(document_type, [])
        for field in required:
            if field not in extracted_data or not extracted_data[field]:
                errors.append({
                    "field": field,
                    "code": "MISSING_REQUIRED",
                    "message": f"Field '{field}' tidak ditemukan dalam dokumen"
                })
            else:
                checks_passed.append(f"required_{field}")
        
        # 2. Certificate number format validation
        cert_number = extracted_data.get("certificate_number")
        if cert_number:
            if not self._validate_certificate_format(cert_number, document_type):
                warnings.append({
                    "field": "certificate_number",
                    "code": "INVALID_FORMAT",
                    "message": "Format nomor sertifikat tidak sesuai standar"
                })
            else:
                checks_passed.append("certificate_format")
        
        # 3. Owner name validation
        owner_name = extracted_data.get("owner_name")
        if owner_name:
            if len(owner_name) < 3:
                warnings.append({
                    "field": "owner_name",
                    "code": "TOO_SHORT",
                    "message": "Nama pemilik terlalu pendek"
                })
            elif not self._is_valid_name(owner_name):
                warnings.append({
                    "field": "owner_name",
                    "code": "SUSPICIOUS_NAME",
                    "message": "Format nama pemilik mencurigakan"
                })
            else:
                checks_passed.append("owner_name_valid")
        
        # 4. Land area validation
        land_area = extracted_data.get("land_area")
        if land_area:
            area_value = self._parse_area(land_area)
            if area_value and (area_value < 1 or area_value > 1000000):
                warnings.append({
                    "field": "land_area",
                    "code": "UNUSUAL_AREA",
                    "message": f"Luas tanah {land_area} tidak wajar"
                })
            else:
                checks_passed.append("land_area_valid")
        
        # 5. Address completeness
        address = extracted_data.get("address")
        if not address and not extracted_data.get("kelurahan"):
            warnings.append({
                "field": "address",
                "code": "INCOMPLETE",
                "message": "Alamat tidak lengkap atau tidak terbaca"
            })
        else:
            checks_passed.append("address_present")
        
        # 6. OCR quality check (based on text)
        if len(raw_text) < 50:
            critical_errors.append({
                "code": "LOW_OCR_QUALITY",
                "message": "Kualitas gambar terlalu rendah, teks tidak terbaca dengan baik"
            })
        
        # Determine overall validity
        is_valid = len(critical_errors) == 0 and len(errors) == 0
        
        return {
            "is_valid": is_valid,
            "checks_passed": checks_passed,
            "errors": errors,
            "warnings": warnings,
            "critical_errors": critical_errors,
            "total_checks": len(required) + 4,  # required + format + name + area + address
            "passed_checks": len(checks_passed)
        }
    
    def _validate_certificate_format(self, cert_number: str, doc_type: str) -> bool:
        """Validate certificate number format"""
        # Basic check - should contain numbers
        if not re.search(r'\d+', cert_number):
            return False
        
        # Length check
        if len(cert_number) < 3:
            return False
        
        return True
    
    def _is_valid_name(self, name: str) -> bool:
        """Check if name looks valid"""
        # Should contain letters
        if not re.search(r'[A-Za-z]{2,}', name):
            return False
        
        # Shouldn't be all caps with no spaces (likely OCR garbage)
        if name.isupper() and ' ' not in name and len(name) > 20:
            return False
        
        return True
    
    def _parse_area(self, area_str: str) -> float:
        """Parse area string to float"""
        try:
            # Extract number from string like "150.5 m²"
            match = re.search(r'(\d+[\.,]?\d*)', area_str)
            if match:
                return float(match.group(1).replace(',', '.'))
        except:
            pass
        return None
```

### app/services/risk_scoring_service.py

```python
from typing import Dict

class RiskScoringService:
    """
    Risk Scoring Service for calculating document verification risk.
    
    Score: 0-100 (higher = safer)
    Level: LOW (70-100), MEDIUM (40-69), HIGH (0-39)
    """
    
    def __init__(self):
        # Weight configuration
        self.weights = {
            "ocr_confidence": 20,      # OCR quality
            "required_fields": 25,     # Required data present
            "format_validation": 15,   # Format checks passed
            "data_completeness": 20,   # Optional data present
            "document_type": 20,       # Document type reliability
        }
        
        # Document type base scores
        self.doc_type_scores = {
            "SHM": 100,   # Most reliable
            "SHGB": 90,
            "AJB": 70,
            "IMB": 60,
            "PBB": 50,
            "GIRIK": 40,  # Less reliable
        }
    
    async def calculate(
        self,
        extracted_data: dict,
        validation_result: dict,
        ocr_confidence: float,
        document_type: str
    ) -> dict:
        """
        Calculate risk score and level.
        
        Returns:
            Risk assessment with score, level, color, and breakdown
        """
        scores = {}
        
        # 1. OCR Confidence Score (0-20)
        ocr_score = min(ocr_confidence, 100) / 100 * self.weights["ocr_confidence"]
        scores["ocr_quality"] = {
            "score": round(ocr_score, 1),
            "max": self.weights["ocr_confidence"],
            "detail": f"OCR confidence: {ocr_confidence}%"
        }
        
        # 2. Required Fields Score (0-25)
        total_checks = validation_result.get("total_checks", 1)
        passed_checks = validation_result.get("passed_checks", 0)
        required_score = (passed_checks / total_checks) * self.weights["required_fields"]
        scores["data_extraction"] = {
            "score": round(required_score, 1),
            "max": self.weights["required_fields"],
            "detail": f"Passed {passed_checks}/{total_checks} checks"
        }
        
        # 3. Format Validation Score (0-15)
        errors = validation_result.get("errors", [])
        warnings = validation_result.get("warnings", [])
        penalty = len(errors) * 5 + len(warnings) * 2
        format_score = max(0, self.weights["format_validation"] - penalty)
        scores["format_check"] = {
            "score": round(format_score, 1),
            "max": self.weights["format_validation"],
            "detail": f"{len(errors)} errors, {len(warnings)} warnings"
        }
        
        # 4. Data Completeness Score (0-20)
        optional_fields = ["address", "land_area", "kelurahan", "kecamatan", "nib"]
        present = sum(1 for f in optional_fields if f in extracted_data and extracted_data[f])
        completeness_score = (present / len(optional_fields)) * self.weights["data_completeness"]
        scores["data_completeness"] = {
            "score": round(completeness_score, 1),
            "max": self.weights["data_completeness"],
            "detail": f"{present}/{len(optional_fields)} optional fields found"
        }
        
        # 5. Document Type Score (0-20)
        doc_base = self.doc_type_scores.get(document_type, 50)
        doc_score = (doc_base / 100) * self.weights["document_type"]
        scores["document_type"] = {
            "score": round(doc_score, 1),
            "max": self.weights["document_type"],
            "detail": f"{document_type} reliability: {doc_base}%"
        }
        
        # Calculate total score
        total_score = sum(s["score"] for s in scores.values())
        total_score = min(100, max(0, round(total_score)))
        
        # Determine risk level
        if total_score >= 70:
            risk_level = "LOW"
            color = "green"
            recommendation = "Dokumen terlihat valid. Tetap lakukan verifikasi fisik."
        elif total_score >= 40:
            risk_level = "MEDIUM"
            color = "yellow"
            recommendation = "Beberapa data perlu diverifikasi manual. Hubungi notaris."
        else:
            risk_level = "HIGH"
            color = "red"
            recommendation = "Dokumen berisiko tinggi. Sangat disarankan konsultasi legal."
        
        return {
            "total_score": total_score,
            "risk_level": risk_level,
            "color": color,
            "recommendation": recommendation,
            "breakdown": scores
        }
```

### app/db/__init__.py

```python
# Database
```

### app/db/database.py

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG
)

AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

### app/db/models.py

```python
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class VerificationResult(Base):
    __tablename__ = "verification_results"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    verification_id = Column(String(50), unique=True, nullable=False, index=True)
    document_type = Column(String(20), nullable=False)
    file_path = Column(String(500))
    
    # Extracted data
    extracted_data = Column(JSON, default={})
    raw_text = Column(Text)
    
    # Risk assessment
    risk_score = Column(Float, default=0)
    risk_level = Column(String(20), default="UNKNOWN")  # LOW, MEDIUM, HIGH
    
    # Validation
    validation_details = Column(JSON, default={})
    
    # Status
    verification_status = Column(String(20), default="PENDING")  # VERIFIED, NEEDS_REVIEW, REJECTED
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<VerificationResult {self.verification_id}>"
```

---

## 🐳 Docker Setup (Optional)

### Dockerfile

```dockerfile
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-ind \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download xx_ent_wiki_sm

# Copy application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### .gitignore

```
# Python
__pycache__/
*.py[cod]
*$py.class
venv/
.env

# Database
*.db
*.sqlite

# Uploads
uploads/*
!uploads/.gitkeep

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

### .env.example

```
DEBUG=false
DATABASE_URL=sqlite+aiosqlite:///./mypropertyku.db
UPLOAD_DIR=./uploads
ALLOWED_ORIGINS=https://mypropertyku.lovable.app,http://localhost:5173
```

---

## ☁️ Railway Deployment

### railway.toml

```toml
[build]
builder = "dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### Deploy Steps

1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repo
4. Add environment variables:
   - `DATABASE_URL` (Railway provides PostgreSQL)
   - `ALLOWED_ORIGINS`
5. Deploy!

---

## 🔗 Frontend Integration

After deploying, set the API URL as environment variable in Lovable:

```
VITE_VERIFICATION_API_URL=https://your-railway-app.railway.app
```

See `src/services/verificationService.ts` for the frontend integration code.
