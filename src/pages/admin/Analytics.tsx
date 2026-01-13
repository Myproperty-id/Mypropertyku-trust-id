import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, TrendingUp, Users, Building2, FileCheck, 
  Calendar, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import Navbar from "@/components/layout/Navbar";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalProperties: number;
  totalUsers: number;
  pendingVerifications: number;
  approvedVerifications: number;
  rejectedVerifications: number;
  propertiesByType: { name: string; value: number }[];
  propertiesByProvince: { name: string; value: number }[];
  verificationsByMonth: { month: string; approved: number; rejected: number; pending: number }[];
}

const AdminAnalytics = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalUsers: 0,
    pendingVerifications: 0,
    approvedVerifications: 0,
    rejectedVerifications: 0,
    propertiesByType: [],
    propertiesByProvince: [],
    verificationsByMonth: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

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
    }
  }, [user, isAdmin, timeRange]);

  const fetchStats = async () => {
    setLoading(true);

    // Fetch basic counts
    const [
      propertiesRes,
      usersRes,
      pendingRes,
      approvedRes,
      rejectedRes,
      propertiesData,
    ] = await Promise.all([
      supabase.from("properties").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("properties").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
      supabase.from("properties").select("id", { count: "exact", head: true }).eq("verification_status", "approved"),
      supabase.from("properties").select("id", { count: "exact", head: true }).eq("verification_status", "rejected"),
      supabase.from("properties").select("property_type, province, verification_status, created_at"),
    ]);

    // Process property types
    const typeCount: Record<string, number> = {};
    const provinceCount: Record<string, number> = {};
    const monthlyStats: Record<string, { approved: number; rejected: number; pending: number }> = {};

    (propertiesData.data || []).forEach(property => {
      // Count by type
      typeCount[property.property_type] = (typeCount[property.property_type] || 0) + 1;
      
      // Count by province
      provinceCount[property.province] = (provinceCount[property.province] || 0) + 1;
      
      // Count by month and status
      const month = new Date(property.created_at).toLocaleString("id-ID", { month: "short" });
      if (!monthlyStats[month]) {
        monthlyStats[month] = { approved: 0, rejected: 0, pending: 0 };
      }
      if (property.verification_status === "approved") {
        monthlyStats[month].approved++;
      } else if (property.verification_status === "rejected") {
        monthlyStats[month].rejected++;
      } else {
        monthlyStats[month].pending++;
      }
    });

    setStats({
      totalProperties: propertiesRes.count || 0,
      totalUsers: usersRes.count || 0,
      pendingVerifications: pendingRes.count || 0,
      approvedVerifications: approvedRes.count || 0,
      rejectedVerifications: rejectedRes.count || 0,
      propertiesByType: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
      propertiesByProvince: Object.entries(provinceCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value })),
      verificationsByMonth: Object.entries(monthlyStats).map(([month, data]) => ({
        month,
        ...data,
      })),
    });

    setLoading(false);
  };

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--warning))",
    "hsl(var(--destructive))",
    "hsl(var(--muted-foreground))",
  ];

  const chartConfig = {
    approved: {
      label: "Disetujui",
      color: "hsl(var(--accent))",
    },
    rejected: {
      label: "Ditolak",
      color: "hsl(var(--destructive))",
    },
    pending: {
      label: "Menunggu",
      color: "hsl(var(--warning))",
    },
  } satisfies ChartConfig;

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

  const approvalRate = stats.totalProperties > 0 
    ? ((stats.approvedVerifications / stats.totalProperties) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container-main py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analitik</h1>
            <p className="text-muted-foreground">Statistik dan insight platform</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rentang waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 hari terakhir</SelectItem>
              <SelectItem value="30d">30 hari terakhir</SelectItem>
              <SelectItem value="90d">90 hari terakhir</SelectItem>
              <SelectItem value="all">Semua waktu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-accent">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalProperties}</p>
            <p className="text-sm text-muted-foreground">Total Properti</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <Badge variant="outline" className="text-accent">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +8%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
            <p className="text-sm text-muted-foreground">Total Pengguna</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pendingVerifications}</p>
            <p className="text-sm text-muted-foreground">Menunggu Verifikasi</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{approvalRate}%</p>
            <p className="text-sm text-muted-foreground">Tingkat Persetujuan</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Verification Status Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Status Verifikasi Bulanan</h3>
            {stats.verificationsByMonth.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={stats.verificationsByMonth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="approved" fill="var(--color-approved)" radius={4} />
                  <Bar dataKey="rejected" fill="var(--color-rejected)" radius={4} />
                  <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Belum ada data
              </div>
            )}
          </div>

          {/* Property Types Pie Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Properti berdasarkan Tipe</h3>
            {stats.propertiesByType.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.propertiesByType}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.propertiesByType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Belum ada data
              </div>
            )}
          </div>
        </div>

        {/* Top Provinces */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Top 5 Provinsi</h3>
          {stats.propertiesByProvince.length > 0 ? (
            <div className="space-y-4">
              {stats.propertiesByProvince.map((province, index) => (
                <div key={province.name} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{province.name}</span>
                      <span className="text-sm text-muted-foreground">{province.value} properti</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ 
                          width: `${(province.value / (stats.propertiesByProvince[0]?.value || 1)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Belum ada data properti
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;