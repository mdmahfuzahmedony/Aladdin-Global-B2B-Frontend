"use client";

type AffiliateProgressProps = {
  currentStep: number;
};

const steps = [
  {
    id: 1,
    title: "Personal",
  },
  {
    id: 2,
    title: "Platform",
  },
  {
    id: 3,
    title: "Audience",
  },
  {
    id: 4,
    title: "Payout",
  },
  {
    id: 5,
    title: "Security",
  },
  {
    id: 6,
    title: "Review",
  },
];

export default function AffiliateProgress({
  currentStep,
}: AffiliateProgressProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[620px] items-center justify-between">
        {steps.map((step, index) => {
          const active = currentStep === step.id;
          const completed = currentStep > step.id;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all",
                    active
                      ? "bg-amber-500 text-white shadow-md"
                      : completed
                        ? "bg-[#12233f] text-white"
                        : "bg-gray-100 text-gray-400",
                  ].join(" ")}
                >
                  {step.id}
                </div>

                <span
                  className={[
                    "mt-2 text-xs font-medium",
                    active || completed
                      ? "text-[#12233f]"
                      : "text-gray-400",
                  ].join(" ")}
                >
                  {step.title}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={[
                    "mx-2 h-px flex-1 transition-all",
                    completed
                      ? "bg-[#12233f]"
                      : "bg-gray-200",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}