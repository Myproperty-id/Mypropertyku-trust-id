import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, Eye, Search,
  Filter, FileText, Building2, ChevronDown, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { NoVerificationRequestsEmpty } from "@/components/ui/empty-state";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  city: string;
  province: string;
  price: number;
  property_type: string;
  certificate_type: string | null;
  verification_status: string;
  user_id: string;
  created_at: string;
}

const AdminVerifications = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isAdmin) {
        navigate("/403");
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchProperties();
    }
  }, [user, isAdmin, filter]);

  const fetchProperties = async () => {
    setLoading(true);
    let query = supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      if (filter === "pending") {
        query = query.in("verification_status", ["pending", "in_review"]);
      } else {
        query = query.eq("verification_status", filter as "pending" | "in_review" | "approved" | "rejected");
      }
    }

    const { data, error } = await query;
    if (!error) {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleAction = async () => {
    if (!selectedProperty || !actionType) return;
    
    setProcessing(true);
    
    const newStatus = actionType === "approve" ? "approved" : "rejected";
    const riskLevel = actionType === "approve" ? "low" : null;
    
    const { error } = await supabase
      .from("properties")
      .update({
        verification_status: newStatus,
        risk_level: riskLevel,
        risk_notes: notes || null,
        is_published: actionType === "approve",
      })
      .eq("id", selectedProperty.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "Berhasil", 
        description: `Properti berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}` 
      });
      fetchProperties();
    }

    setProcessing(false);
    setSelectedProperty(null);
    setActionType(null);
    setNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-accent/10 text-accent border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Disetujui</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>;
      case "in_review":
        return <Badge className="bg-warning/10 text-warning border-0"><AlertTriangle className="w-3 h-3 mr-1" /> Dalam Review</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCertificateLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      shm: "SHM",
      shgb: "SHGB",
      hpl: "HPL",
      girik: "Girik",
      ajb: "AJB",
      ppjb: "PPJB",
    };
    return type ? labels[type] || type : "-";
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container-main py-8">
          <TableSkeleton rows={8} columns={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container-main py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Verifikasi Properti</h1>
          <p className="text-muted-foreground">Tinjau dan verifikasi properti yang terdaftar</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari properti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pending">Menunggu Review</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : filteredProperties.length === 0 ? (
          <NoVerificationRequestsEmpty />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Properti</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lokasi</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Sertifikat</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Harga</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tanggal</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">{property.title}</p>
                            <p className="text-sm text-muted-foreground">{property.property_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {property.city}, {property.province}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{getCertificateLabel(property.certificate_type)}</Badge>
                      </td>
                      <td className="p-4 text-sm font-medium text-foreground">
                        Rp {property.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(property.verification_status)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(property.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/property/${property.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {(property.verification_status === "pending" || property.verification_status === "in_review") && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-accent hover:bg-accent/90"
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setActionType("approve");
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Setujui
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setActionType("reject");
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Tolak
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Approval/Rejection Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => { setActionType(null); setNotes(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Setujui Properti" : "Tolak Properti"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Properti akan ditandai sebagai terverifikasi dan dipublikasikan."
                : "Properti akan ditolak dan pemilik akan diberitahu."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="notes">Catatan {actionType === "reject" && "(wajib)"}</Label>
            <Textarea 
              id="notes"
              placeholder={actionType === "approve" ? "Catatan opsional..." : "Alasan penolakan..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setActionType(null); setNotes(""); }}>
              Batal
            </Button>
            <Button 
              onClick={handleAction}
              disabled={processing || (actionType === "reject" && !notes)}
              className={actionType === "approve" ? "bg-accent hover:bg-accent/90" : ""}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              {processing ? "Memproses..." : actionType === "approve" ? "Setujui" : "Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVerifications;
