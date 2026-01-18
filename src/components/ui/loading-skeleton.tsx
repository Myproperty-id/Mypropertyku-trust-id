import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PropertyCardSkeleton() {
  return (
    <div className="card-property overflow-hidden">
      {/* Image skeleton with shimmer */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 skeleton-shimmer" />
        {/* Badge placeholders */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="absolute top-4 right-4">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        {/* Price and risk badge */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        {/* Features */}
        <div className="flex gap-5 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      {/* Table */}
      <TableSkeleton />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
