import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface Filter {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKeys,
  searchPlaceholder = "Cari...",
  filters,
  onRowClick,
  pageSize = 6,
}: {
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  searchPlaceholder?: string;
  filters?: Filter[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return data.filter((row) =>
      q === ""
        ? true
        : searchKeys.some((k) => String(row[k]).toLowerCase().includes(q)),
    );
  }, [data, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages - 1);
  const rows = filtered.slice(current * pageSize, current * pageSize + pageSize);

  return (
    <div className="rounded-3xl border border-white/40 bg-card/90 p-4 shadow-soft backdrop-blur-md sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-shadow focus:shadow-glow sm:w-72"
          />
        </div>
        {filters && (
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <select
                key={f.label}
                value={f.value}
                onChange={(e) => {
                  f.onChange(e.target.value);
                  setPage(0);
                }}
                className="h-11 rounded-2xl border border-border bg-background px-3 text-sm font-medium outline-none transition-shadow focus:shadow-glow"
              >
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground ${c.className ?? ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border/60 transition-colors hover:bg-accent/40 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3.5 text-sm ${c.className ?? ""}`}>
                    {c.render(row)}
                  </td>
                ))}
              </motion.tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Menampilkan {rows.length} dari {filtered.length} data
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background transition-colors hover:bg-accent disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold">
            {current + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={current >= totalPages - 1}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background transition-colors hover:bg-accent disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
