import { useEffect, useState } from "react";

interface LoadingStateProps {
  message?: string;
  isComplete?: boolean;
  onComplete?: () => void;
}

function LoadingState({
  message = "Carregando...",
  isComplete = false,
  onComplete,
}: LoadingStateProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + Math.random() * 15));
    }, 300);

    return () => clearInterval(interval);
  }, [isComplete]);

  useEffect(() => {
    if (!isComplete) return;

    const timeout = setTimeout(() => {
      onComplete?.();
    }, 400);

    return () => clearTimeout(timeout);
  }, [isComplete, onComplete]);

  const displayedProgress = isComplete ? 100 : progress;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
      <p className="font-bold text-ink">{message}</p>
      <div className="w-full max-w-xs h-6 bg-white border-[3px] border-ink rounded-full overflow-hidden">
        <div
          className="h-full bg-blue transition-all duration-300 ease-out"
          style={{ width: `${displayedProgress}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingState;
