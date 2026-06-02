import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, type Column } from "@/components/ui/data-table";
import axios from "axios";

// Pastikan interface memiliki properti 'id' agar sesuai dengan kontrak komponen DataTable
interface Customer {
  id: string; // Diperlukan oleh DataTable untuk indexing
  _id: string; // ID asli dari MongoDB Atlas
  nama: string;
  email: string;
  no_hp?: string;
  totalOrder: number;
}

export const Route = createFileRoute("/customer/")({
  head: () => ({
    meta: [
      { title: "Manajemen Customer — SmartBite Admin" },
      { nama: "description", content: "Kelola akun customer SmartBite." },
    ],
  }),
  component: CustomerPage,
});

function CustomerPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil Data dari API Backend (Pure CSR)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get("https://smartbitepjbl.vercel.app/api/auth/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.customers) {
          // 🔥 SOLUSI TS: Map data dari backend, kloning _id menjadi id agar DataTable tidak error
          const mappedCustomers = response.data.customers.map((c: any) => ({
            ...c,
            id: c._id, // Duplikasi kunci agar memuaskan type '{ id: string }' pada DataTable
          }));
          setData(mappedCustomers);
        }
      } catch (error: any) {
        console.error("Gagal mengambil data customer:", error);
        toast.error(error.response?.data?.message || "Gagal mengambil data customer dari server");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Fungsi Hapus Data Customer
  const remove = async (c: Customer) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus customer ${c.nama}?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `https://smartbitepjbl.vercel.app/api/auth/customers/${c._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success(response.data.message || `Customer ${c.nama} dihapus`);
        setData((d) => d.filter((x) => x._id !== c._id));
      } catch (error: any) {
        console.error("Gagal menghapus customer:", error);
        toast.error(error.response?.data?.message || "Gagal menghapus customer dari server");
      }
    }
  };

  // Konfigurasi Kolom DataTable (Gaya visual murni dipertahankan sepenuhnya)
  // Casting 'as Column<any>[]' untuk menghindari konflik inferensi type 'any' di internal DataTable
  const cols: Column<any>[] = [
    {
      key: "nama",
      header: "Nama",
      render: (c: any) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-xs font-bold text-primary-foreground">
            {c.nama ? c.nama.charAt(0) : "?"}
          </div>
          <p className="font-semibold">{c.nama}</p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (c: any) => <span className="text-muted-foreground">{c.email}</span>,
    },
    {
      key: "no_hp",
      header: "Nomor HP",
      render: (c: any) => <span className="text-muted-foreground">{c.no_hp || "-"}</span>,
    },
    {
      key: "totalOrder",
      header: "Total Order",
      render: (c: any) => <span className="font-semibold">{c.totalOrder ?? 0}</span>,
    },
    {
      key: "action",
      header: "Aksi",
      render: (c: any) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => remove(c)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
            title="Hapus Customer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Manajemen Customer" subtitle="Kelola akun pengguna platform">
      {loading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground animate-pulse">
          Sedang memuat data customer dari server...
        </div>
      ) : (
        <DataTable
          data={data as any}
          columns={cols}
          searchKeys={["nama", "email"]}
          searchPlaceholder="Cari nama / email..."
          onRowClick={(c) => navigate({ to: "/customer/$id", params: { id: c._id } })}
        />
      )}
    </AdminLayout>
  );
}
