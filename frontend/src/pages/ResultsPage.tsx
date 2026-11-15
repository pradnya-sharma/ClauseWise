import { ArrowLeft, FileSearch, ListChecks, ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import ActionChecklist from "../components/results/ActionChecklist";
import AnalysisSummary from "../components/results/AnalysisSummary";
import ClauseCategory from "../components/results/ClauseCategory";
import ObligationsList from "../components/results/ObligationsList";
import type {
  AnalysisResponse,
  ClauseCategoryType,
  ClauseFinding,
} from "../types/analysis";

type Tab = "findings" | "obligations" | "actions";

const tabs: { key: Tab; label: string; Icon: typeof FileSearch }[] = [
  { key: "findings", label: "Findings", Icon: FileSearch },
  { key: "obligations", label: "Obligations", Icon: ScrollText },
  { key: "actions", label: "Action Checklist", Icon: ListChecks },
];

export default function ResultsPage() {
  const location = useLocation();
  const data = location.state as AnalysisResponse | null;
  const [activeTab, setActiveTab] = useState<Tab>("findings");

  const groupedFindings = useMemo(() => {
    if (!data) return {} as Partial<Record<ClauseCategoryType, ClauseFinding[]>>;
    return data.findings.reduce<
      Partial<Record<ClauseCategoryType, ClauseFinding[]>>
    >((acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category]!.push(f);
      return acc;
    }, {});
  }, [data]);

  if (!data) {
    return <Navigate to="/" replace />;
  }

  const categoryOrder: ClauseCategoryType[] = [
    "payment_financial",
    "auto_renewal_cancellation",
    "liability_indemnity",
    "termination_restrictions",
    "data_privacy",
    "ip_content_ownership",
    "other_obligations",
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Analyze Another Document
        </Link>
        {typeof data.metadata?.processing_time_ms === "number" && (
          <span className="text-xs text-gray-400">
            Analyzed in {(data.metadata.processing_time_ms / 1000).toFixed(1)}s
          </span>
        )}
      </div>

      <AnalysisSummary summary={data.summary} />

      <div className="mt-6 border-b border-gray-200">
        <nav className="flex gap-1">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {key === "findings" && (
                <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs">
                  {data.findings.length}
                </span>
              )}
              {key === "obligations" && (
                <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs">
                  {data.obligations.length}
                </span>
              )}
              {key === "actions" && (
                <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs">
                  {data.action_items.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "findings" && (
          <div className="space-y-8">
            {data.findings.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                No findings were identified in this document.
              </p>
            ) : (
              categoryOrder
                .filter((cat) => groupedFindings[cat]?.length)
                .map((cat) => (
                  <ClauseCategory
                    key={cat}
                    category={cat}
                    findings={groupedFindings[cat]!}
                  />
                ))
            )}
          </div>
        )}

        {activeTab === "obligations" && (
          <ObligationsList obligations={data.obligations} />
        )}

        {activeTab === "actions" && (
          <ActionChecklist items={data.action_items} />
        )}
      </div>

      <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-xs text-amber-700">
        This analysis is for informational purposes only and does not constitute
        legal advice. Always consult a qualified attorney before making legal
        decisions.
      </div>
    </div>
  );
}
