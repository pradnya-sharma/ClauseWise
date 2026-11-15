import { useState } from "react";
import { analyzePdf, analyzeText } from "../api/client";
import type { AnalysisResponse } from "../types/analysis";

interface AnalysisState {
  loading: boolean;
  error: string | null;
  data: AnalysisResponse | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    data: null,
  });

  const submitPdf = async (file: File) => {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await analyzePdf(file);
      setState({ loading: false, error: null, data });
      return data;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Analysis failed";
      setState({ loading: false, error: message, data: null });
      return null;
    }
  };

  const submitText = async (text: string) => {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await analyzeText(text);
      setState({ loading: false, error: null, data });
      return data;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Analysis failed";
      setState({ loading: false, error: message, data: null });
      return null;
    }
  };

  const reset = () => setState({ loading: false, error: null, data: null });

  return { ...state, submitPdf, submitText, reset };
}
