import type { Obligation } from "../../types/analysis";
import { OBLIGATION_TYPE_LABELS } from "../../types/analysis";
import AttentionBadge from "../shared/AttentionBadge";
import VerificationBadge from "../shared/VerificationBadge";

export default function ObligationsList({
  obligations,
}: {
  obligations: Obligation[];
}) {
  const grouped = obligations.reduce(
    (acc, ob) => {
      const key = ob.obligation_type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(ob);
      return acc;
    },
    {} as Record<string, Obligation[]>,
  );

  if (obligations.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No specific obligations were identified.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type}>
          <h3 className="mb-3 text-base font-semibold text-gray-800">
            {OBLIGATION_TYPE_LABELS[type] || type}
          </h3>
          <div className="space-y-2">
            {items.map((ob) => (
              <div
                key={ob.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <AttentionBadge level={ob.attention_level} />
                  <VerificationBadge status={ob.verification} />
                </div>
                <p className="mb-2 text-sm text-gray-800">{ob.description}</p>
                <blockquote className="rounded border-l-4 border-gray-200 bg-gray-50 py-1.5 pl-3 pr-2 text-xs italic text-gray-500">
                  "{ob.original_text}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
