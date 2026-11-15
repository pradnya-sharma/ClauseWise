import { FileText, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const phases = [
  { Icon: FileText, text: "Extracting text from document...", duration: 3000 },
  { Icon: Search, text: "Analyzing clauses and obligations...", duration: 8000 },
  { Icon: ShieldCheck, text: "Verifying findings against source...", duration: 0 },
];

export default function LoadingSpinner() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const duration = phases[phaseIndex]?.duration;
    if (!duration || phaseIndex >= phases.length - 1) return;
    const timer = setTimeout(() => setPhaseIndex((i) => i + 1), duration);
    return () => clearTimeout(timer);
  }, [phaseIndex]);

  const { Icon, text } = phases[phaseIndex];

  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <Icon className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">{text}</p>
      <p className="text-xs text-gray-400">This usually takes 10–20 seconds</p>
    </div>
  );
}
