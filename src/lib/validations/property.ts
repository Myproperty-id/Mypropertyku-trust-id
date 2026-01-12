import { z } from "zod";

// Maximum safe integer for property price (999 trillion)
const MAX_PRICE = 999_999_999_999_999;
const MIN_PRICE = 1;

// Property form validation schema
export const propertyFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul properti harus diisi")
    .max(200, "Judul properti maksimal 200 karakter"),
  
  description: z
    .string()
    .trim()
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .optional(),
  
  price: z
    .string()
    .min(1, "Harga harus diisi")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length > 0, "Harga harus diisi")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= MIN_PRICE;
    }, "Harga harus lebih dari 0")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num <= MAX_PRICE;
    }, "Harga melebihi batas maksimum"),
  
  property_type: z
    .string()
    .min(1, "Tipe properti harus dipilih"),
  
  certificate_type: z
    .enum(["shm", "shgb", "hpl", "girik", "ajb", "ppjb", ""])
    .optional(),
  
  address: z
    .string()
    .trim()
    .min(1, "Alamat harus diisi")
    .max(500, "Alamat maksimal 500 karakter"),
  
  city: z
    .string()
    .trim()
    .min(1, "Kota harus diisi")
    .max(100, "Nama kota maksimal 100 karakter"),
  
  province: z
    .string()
    .min(1, "Provinsi harus dipilih"),
  
  postal_code: z
    .string()
    .trim()
    .max(10, "Kode pos maksimal 10 karakter")
    .regex(/^[0-9]*$/, "Kode pos hanya boleh berisi angka")
    .optional()
    .or(z.literal("")),
  
  land_size: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val === "" || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0), {
      message: "Luas tanah harus berupa angka positif",
    })
    .optional()
    .or(z.literal("")),
  
  building_size: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val === "" || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0), {
      message: "Luas bangunan harus berupa angka positif",
    })
    .optional()
    .or(z.literal("")),
  
  bedrooms: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val === "" || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0), {
      message: "Jumlah kamar tidur harus berupa angka positif",
    })
    .optional()
    .or(z.literal("")),
  
  bathrooms: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val === "" || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0), {
      message: "Jumlah kamar mandi harus berupa angka positif",
    })
    .optional()
    .or(z.literal("")),
  
  floors: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val === "" || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0), {
      message: "Jumlah lantai harus berupa angka positif",
    })
    .optional()
    .or(z.literal("")),
  
  year_built: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => {
      if (val === "") return true;
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1800 && num <= 2100;
    }, {
      message: "Tahun dibangun harus antara 1800 dan 2100",
    })
    .optional()
    .or(z.literal("")),
  
  zoning_info: z
    .string()
    .trim()
    .max(200, "Informasi zonasi maksimal 200 karakter")
    .optional()
    .or(z.literal("")),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Helper to parse price string to number
export function parsePriceToNumber(priceString: string): number {
  const cleaned = priceString.replace(/\D/g, "");
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

// Helper to format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

// Authentication validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  
  password: z
    .string()
    .min(1, "Password harus diisi")
    .min(8, "Password minimal 8 karakter")
    .max(128, "Password maksimal 128 karakter"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Nama lengkap harus diisi")
    .max(100, "Nama maksimal 100 karakter"),
  
  email: z
    .string()
    .trim()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  
  phone: z
    .string()
    .trim()
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^[0-9+\-\s]*$/, "Nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(128, "Password maksimal 128 karakter")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
