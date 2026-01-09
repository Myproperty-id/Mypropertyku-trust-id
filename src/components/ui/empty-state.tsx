import { ReactNode } from "react";
import { FileX, Search, Home, Users, ClipboardList, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
        {icon || <Package className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        action.href ? (
          <Link to={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}

export function NoListingsEmpty() {
  return (
    <EmptyState
      icon={<Home className="w-8 h-8 text-muted-foreground" />}
      title="Belum Ada Properti"
      description="Anda belum memiliki properti yang terdaftar. Mulai dengan menambahkan properti pertama Anda."
      action={{
        label: "Tambah Properti",
        href: "/post-property",
      }}
    />
  );
}

export function NoSearchResultsEmpty({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-muted-foreground" />}
      title="Tidak Ditemukan"
      description="Tidak ada properti yang cocok dengan pencarian Anda. Coba ubah filter atau kata kunci pencarian."
      action={onReset ? {
        label: "Reset Filter",
        onClick: onReset,
      } : undefined}
    />
  );
}

export function NoVerificationRequestsEmpty() {
  return (
    <EmptyState
      icon={<ClipboardList className="w-8 h-8 text-muted-foreground" />}
      title="Tidak Ada Permintaan"
      description="Tidak ada permintaan verifikasi yang menunggu untuk ditinjau saat ini."
    />
  );
}

export function NoUsersEmpty() {
  return (
    <EmptyState
      icon={<Users className="w-8 h-8 text-muted-foreground" />}
      title="Tidak Ada Pengguna"
      description="Belum ada pengguna yang terdaftar di platform."
    />
  );
}
