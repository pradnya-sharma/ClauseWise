import { AlertTriangle, Eye, Info } from "lucide-react";
import type { AttentionLevel } from "../../types/analysis";

const config: Record<
  AttentionLevel,
  { label: string; classes: string; Icon: typeof Info }
> = {
  high: {
    label: "High Attention",
    classes: "bg-red-100 text-red-800 border-red-200",
    Icon: AlertTriangle,
  },
  review: {
    label: "Review",
    classes: "bg-amber-100 text-amber-800 border-amber-200",
    Icon: Eye,
  },
  informational: {
    label: "Informational",
    classes: "bg-blue-100 text-blue-800 border-blue-200",
    Icon: Info,
  },
};

export default function AttentionBadge({ level }: { level: AttentionLevel }) {
  const { label, classes, Icon } = config[level];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
