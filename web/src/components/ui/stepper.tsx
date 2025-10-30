interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isActive = index <= current;
        return (
          <li key={step.title} className="flex-1">
            <div 
              className={`h-2 rounded-full ${
                isActive ? 'bg-[var(--accent)]' : 'bg-[var(--secondary)]/20'
              }`} 
            />
          </li>
        );
      })}
    </ol>
  );
}


