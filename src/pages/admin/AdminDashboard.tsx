import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ClipboardList, Users, FileText, Settings,
  CheckCircle2, XCircle, Clock, AlertTriangle, Eye, ChevronRight,
  Building2, TrendingUp, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import Navbar from "@/components/layout/Navbar";

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingVerification: 0,
    verified: 0,
    totalUsers: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      fetchStats();
      fetchRecentRequests();
    }
  }, [user, isAdmin]);

  const fetchStats = async () => {
    const [propertiesRes, pendingRes, verifiedRes, usersRes] = await Promise.all([
      supabase.from("properties").select("id", { count: "exact", head: true }),
      supabase.from("properties").select("id", { count: "exact", head: true }).in("verification_status", ["pending", "in_review"]),
      supabase.from("properties").select("id", { count: "exact", head: true }).eq("verification_status", "approved"),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    setStats({
      totalProperties: propertiesRes.count || 0,
      pendingVerification: pendingRes.count || 0,
      verified: verifiedRes.count || 0,
      totalUsers: usersRes.count || 0,
    });
  };

  const fetchRecentRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("verification_requests")
      .select(`
        *,
        properties:property_id (title, city, province),
        profiles:requested_by (full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(5);
    
    setRecentRequests(data || []);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-accent/10 text-accent border-0">Disetujui</Badge>;
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "in_review":
        return <Badge className="bg-warning/10 text-warning border-0">Dalam Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container-main py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container-main py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola verifikasi dan pantau platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              <Shield className="w-3 h-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properti</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalProperties}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Menunggu Verifikasi</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingVerification}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terverifikasi</p>
                <p className="text-2xl font-bold text-foreground">{stats.verified}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pengguna</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/verifications" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Verifikasi</h3>
                  <p className="text-sm text-muted-foreground">Kelola verifikasi</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          
          <Link to="/admin/users" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Pengguna</h3>
                  <p className="text-sm text-muted-foreground">Kelola pengguna</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link to="/admin/analytics" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Analitik</h3>
                  <p className="text-sm text-muted-foreground">Statistik platform</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          
          <Link to="/admin/audit-log" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Audit Log</h3>
                  <p className="text-sm text-muted-foreground">Riwayat aktivitas</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

        {/* Recent Verification Requests */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Permintaan Verifikasi Terbaru</h2>
            <Link to="/admin/verifications">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {recentRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Belum ada permintaan verifikasi
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Properti</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pemohon</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tanggal</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{request.properties?.title || "-"}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.properties?.city}, {request.properties?.province}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {request.profiles?.full_name || "-"}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4 text-right">
                        <Link to={`/admin/verifications/${request.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
