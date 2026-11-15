import { ChevronDown, ChevronUp, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import type { ClauseFinding } from "../../types/analysis";
import AttentionBadge from "../shared/AttentionBadge";
import VerificationBadge from "../shared/VerificationBadge";

export default function ClauseCard({ finding }: { finding: ClauseFinding }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border bg-white transition-shadow ${
        finding.verification === "unverified"
          ? "border-red-200 bg-red-50/30"
          : "border-gray-200"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <AttentionBadge level={finding.attention_level} />
            <VerificationBadge status={finding.verification} />
          </div>
          <h4 className="font-medium text-gray-900">{finding.title}</h4>
          {!expanded && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {finding.explanation}
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Original Clause
            </p>
            <blockquote className="rounded border-l-4 border-primary-300 bg-gray-50 py-2 pl-3 pr-2 text-sm italic text-gray-700">
              "{finding.original_text}"
            </blockquote>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              What This Means
            </p>
            <p className="text-sm text-gray-700">{finding.explanation}</p>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Practical Implications
            </p>
            <p className="text-sm text-gray-700">{finding.implications}</p>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Why It Matters
            </p>
            <p className="text-sm text-gray-700">{finding.why_it_matters}</p>
          </div>

          {finding.questions_to_ask.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <MessageCircleQuestion className="h-3.5 w-3.5" />
                Questions to Ask
              </p>
              <ul className="space-y-1">
                {finding.questions_to_ask.map((q, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    • {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
