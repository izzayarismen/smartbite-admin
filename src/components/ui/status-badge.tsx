import { cn } from "@/lib/utils";

type Variant = "success" | "danger" | "warning" | "info" | "neutral";

const styles: Record<Variant, string> = {
  success: "bg-success/12 text-success",
  danger: "bg-destructive/12 text-destructive",
  warning: "bg-warning/20 text-warning-foreground",
  info: "bg-primary/12 text-primary",
  neutral: "bg-muted text-muted-foreground",
};

export function StatusBadge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[variant],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
