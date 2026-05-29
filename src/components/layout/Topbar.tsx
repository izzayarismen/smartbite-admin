import { Bell, Search } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-6 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Cari apa saja..."
              className="h-11 w-56 rounded-2xl border border-border bg-card/90 pl-10 pr-4 text-sm outline-none backdrop-blur-md transition-shadow focus:shadow-glow"
            />
          </div>

          <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card/90 backdrop-blur-md transition-colors hover:bg-accent">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/90 py-1.5 pl-1.5 pr-4 backdrop-blur-md">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-sm font-bold text-primary-foreground">
              R
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight">Admin Rama</p>
              <p className="text-[11px] text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
