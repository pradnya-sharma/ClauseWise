import { FileText } from "lucide-react";
import { useState } from "react";

interface TextPasteProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function TextPaste({ onSubmit, disabled }: TextPasteProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 50) {
      alert("Please paste at least 50 characters of agreement text.");
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
        <FileText className="h-4 w-4" />
        Paste agreement text
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Paste the full text of the agreement, terms of service, privacy policy, or contract here..."
        className="h-48 w-full resize-y rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none disabled:opacity-50"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {text.length.toLocaleString()} characters
        </span>
        <button
          onClick={handleSubmit}
          disabled={disabled || text.trim().length < 50}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Analyze Text
        </button>
      </div>
    </div>
  );
}
