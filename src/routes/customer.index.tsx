import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, Ban, RotateCcw, ShieldCheck } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { customers as seed, type Customer } from "@/lib/data";

export const Route = createFileRoute("/customer/")({
  head: () => ({
    meta: [
      { title: "Manajemen Customer — SmartBite Admin" },
      { name: "description", content: "Kelola akun customer SmartBite." },
    ],
  }),
  component: CustomerPage,
});

function CustomerPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>(seed);
  const [statusFilter, setStatusFilter] = useState("all");

  const setStatus = (c: Customer, status: Customer["status"], msg: string) => {
    setData((d) => d.map((x) => (x.id === c.id ? { ...x, status } : x)));
    toast.success(msg);
  };

  const filtered = data.filter((c) => statusFilter === "all" || c.status === statusFilter);

  const cols: Column<Customer>[] = [
    {
      key: "name", header: "Customer", render: (c) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-xs font-bold text-primary-foreground">{c.name.charAt(0)}</div>
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "No. HP", render: (c) => <span className="text-muted-foreground">{c.phone}</span> },
    { key: "order", header: "Total Order", render: (c) => <span className="font-semibold">{c.totalOrder}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge variant={c.status === "active" ? "success" : "danger"}>{c.status === "active" ? "Aktif" : "Suspended"}</StatusBadge> },
    {
      key: "action", header: "Aksi", render: (c) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => navigate({ to: "/customer/$id", params: { id: c.id } })} className="grid h-9 w-9 place-items-center rounded-xl border border-border transition-colors hover:bg-accent" title="Detail"><Eye className="h-4 w-4" /></button>
          {c.status === "active" ? (
            <button onClick={() => setStatus(c, "suspended", `${c.name} ditangguhkan`)} className="grid h-9 w-9 place-items-center rounded-xl border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10" title="Suspend"><Ban className="h-4 w-4" /></button>
          ) : (
            <button onClick={() => setStatus(c, "active", `${c.name} diaktifkan kembali`)} className="grid h-9 w-9 place-items-center rounded-xl border border-success/30 text-success transition-colors hover:bg-success/10" title="Aktifkan"><ShieldCheck className="h-4 w-4" /></button>
          )}
          <button onClick={() => toast.success(`Akun ${c.name} direset`)} className="grid h-9 w-9 place-items-center rounded-xl border border-border transition-colors hover:bg-accent" title="Reset"><RotateCcw className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Manajemen Customer" subtitle="Kelola akun pengguna platform">
      <DataTable
        data={filtered}
        columns={cols}
        searchKeys={["name", "email"]}
        searchPlaceholder="Cari nama / email..."
        onRowClick={(c) => navigate({ to: "/customer/$id", params: { id: c.id } })}
        filters={[{
          label: "Status", value: statusFilter, onChange: setStatusFilter,
          options: [
            { label: "Semua Status", value: "all" },
            { label: "Aktif", value: "active" },
            { label: "Suspended", value: "suspended" },
          ],
        }]}
      />
    </AdminLayout>
  );
}
