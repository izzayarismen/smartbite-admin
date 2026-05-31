import { Menu } from "lucide-react";

export function Topbar({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-6 px-4 py-5 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Buka menu"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border bg-card/90 text-foreground shadow-soft transition-shadow hover:shadow-glow lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
