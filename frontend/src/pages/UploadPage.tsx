import { FileSearch, Shield, Quote, ListChecks } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { healthCheck } from "../api/client";
import ErrorMessage from "../components/shared/ErrorMessage";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import FileUpload from "../components/upload/FileUpload";
import TextPaste from "../components/upload/TextPaste";
import { useAnalysis } from "../hooks/useAnalysis";

const features = [
  {
    Icon: FileSearch,
    title: "Clause Analysis",
    desc: "Identifies and categorizes important clauses across payment, privacy, liability, and more.",
  },
  {
    Icon: Quote,
    title: "Evidence-Backed",
    desc: "Every finding links to an exact quote from your document, independently verified.",
  },
  {
    Icon: Shield,
    title: "Attention Levels",
    desc: "Findings rated by importance so you know where to focus your attention first.",
  },
  {
    Icon: ListChecks,
    title: "Action Checklist",
    desc: "A practical checklist of things to verify or ask before you sign.",
  },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { loading, error, submitPdf, submitText, reset } = useAnalysis();

  useEffect(() => {
    healthCheck();
  }, []);

  const handleResult = async (
    fn: () => Promise<import("../types/analysis").AnalysisResponse | null>,
  ) => {
    const data = await fn();
    if (data) {
      navigate("/results", { state: data });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
          Know what you're agreeing to
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-600">
          Upload an agreement, terms of service, or contract. ClauseWise analyzes
          it and explains what it actually means for you — backed by evidence
          from the document.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={reset} />
        </div>
      )}

      <div className="space-y-4">
        <FileUpload
          onFileSelect={(file) => handleResult(() => submitPdf(file))}
          disabled={loading}
        />

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm font-medium text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <TextPaste
          onSubmit={(text) => handleResult(() => submitText(text))}
          disabled={loading}
        />
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {features.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <Icon className="mb-2 h-6 w-6 text-primary-600" />
            <h3 className="mb-1 font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
