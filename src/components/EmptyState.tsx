import miyuMascot from "../assets/miyu-mascot.jpeg";

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <img
        src={miyuMascot}
        alt="Miyu"
        className="w-20 h-20 rounded-full border-[3px] border-ink object-cover mb-4 -rotate-6"
      />
      <p className="text-ink/60 font-medium max-w-xs">{message}</p>
    </div>
  );
}

export default EmptyState;
