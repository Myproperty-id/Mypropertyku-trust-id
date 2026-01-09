import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Search, Filter, Calendar, User, Clock, 
  ChevronDown, ChevronRight, Activity
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import Navbar from "@/components/layout/Navbar";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
}

const AdminAuditLog = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

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
      fetchLogs();
    }
  }, [user, isAdmin, filter]);

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (filter !== "all") {
      query = query.eq("entity_type", filter);
    }

    const { data, error } = await query;
    if (!error) {
      setLogs(data || []);
    }
    setLoading(false);
  };

  const getActionBadge = (action: string) => {
    if (action.includes("create") || action.includes("insert")) {
      return <Badge className="bg-accent/10 text-accent border-0">Create</Badge>;
    }
    if (action.includes("update")) {
      return <Badge className="bg-warning/10 text-warning border-0">Update</Badge>;
    }
    if (action.includes("delete")) {
      return <Badge variant="destructive">Delete</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container-main py-8">
          <TableSkeleton rows={10} columns={5} />
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
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground">Riwayat aktivitas dan perubahan sistem</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari aktivitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="property">Properti</SelectItem>
                <SelectItem value="verification">Verifikasi</SelectItem>
                <SelectItem value="user">Pengguna</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Logs */}
        {loading ? (
          <TableSkeleton rows={10} columns={5} />
        ) : filteredLogs.length === 0 ? (
          <EmptyState 
            icon={<Activity className="w-8 h-8 text-muted-foreground" />}
            title="Tidak Ada Log"
            description="Belum ada aktivitas yang tercatat dalam sistem."
          />
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{log.action}</span>
                        {getActionBadge(log.action)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {log.entity_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedLog === log.id ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {expandedLog === log.id && (
                  <div className="px-4 pb-4 border-t border-border pt-4 bg-muted/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {log.old_data && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Data Lama</h4>
                          <pre className="bg-muted rounded-lg p-3 text-xs overflow-auto max-h-48">
                            {JSON.stringify(log.old_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_data && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Data Baru</h4>
                          <pre className="bg-muted rounded-lg p-3 text-xs overflow-auto max-h-48">
                            {JSON.stringify(log.new_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                    {log.entity_id && (
                      <p className="text-xs text-muted-foreground mt-4">
                        Entity ID: {log.entity_id}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLog;
