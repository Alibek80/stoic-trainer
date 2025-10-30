interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  return (
    <div className="w-full h-2 bg-[var(--secondary)]/20 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[var(--accent)]" 
        style={{ width: `${clampedValue}%` }} 
      />
    </div>
  );
}


