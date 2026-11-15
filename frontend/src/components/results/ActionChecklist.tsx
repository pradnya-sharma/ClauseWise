import { useState } from "react";
import type { ActionItem } from "../../types/analysis";
import AttentionBadge from "../shared/AttentionBadge";

export default function ActionChecklist({ items }: { items: ActionItem[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No action items were generated.
      </p>
    );
  }

  const sortOrder = { high: 0, review: 1, informational: 2 } as const;
  const sorted = [...items].sort(
    (a, b) => sortOrder[a.priority] - sortOrder[b.priority],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {checked.size} of {items.length} reviewed
        </p>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${(checked.size / items.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <label
              key={item.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                isChecked
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(item.id)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm ${
                    isChecked
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {item.text}
                </p>
                <div className="mt-1">
                  <AttentionBadge level={item.priority} />
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
