import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ClauseCategoryType, ClauseFinding } from "../../types/analysis";
import { CATEGORY_LABELS } from "../../types/analysis";
import ClauseCard from "./ClauseCard";

interface ClauseCategoryProps {
  category: ClauseCategoryType;
  findings: ClauseFinding[];
}

export default function ClauseCategory({
  category,
  findings,
}: ClauseCategoryProps) {
  const [collapsed, setCollapsed] = useState(false);

  const highCount = findings.filter((f) => f.attention_level === "high").length;

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-3 flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-800">
            {CATEGORY_LABELS[category]}
          </h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {findings.length}
          </span>
          {highCount > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              {highCount} high
            </span>
          )}
        </div>
        {collapsed ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {!collapsed && (
        <div className="space-y-3">
          {findings.map((finding) => (
            <ClauseCard key={finding.id} finding={finding} />
          ))}
        </div>
      )}
    </div>
  );
}
