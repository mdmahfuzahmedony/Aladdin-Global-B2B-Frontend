"use client";

type Props = {
  currentStep: number;
  steps: string[];
};

export default function WholesalerProgress({
  currentStep,
  steps,
}: Props) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex min-w-[700px] items-start justify-between">

        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const active =
            currentStep === stepNumber;

          const completed =
            currentStep > stepNumber;

          return (
            <div
              key={step}
              className="flex flex-1 items-start"
            >
              <div className="flex w-full flex-col items-center">

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                    active || completed
                      ? "bg-[#12233F] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {completed
                    ? "✓"
                    : stepNumber}
                </div>

                <span
                  className={`mt-2 text-[11px] font-semibold ${
                    active
                      ? "text-[#12233F]"
                      : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>

              {stepNumber < steps.length && (
                <div
                  className={`mt-4 h-[2px] w-full ${
                    completed
                      ? "bg-[#12233F]"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}