import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
      <p className="mb-1 font-medium text-red-800">Something went wrong</p>
      <p className="text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
