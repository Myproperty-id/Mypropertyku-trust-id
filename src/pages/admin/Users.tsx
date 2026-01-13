import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users as UsersIcon, Search, Filter, Shield, UserCog, 
  Eye, Ban, CheckCircle2, AlertTriangle, Mail, Calendar
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  kyc_status: string | null;
  created_at: string;
  roles?: string[];
}

const AdminUsers = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState("");
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
      fetchUsers();
    }
  }, [user, isAdmin, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      setLoading(false);
      return;
    }

    // Fetch roles for all users
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
    }

    // Merge roles into profiles
    const usersWithRoles = (profiles || []).map(profile => ({
      ...profile,
      roles: (roles || [])
        .filter(r => r.user_id === profile.user_id)
        .map(r => r.role)
    }));

    // Apply filter
    let filteredUsers = usersWithRoles;
    if (filter === "admin") {
      filteredUsers = usersWithRoles.filter(u => u.roles?.includes("admin"));
    } else if (filter === "agent") {
      filteredUsers = usersWithRoles.filter(u => u.roles?.includes("agent"));
    } else if (filter === "verified") {
      filteredUsers = usersWithRoles.filter(u => u.kyc_status === "verified");
    } else if (filter === "pending") {
      filteredUsers = usersWithRoles.filter(u => u.kyc_status === "pending");
    }

    setUsers(filteredUsers);
    setLoading(false);
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    setProcessing(true);
    
    // Add new role via edge function for security
    const { data, error } = await supabase.functions.invoke("admin-verify-property", {
      body: {
        action: "add_role",
        userId: selectedUser.user_id,
        role: newRole,
      },
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: `Role ${newRole} berhasil ditambahkan` });
      fetchUsers();
    }

    setProcessing(false);
    setShowRoleDialog(false);
    setSelectedUser(null);
    setNewRole("");
  };

  const getKycBadge = (status: string | null) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-accent/10 text-accent border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Terverifikasi</Badge>;
      case "pending":
        return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="outline">Belum KYC</Badge>;
    }
  };

  const getRoleBadge = (roles: string[] = []) => {
    if (roles.includes("admin")) {
      return <Badge className="bg-primary/10 text-primary border-0"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
    }
    if (roles.includes("agent")) {
      return <Badge className="bg-accent/10 text-accent border-0"><UserCog className="w-3 h-3 mr-1" /> Agent</Badge>;
    }
    return <Badge variant="outline">User</Badge>;
  };

  const filteredUsers = users.filter(u =>
    (u.full_name?.toLowerCase().includes(search.toLowerCase())) ||
    (u.phone?.includes(search))
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
          <h1 className="text-2xl font-bold text-foreground">Kelola Pengguna</h1>
          <p className="text-muted-foreground">Lihat dan kelola semua pengguna platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Pengguna</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Admin</p>
            <p className="text-2xl font-bold text-foreground">
              {users.filter(u => u.roles?.includes("admin")).length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Agent</p>
            <p className="text-2xl font-bold text-foreground">
              {users.filter(u => u.roles?.includes("agent")).length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">KYC Verified</p>
            <p className="text-2xl font-bold text-foreground">
              {users.filter(u => u.kyc_status === "verified").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari pengguna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="verified">KYC Verified</SelectItem>
                <SelectItem value="pending">KYC Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : filteredUsers.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada pengguna</h3>
            <p className="text-muted-foreground">Belum ada pengguna yang terdaftar.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pengguna</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Telepon</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">KYC Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bergabung</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((profile) => (
                    <tr key={profile.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile.avatar_url || ""} />
                            <AvatarFallback>
                              {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{profile.full_name || "Tanpa Nama"}</p>
                            <p className="text-sm text-muted-foreground">{profile.user_id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {profile.phone || "-"}
                      </td>
                      <td className="p-4">
                        {getRoleBadge(profile.roles)}
                      </td>
                      <td className="p-4">
                        {getKycBadge(profile.kyc_status)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(profile.created_at).toLocaleDateString("id-ID")}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/profile/${profile.user_id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(profile);
                              setShowRoleDialog(true);
                            }}
                          >
                            <UserCog className="w-4 h-4 mr-1" />
                            Role
                          </Button>
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

      {/* Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Role Pengguna</DialogTitle>
            <DialogDescription>
              Pilih role baru untuk {selectedUser?.full_name || "pengguna ini"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleRoleChange}
              disabled={processing || !newRole}
            >
              {processing ? "Memproses..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;