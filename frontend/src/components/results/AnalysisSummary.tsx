import { AlertTriangle, Eye, FileText, Info, Users } from "lucide-react";
import type { AnalysisSummary as SummaryType } from "../../types/analysis";

export default function AnalysisSummary({ summary }: { summary: SummaryType }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {summary.document_type}
            </h2>
          </div>
          {summary.parties_identified.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              {summary.parties_identified.join(" & ")}
            </div>
          )}
        </div>
      </div>

      <p className="mb-5 text-sm leading-relaxed text-gray-700">
        {summary.overall_risk_summary}
      </p>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          count={summary.high_attention_count}
          label="High Attention"
          bg="bg-red-50"
        />
        <StatCard
          icon={<Eye className="h-4 w-4 text-amber-500" />}
          count={summary.review_attention_count}
          label="Review"
          bg="bg-amber-50"
        />
        <StatCard
          icon={<Info className="h-4 w-4 text-blue-500" />}
          count={summary.info_attention_count}
          label="Informational"
          bg="bg-blue-50"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  count,
  label,
  bg,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  bg: string;
}) {
  return (
    <div className={`rounded-lg ${bg} p-3 text-center`}>
      <div className="mb-1 flex items-center justify-center gap-1.5">
        {icon}
        <span className="text-xl font-bold text-gray-900">{count}</span>
      </div>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}
