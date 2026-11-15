import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import type { VerificationStatus } from "../../types/analysis";

const config: Record<
  VerificationStatus,
  { label: string; classes: string; Icon: typeof CheckCircle }
> = {
  verified: {
    label: "Verified",
    classes: "text-green-700",
    Icon: CheckCircle,
  },
  partial_match: {
    label: "Partially Verified",
    classes: "text-yellow-600",
    Icon: HelpCircle,
  },
  unverified: {
    label: "Not Verified",
    classes: "text-red-500",
    Icon: AlertCircle,
  },
};

export default function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  const { label, classes, Icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
