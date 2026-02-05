 import { useState, useEffect } from "react";
 import { useAuth } from "@/hooks/useAuth";
 import { supabase } from "@/integrations/supabase/client";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Skeleton } from "@/components/ui/skeleton";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { 
   FileText, 
   Calendar, 
   ShieldCheck, 
   AlertTriangle, 
   XCircle, 
   Clock,
   Eye,
   History
 } from "lucide-react";
 import { format } from "date-fns";
 import { id as localeId } from "date-fns/locale";
 import { VerificationResultCard } from "./VerificationResult";
 import type { VerificationResult, ExtractedData, RiskAssessment, ValidationDetails } from "@/services/verificationService";
 
 interface VerificationHistoryItem {
   id: string;
   verification_id: string;
   document_type: string;
   verification_status: string | null;
   risk_level: string | null;
   risk_score: number | null;
   risk_recommendation: string | null;
  extracted_data: unknown;
  validation_details: unknown;
   created_at: string;
 }
 
 export function VerificationHistory() {
   const { user } = useAuth();
   const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedItem, setSelectedItem] = useState<VerificationHistoryItem | null>(null);
 
   useEffect(() => {
     if (user) {
       fetchHistory();
     } else {
       setLoading(false);
     }
   }, [user]);
 
   const fetchHistory = async () => {
     if (!user) return;
 
     try {
       const { data, error } = await supabase
         .from("verification_results")
         .select("*")
         .eq("user_id", user.id)
         .order("created_at", { ascending: false })
         .limit(20);
 
       if (error) throw error;
       setHistory(data || []);
     } catch (error) {
       console.error("Error fetching verification history:", error);
     } finally {
       setLoading(false);
     }
   };
 
   const getStatusConfig = (status: string | null) => {
     switch (status?.toUpperCase()) {
       case "VERIFIED":
         return {
           label: "Terverifikasi",
           icon: ShieldCheck,
           className: "bg-accent/15 text-accent"
         };
       case "NEEDS_REVIEW":
         return {
           label: "Perlu Review",
           icon: Clock,
           className: "bg-warning/15 text-warning"
         };
       case "REJECTED":
         return {
           label: "Ditolak",
           icon: XCircle,
           className: "bg-destructive/15 text-destructive"
         };
       default:
         return {
           label: "Menunggu",
           icon: Clock,
           className: "bg-muted text-muted-foreground"
         };
     }
   };
 
   const getRiskConfig = (level: string | null) => {
     switch (level?.toUpperCase()) {
       case "LOW":
         return {
           label: "Risiko Rendah",
           className: "bg-accent/15 text-accent"
         };
       case "MEDIUM":
         return {
           label: "Risiko Sedang",
           className: "bg-warning/15 text-warning"
         };
       case "HIGH":
         return {
           label: "Risiko Tinggi",
           className: "bg-destructive/15 text-destructive"
         };
       default:
         return {
           label: "N/A",
           className: "bg-muted text-muted-foreground"
         };
     }
   };
 
   const convertToVerificationResult = (item: VerificationHistoryItem): VerificationResult => {
     return {
       success: true,
       verification_id: item.verification_id,
       verification_status: (item.verification_status?.toUpperCase() || "PENDING") as "VERIFIED" | "NEEDS_REVIEW" | "REJECTED" | "PENDING",
       risk_assessment: {
         total_score: item.risk_score || 0,
         risk_level: (item.risk_level?.toUpperCase() || "MEDIUM") as "LOW" | "MEDIUM" | "HIGH",
         color: item.risk_level?.toUpperCase() === "LOW" ? "green" : item.risk_level?.toUpperCase() === "HIGH" ? "red" : "yellow",
         recommendation: item.risk_recommendation || undefined
       } as RiskAssessment,
       extracted_data: (item.extracted_data || {}) as ExtractedData,
       validation_details: item.validation_details as unknown as ValidationDetails,
       created_at: item.created_at
     };
   };
 
   if (!user) {
     return (
       <Card className="bg-muted/50">
         <CardContent className="flex flex-col items-center justify-center py-12">
           <History className="w-12 h-12 text-muted-foreground mb-4" />
           <p className="text-muted-foreground text-center mb-4">
             Login untuk melihat riwayat verifikasi dokumen Anda
           </p>
           <Button variant="outline" asChild>
             <a href="/login">Login</a>
           </Button>
         </CardContent>
       </Card>
     );
   }
 
   if (loading) {
     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <History className="w-5 h-5" />
             Riwayat Verifikasi
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
               <Skeleton className="w-10 h-10 rounded-lg" />
               <div className="flex-1 space-y-2">
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-3 w-48" />
               </div>
               <Skeleton className="h-6 w-20 rounded-full" />
             </div>
           ))}
         </CardContent>
       </Card>
     );
   }
 
   if (history.length === 0) {
     return (
       <Card className="bg-muted/50">
         <CardContent className="flex flex-col items-center justify-center py-12">
           <FileText className="w-12 h-12 text-muted-foreground mb-4" />
           <p className="text-muted-foreground text-center">
             Belum ada riwayat verifikasi dokumen
           </p>
         </CardContent>
       </Card>
     );
   }
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <History className="w-5 h-5" />
           Riwayat Verifikasi
         </CardTitle>
         <CardDescription>
           {history.length} dokumen telah diverifikasi
         </CardDescription>
       </CardHeader>
       <CardContent className="space-y-3">
         {history.map((item) => {
           const statusConfig = getStatusConfig(item.verification_status);
           const riskConfig = getRiskConfig(item.risk_level);
           const StatusIcon = statusConfig.icon;
 
           return (
             <Dialog key={item.id}>
               <DialogTrigger asChild>
                 <div 
                   className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                   onClick={() => setSelectedItem(item)}
                 >
                   <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                     <FileText className="w-5 h-5 text-primary" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium text-foreground">
                       {item.document_type}
                     </p>
                     <p className="text-sm text-muted-foreground flex items-center gap-1">
                       <Calendar className="w-3 h-3" />
                       {format(new Date(item.created_at), "dd MMM yyyy, HH:mm", { locale: localeId })}
                     </p>
                   </div>
                   <div className="flex items-center gap-2">
                     <Badge className={statusConfig.className}>
                       <StatusIcon className="w-3 h-3 mr-1" />
                       {statusConfig.label}
                     </Badge>
                     <Badge variant="outline" className={riskConfig.className}>
                       {riskConfig.label}
                     </Badge>
                     <Eye className="w-4 h-4 text-muted-foreground" />
                   </div>
                 </div>
               </DialogTrigger>
               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                 <DialogHeader>
                   <DialogTitle className="flex items-center gap-2">
                     <FileText className="w-5 h-5" />
                     Detail Verifikasi - {item.document_type}
                   </DialogTitle>
                 </DialogHeader>
                 <VerificationResultCard result={convertToVerificationResult(item)} />
               </DialogContent>
             </Dialog>
           );
         })}
       </CardContent>
     </Card>
   );
 }