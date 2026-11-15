import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please upload a PDF file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Maximum size is 10MB.");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
        dragActive
          ? "border-primary-500 bg-primary-50"
          : "border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
      <p className="font-medium text-gray-700">
        Drop your PDF here, or click to browse
      </p>
      <p className="mt-1 text-sm text-gray-500">PDF files up to 10MB</p>
    </div>
  );
}
