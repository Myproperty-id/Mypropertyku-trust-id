 import { Badge } from "@/components/ui/badge";
 import { ShieldCheck, AlertTriangle, XCircle, Clock, HelpCircle } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 type RiskLevel = "low" | "medium" | "high" | null;
 type VerificationStatus = "verified" | "needs_review" | "rejected" | "pending" | null;
 
 interface VerificationBadgeProps {
   status?: VerificationStatus;
   riskLevel?: RiskLevel;
   riskScore?: number;
   showScore?: boolean;
   size?: "sm" | "md" | "lg";
   className?: string;
 }
 
 export function VerificationBadge({
   status,
   riskLevel,
   riskScore,
   showScore = false,
   size = "md",
   className
 }: VerificationBadgeProps) {
   const sizeClasses = {
     sm: "text-xs px-2 py-0.5",
     md: "text-sm px-2.5 py-1",
     lg: "text-base px-3 py-1.5"
   };
 
   const iconSizes = {
     sm: "w-3 h-3",
     md: "w-4 h-4",
     lg: "w-5 h-5"
   };
 
   const getStatusConfig = () => {
     switch (status) {
       case "verified":
         return {
           label: "Terverifikasi",
           icon: ShieldCheck,
           className: "bg-accent/15 text-accent border-accent/30"
         };
       case "needs_review":
         return {
           label: "Perlu Review",
           icon: Clock,
           className: "bg-warning/15 text-warning border-warning/30"
         };
       case "rejected":
         return {
           label: "Ditolak",
           icon: XCircle,
           className: "bg-destructive/15 text-destructive border-destructive/30"
         };
       case "pending":
         return {
           label: "Menunggu",
           icon: Clock,
           className: "bg-muted text-muted-foreground border-border"
         };
       default:
         return {
           label: "Belum Diverifikasi",
           icon: HelpCircle,
           className: "bg-muted text-muted-foreground border-border"
         };
     }
   };
 
   const getRiskConfig = () => {
     switch (riskLevel) {
       case "low":
         return {
           label: "Risiko Rendah",
           icon: ShieldCheck,
           className: "bg-accent/15 text-accent border-accent/30"
         };
       case "medium":
         return {
           label: "Risiko Sedang",
           icon: AlertTriangle,
           className: "bg-warning/15 text-warning border-warning/30"
         };
       case "high":
         return {
           label: "Risiko Tinggi",
           icon: AlertTriangle,
           className: "bg-destructive/15 text-destructive border-destructive/30"
         };
       default:
         return null;
     }
   };
 
   const statusConfig = getStatusConfig();
   const riskConfig = getRiskConfig();
   const StatusIcon = statusConfig.icon;
   const RiskIcon = riskConfig?.icon;
 
   return (
     <div className={cn("flex flex-wrap items-center gap-2", className)}>
       {/* Status Badge */}
       <Badge
         variant="outline"
         className={cn(
           "gap-1.5 font-semibold border",
           sizeClasses[size],
           statusConfig.className
         )}
       >
         <StatusIcon className={iconSizes[size]} />
         {statusConfig.label}
       </Badge>
 
       {/* Risk Level Badge */}
       {riskConfig && (
         <Badge
           variant="outline"
           className={cn(
             "gap-1.5 font-semibold border",
             sizeClasses[size],
             riskConfig.className
           )}
         >
           {RiskIcon && <RiskIcon className={iconSizes[size]} />}
           {riskConfig.label}
           {showScore && riskScore !== undefined && (
             <span className="ml-1 opacity-75">({riskScore}/100)</span>
           )}
         </Badge>
       )}
     </div>
   );
 }
 
 export function VerifiedBadge({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
   const iconSizes = {
     sm: "w-3 h-3",
     md: "w-4 h-4",
     lg: "w-5 h-5"
   };
 
   return (
     <Badge className="bg-accent text-accent-foreground gap-1">
       <ShieldCheck className={iconSizes[size]} />
       Verified
     </Badge>
   );
 }